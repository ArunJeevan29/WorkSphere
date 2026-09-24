const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: `WorkSphere <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Reset Your WorkSphere Password",

    html: `
      <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:40px 20px;">
        <div style="max-width:520px; margin:auto; background:white; border:1px solid #e2e8f0; border-radius:16px; padding:32px;">

          <div style="margin-bottom:24px;">
            <h1 style="margin:0; color:#0f172a; font-size:24px;">
              WorkSphere
            </h1>
            <p style="margin:6px 0 0; color:#94a3b8; font-size:13px;">
              Access & Workspace Management
            </p>
          </div>

          <h2 style="color:#0f172a; font-size:22px;">
            Reset your password
          </h2>

          <p style="color:#64748b; line-height:1.6; font-size:14px;">
            We received a request to reset your WorkSphere password.
            Click the button below to create a new password.
          </p>

          <div style="margin:28px 0;">
            <a
              href="${resetUrl}"
              style="
                display:inline-block;
                background:#7c3aed;
                color:white;
                text-decoration:none;
                padding:13px 22px;
                border-radius:8px;
                font-size:14px;
                font-weight:600;
              "
            >
              Reset Password
            </a>
          </div>

          <p style="color:#64748b; font-size:13px; line-height:1.6;">
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p style="color:#94a3b8; font-size:12px; line-height:1.6;">
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

          <div style="border-top:1px solid #e2e8f0; margin-top:28px; padding-top:18px;">
            <p style="margin:0; color:#94a3b8; font-size:11px;">
              WorkSphere · Role-based workspace management
            </p>
          </div>

        </div>
      </div>
    `,
  });
};

module.exports = sendPasswordResetEmail;
