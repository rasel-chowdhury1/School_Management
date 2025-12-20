/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Types } from 'mongoose';
import { USER_ROLE } from '../../constant';
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import { getSchoolIdFromUser } from '../../utils/getSchoolIdForManager';
import Level from '../level/level.model';
import Student from '../student/student.model';
import { TeacherService } from '../teacher/teacher.service';
import { IClassSection, ILevelClassesFlat, TClass } from './class.interface';
import Class from './class.model';
import { sanitizeSections } from './class.utils';
import { generateRoutineForSection } from '../classRoutine/classRoutine.utils';
import { ClassRoutine } from '../classRoutine/classRoutine.model';
import Parents from '../parents/parents.model';
import User from '../user/user.model';

const createClass = async (payload: Partial<TClass>, user: TAuthUser) => {
  const findLevel = await Level.findById(payload.levelId);
  if (!findLevel) throw new Error('Level not found');

  // Assign schoolId based on role
  const schoolId = getSchoolIdFromUser(user);
  const section = payload?.section?.map((item) => item).join(' / ');

  const result = await Class.create({
    ...payload,
    levelName: findLevel.levelName,
    schoolId,
    section,
  });

  return result;
};

const createClassWithRoutines = async (payload: Partial<TClass>, user: TAuthUser) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const findLevel = await Level.findById(payload.levelId).session(session);
    if (!findLevel) throw new Error("Level not found");

    const schoolId = getSchoolIdFromUser(user);

    // Sanitize sections
    const sections = sanitizeSections(payload.section);

    console.log({sections});

    if (sections.length === 0) throw new Error("No valid sections provided");

    // Convert sections to string for Class model
    const sectionString = sections;


    const existingClasses = await Class.find({ schoolId, className: payload.className?.trim() }).session(session);

    if (existingClasses.length > 0) throw new Error('Class already exists for this School');

    // Create Class
    const newClass = await Class.create(
      [
        {
          ...payload,
          levelName: findLevel.levelName,
          schoolId,
          section: sectionString,
        },
      ],
      { session }
    );

    console.log({
          ...payload,
          levelName: findLevel.levelName,
          schoolId,
          section: sectionString,
        });
    // Generate routines for each section
    for (const sec of sections) {
      await generateRoutineForSection(schoolId,newClass[0]._id, sec, session);
    }

    await session.commitTransaction();
    session.endSession();

    return newClass[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllClasses = async (user: TAuthUser, id: string) => {
  const schoolId = getSchoolIdFromUser(user);
  const result = await Class.find({ schoolId, levelId: id });
  return result;
};

const getAllClassSectionsOfSchool = async (schoolId: string): Promise<IClassSection[]> => {
  
  const classes = await Class.find({ schoolId });

  const result: IClassSection[] = [];

  for (const cls of classes) {
    for (const section of cls.section) {
      const totalStudents = await Student.countDocuments({
        classId: cls._id,
        section,
      });

      result.push({
        classId: cls._id.toString(),
        className: cls.className,
        levelName: cls.levelName,
        section,
        totalStudents,
      });
    }
  }

  return result;
};


const getAllClassesGroupedByLevel = async (
  schoolId: string
): Promise<ILevelClassesFlat[]> => {
  const schoolObjId = new Types.ObjectId(schoolId);

  // Fetch classes of the school
  const classes = await Class.find({ schoolId: schoolObjId }).lean();

  const levelMap = new Map<string, ILevelClassesFlat>();

  for (const cls of classes) {
    // Create level entry if not exists
    if (!levelMap.has(cls.levelId.toString())) {
      levelMap.set(cls.levelId.toString(), {
        levelId: cls.levelId.toString(),
        levelName: cls.levelName,
        classes: [],
      });
    }

    // For each section → create separate entry
    for (const section of cls.section) {
      const totalStudents = await Student.countDocuments({
        classId: cls._id,
        section,
      });

      levelMap.get(cls.levelId.toString())?.classes.push({
        classId: cls._id.toString(),
        className: cls.className,
        section,
        totalStudents,
      });
    }
  }

  return Array.from(levelMap.values());
};

const updateClass = async (id: string, payload: Partial<TClass>) => {
  const section = payload?.section?.map((item) => item);

  const result = await Class.findByIdAndUpdate(
    id,
    { ...payload, section },
    { new: true },
  );
  return result;
};

// const deleteClass = async (id: string) => {
//   const result = await Class.findByIdAndDelete(id);
//   return result;
// };


// when deleting a class delete all the routines with students, parents and users  for that class 
const deleteClass = async (classId: string) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Delete the class
    const deletedClass = await Class.findByIdAndDelete(classId, { session });
    if (!deletedClass) {
      throw new Error("Class not found");
    }

    // 2️⃣ Delete class routines
    await ClassRoutine.deleteMany({ classId: classId }, { session });

    // 3️⃣ Find students of this class
    const students = await Student.find({ classId: classId }, null, { session });
    const studentIds = students.map((s) => s._id);

    // 4️⃣ Delete related parents
    await Parents.deleteMany({ childId: { $in: studentIds } }, { session });

    // 5️⃣ Delete related users (students)
    await User.deleteMany({ studentId: { $in: studentIds } }, { session });

    // 6️⃣ Delete students
    await Student.deleteMany({ _id: { $in: studentIds } }, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      message: "Class and related data deleted successfully",
      deletedClass,
    };
  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


const getClassBySchoolId = async (
  id: string,
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  if (user.role === USER_ROLE.school) {
    id = user.schoolId;
  } else if (user.role === USER_ROLE.teacher) {
    const findTeacher = await TeacherService.findTeacher(user);
    id = findTeacher?.schoolId as any;
  } else if (user.role === USER_ROLE.supperAdmin) {
    id = query.schoolId as any;
  }

  const result = await Class.find({ schoolId: id });
  return result;
};

const getSectionsByClassId = async (id: string) => {
  const result = await Class.findById(id);
  const section = result?.section
    ?.map((item) => item.replace(/\s*\/\s*/g, ','))
    .join(',')
    .split(',');

  return section;
};

const getStudentsOfClasses = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {

  const { className, section, classId } = query;

  const findTeacher = await TeacherService.findTeacher(user);

  const matchConditions: Record<string, any>[] = [
    {
      schoolId: new mongoose.Types.ObjectId(String(findTeacher.schoolId)),
    }
  ];

  // Always match className if provided
  if (className) {
    matchConditions.push({ className });
  }

  // Conditionally add section if provided
  if (section) {
    matchConditions.push({ section });
  }

  if (classId) {
    matchConditions.push({
      classId: new mongoose.Types.ObjectId(String(classId)),
    });
  }

  console.log("match query =>>> ", matchConditions);
  const studentQuery = new AggregationQueryBuilder(query);

  const result = await studentQuery
    .customPipeline([
      {
        $match: {
          $and: matchConditions,
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          studentId: '$_id',
          studentName: '$user.name',
          userId: '$user._id',
          parentsMessage: 1,
          isTerminated: 1,
          summoned: 1,
        },
      },
    ])
    .sort()
    .paginate()
    .execute(Student);

  const meta = await studentQuery.countTotal(Student);

  return { meta, result };
};

export const ClassService = {
  createClass,
  createClassWithRoutines,
  getAllClasses,
  updateClass,
  deleteClass,
  getClassBySchoolId,
  getSectionsByClassId,
  getStudentsOfClasses,
  getAllClassSectionsOfSchool,
  getAllClassesGroupedByLevel
};
