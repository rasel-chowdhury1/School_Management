import express from 'express';
import { getStaticPrivacyPolicy } from './privacyPolicy';
import { getStaticSupport } from './support';

const router = express.Router();

router
  .get('/privacy-policy', getStaticPrivacyPolicy)
  .get("/support", getStaticSupport);

export const staticPageRoutes =  router;