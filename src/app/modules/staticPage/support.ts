import { Request, Response } from "express";

export const getStaticSupport = (_req: Request, res: Response) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Support Contact Us - Classaty</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        max-width: 800px;
        margin: 40px auto;
        padding: 0 20px;
        color: #333;
      }
      h1 {
        color: #28314e;
        text-align: center;
      }
      h2 {
        color: #28314e;
        margin-top: 30px;
      }
      ul {
        margin-top: 5px;
        margin-bottom: 20px;
        padding-left: 20px;
      }
      strong {
        color: #000;
      }
      footer {
        margin-top: 50px;
        text-align: center;
        font-size: 0.9rem;
        color: #777;
      }
    </style>
  </head>
  <body>
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f6f6fa;">
      <div style="background-color: #fff; padding: 24px 32px; border-radius: 8px; box-shadow: 0px 2px 12px rgba(0,0,0,0.1); text-align: left; max-width: 400px;">
        <h3 style="margin-bottom: 16px; font-weight: 600; font-family: sans-serif;">Welcome to Classaty Support</h3>
        <p style="margin: 4px 0;">
          Thank you for using the Classaty School Management App! We're here to assist you with any questions or issues you may have.
        </p>

        <h2>Frequently Asked Questions (FAQ)</h2>
        <ul>
          <li><strong>How do I register my child?</strong> <br /> Simply go to the registration section in the app and fill in the necessary details for your child.</li>
          <li><strong>How can I reset my password?</strong> <br /> Go to the login page, click on "Forgot Password," and follow the instructions to reset it.</li>
          <li><strong>How can I contact support?</strong> <br /> You can contact us via email at <a href="mailto:support@classaty.com" style="color: #28314e; text-decoration: none;">support@classaty.com</a> or use the live chat feature within the app.</li>
        </ul>

        <h2>Contact Support</h2>
        <p>If you need further assistance, please feel free to reach out to us at:</p>
        <p style="margin: 4px 0;">
          <strong>Email:</strong> <a href="mailto:support@classaty.com" style="color: #28314e; text-decoration: none;">likuwt@gmail.com</a>
        </p>
        <p style="margin: 4px 0;">
          <strong>Phone:</strong> <a href="tel:+96590910600" style="color: #28314e; text-decoration: none;">+965 90910600</a>
        </p>
      </div>
    </div>

    <footer>© 2025 Classaty. All rights reserved.</footer>
  </body>
  </html>
  `;

  res.send(html);
};
