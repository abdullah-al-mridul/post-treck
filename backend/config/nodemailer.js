import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - Post Treck",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #000000;
              background-color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
            }
            .card {
              background: #ffffff;
              border: 2px solid #000000;
              padding: 32px;
              margin-bottom: 24px;
            }
            .logo {
              font-size: 24px;
              font-weight: 900;
              margin-bottom: 24px;
              text-align: center;
            }
            .heading {
              font-size: 20px;
              font-weight: 700;
              margin-bottom: 16px;
            }
            .text {
              font-size: 16px;
              margin-bottom: 24px;
              color: rgba(0, 0, 0, 0.7);
            }
            .code {
              display: inline-block;
              background-color: #000000;
              color: #ffffff;
              padding: 12px 24px;
              font-family: monospace;
              font-size: 24px;
              font-weight: 600;
              letter-spacing: 4px;
              border: none;
              margin: 16px 0;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: rgba(0, 0, 0, 0.5);
              margin-top: 32px;
            }
            @media (prefers-color-scheme: dark) {
              body {
                background-color: #15202B;
                color: #ffffff;
              }
              .card {
                background-color: #15202B;
                border-color: #38444d;
              }
              .text {
                color: rgba(255, 255, 255, 0.7);
              }
              .code {
                background-color: rgba(247, 249, 249, 0.1);
                color: #f7f9f9;
              }
              .footer {
                color: rgba(255, 255, 255, 0.5);
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="logo">POST TRECK</div>
              <h1 class="heading">Verify Your Email Address</h1>
              <p class="text">
                Thanks for signing up for Post Treck! Please use the verification code below to verify your email address.
              </p>
              <div style="text-align: center;">
                <div class="code">${code}</div>
              </div>
              <p class="text">
                This code will expire in 10 minutes. If you didn't create an account with Post Treck, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Post Treck. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default transporter;
