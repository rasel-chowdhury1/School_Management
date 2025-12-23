import { Request, Response } from "express";

export const getStaticPrivacyPolicy = (_req: Request, res: Response) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Privacy Policy - Classaty School Management App</title>
    <style>
      :root {
        --color-primary-color: #fff;
        --color-secondary-color: #28314e;
        --color-base-color: #262621;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.7;
        max-width: 900px;
        margin: 40px auto;
        padding: 0 20px;
        color: var(--color-base-color);
        background-color: #faf7ff;
      }

      h1 {
        color: var(--color-secondary-color);
        text-align: center;
      }

      h2 {
        color: var(--color-secondary-color);
        margin-top: 30px;
        font-size: 1.3rem;
      }

      ul {
        margin-top: 5px;
        margin-bottom: 20px;
        padding-left: 20px;
      }

      strong {
        color: #000;
      }

      p {
        margin-bottom: 12px;
      }

      footer {
        margin-top: 50px;
        text-align: center;
        font-size: 0.9rem;
        color: #777;
      }

      a {
        color: var(--color-secondary-color);
      }
    </style>
  </head>
  <body>
    <h1>Privacy Policy of Classaty School Management App</h1>
    <p><strong>Last updated:</strong> 8th September 2025</p>

    <h2>1. Introduction</h2>
    <p>This Privacy Policy explains how we collect, use, and protect your personal information when using the Classaty School Management App. By using the app, you agree to the collection and use of information in accordance with this policy.</p>

    <h2>2. Information We Collect</h2>
    <p><strong>Personal Data:</strong> We collect personal data such as name, email, contact details, and student information for providing services related to school management.</p>
    <p><strong>Usage Data:</strong> We collect information on how the app is accessed and used, including your device type, IP address, and browsing activities.</p>

    <h2>3. How We Use Your Data</h2>
    <ul>
      <li>To provide and maintain our services;</li>
      <li>To notify you about updates and changes to our services;</li>
      <li>To monitor and analyze usage for improving app functionality.</li>
    </ul>

    <h2>4. Data Security</h2>
    <p>We use reasonable security measures to protect your personal data. However, no method of data transmission over the internet is 100% secure.</p>

    <h2>5. Data Sharing</h2>
    <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except for when required by law.</p>

    <h2>6. Cookies</h2>
    <p>The app may use cookies to enhance the user experience. You can choose to accept or refuse cookies through your device settings.</p>

    <h2>7. Your Rights</h2>
    <p>You have the right to access, correct, or delete your personal data stored by us. You can also request to restrict certain data usage.</p>

    <h2>8. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. We will notify users of any significant changes through the app or by other communication means.</p>

    <h2>9. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@classaty.com">likuwt@gmail.com</a>.</p>

    <footer>© 2025 <strong style="color: var(--color-secondary-color);">Classaty</strong>. All rights reserved.</footer>
  </body>
  </html>
  `;

  res.send(html);
};