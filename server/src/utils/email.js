import nodemailer from "nodemailer";
import config from "../config/config.js";

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_PORT === 465,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

const buildEmailHtml = ({ subject, message }) => {
  // Extract URL from the message if one exists
  const urlMatch = message.match(/https?:\/\/[^\s]+/);
  const url = urlMatch ? urlMatch[0] : null;

  // Remove URL from the main message
  const bodyText = url ? message.replace(url, "").trim() : message;

  // Detect a 4-8 digit OTP/code if present in the message
  const otpMatch = bodyText.match(/\b\d{4,8}\b/);
  const otp = otpMatch ? otpMatch[0] : null;

  // Remove OTP from normal body text when displaying it separately
  const cleanBodyText = otp
    ? bodyText.replace(otp, "").replace(/\n{2,}/g, "\n").trim()
    : bodyText;

  // Determine CTA label from subject/message
  const lowerContent = `${subject} ${message}`.toLowerCase();

  let buttonText = "Open EventSphere";

  if (
    lowerContent.includes("verify") ||
    lowerContent.includes("verification")
  ) {
    buttonText = "Verify Email";
  } else if (
    lowerContent.includes("reset") ||
    lowerContent.includes("password")
  ) {
    buttonText = "Reset Password";
  } else if (
    lowerContent.includes("confirm") ||
    lowerContent.includes("confirmation")
  ) {
    buttonText = "Confirm";
  }

  // Convert new lines into safe HTML breaks
  const formattedBody = cleanBodyText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${subject}</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f5f7fa;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  color:#172033;
">

  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="width:100%; background:#f5f7fa;"
  >
    <tr>
      <td align="center" style="padding:48px 16px;">

        <!-- Main container -->
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            max-width:560px;
            background:#ffffff;
            border:1px solid #e6e9ef;
            border-radius:16px;
            overflow:hidden;
          "
        >

          <!-- Header -->
          <tr>
            <td
              style="
                padding:26px 36px;
                border-bottom:1px solid #edf0f4;
                background:#ffffff;
              "
            >
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>

                  <td valign="middle">

                    <table
                      role="presentation"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                    >
                      <tr>

                        <!-- Brand mark -->
                        <td
                          valign="middle"
                          style="
                            width:34px;
                            height:34px;
                            background:#173b7a;
                            border-radius:9px;
                            text-align:center;
                            vertical-align:middle;
                          "
                        >
                          <span
                            style="
                              display:inline-block;
                              color:#ffffff;
                              font-size:15px;
                              font-weight:700;
                              line-height:34px;
                            "
                          >
                            E
                          </span>
                        </td>

                        <td style="width:10px;"></td>

                        <!-- Brand -->
                        <td valign="middle">
                          <span
                            style="
                              font-size:17px;
                              line-height:22px;
                              font-weight:700;
                              color:#172033;
                              letter-spacing:-0.2px;
                            "
                          >
                            ${config.APP_NAME}
                          </span>
                        </td>

                      </tr>
                    </table>

                  </td>

                  <td
                    align="right"
                    valign="middle"
                    style="
                      font-size:11px;
                      line-height:16px;
                      font-weight:600;
                      color:#8a93a3;
                      letter-spacing:0.4px;
                      text-transform:uppercase;
                    "
                  >
                    Event Management
                  </td>

                </tr>
              </table>
            </td>
          </tr>


          <!-- Main content -->
          <tr>
            <td style="padding:42px 36px 38px;">

              <!-- Subject -->
              <h1
                style="
                  margin:0 0 14px;
                  padding:0;
                  font-size:25px;
                  line-height:32px;
                  font-weight:700;
                  letter-spacing:-0.5px;
                  color:#172033;
                "
              >
                ${subject}
              </h1>


              <!-- Message -->
              <div
                style="
                  margin:0 0 28px;
                  font-size:15px;
                  line-height:25px;
                  color:#596477;
                "
              >
                ${formattedBody}
              </div>


              ${
                otp
                  ? `
                    <!-- OTP -->
                    <table
                      role="presentation"
                      width="100%"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="margin:0 0 30px;"
                    >
                      <tr>
                        <td
                          align="center"
                          style="
                            padding:24px 20px;
                            background:#f7f9fc;
                            border:1px solid #e4e8ef;
                            border-radius:12px;
                          "
                        >

                          <div
                            style="
                              margin:0 0 8px;
                              font-size:11px;
                              line-height:16px;
                              font-weight:700;
                              color:#7b8494;
                              text-transform:uppercase;
                              letter-spacing:1.2px;
                            "
                          >
                            Verification Code
                          </div>

                          <div
                            style="
                              font-size:30px;
                              line-height:38px;
                              font-weight:700;
                              letter-spacing:7px;
                              color:#173b7a;
                              padding-left:7px;
                            "
                          >
                            ${otp}
                          </div>

                        </td>
                      </tr>
                    </table>
                  `
                  : ""
              }


              ${
                url
                  ? `
                    <!-- CTA -->
                    <table
                      role="presentation"
                      cellpadding="0"
                      cellspacing="0"
                      border="0"
                      style="margin:0 0 28px;"
                    >
                      <tr>
                        <td
                          align="center"
                          style="
                            border-radius:9px;
                            background:#173b7a;
                          "
                        >
                          <a
                            href="${url}"
                            target="_blank"
                            style="
                              display:inline-block;
                              padding:13px 22px;
                              border:1px solid #173b7a;
                              border-radius:9px;
                              background:#173b7a;
                              color:#ffffff !important;
                              font-size:14px;
                              line-height:20px;
                              font-weight:600;
                              text-decoration:none;
                            "
                          >
                            ${buttonText}
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- URL fallback -->
                    <div
                      style="
                        padding:15px 16px;
                        background:#fafbfc;
                        border:1px solid #edf0f3;
                        border-radius:8px;
                        font-size:11px;
                        line-height:18px;
                        color:#8a93a3;
                        word-break:break-all;
                      "
                    >
                      <strong style="color:#687386;">
                        Having trouble with the button?
                      </strong>
                      <br />
                      Copy and paste this link into your browser:
                      <br /><br />
                      <span style="color:#687386;">
                        ${url}
                      </span>
                    </div>
                  `
                  : ""
              }

            </td>
          </tr>


          <!-- Security note -->
          <tr>
            <td
              style="
                padding:22px 36px;
                background:#fafbfc;
                border-top:1px solid #edf0f3;
              "
            >

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >
                <tr>

                  <td
                    valign="top"
                    style="
                      width:28px;
                      font-size:16px;
                      color:#687386;
                    "
                  >
                    •
                  </td>

                  <td
                    valign="top"
                    style="
                      font-size:12px;
                      line-height:19px;
                      color:#8a93a3;
                    "
                  >
                    If you didn't request this email, you can safely ignore
                    it. Your account remains secure.
                  </td>

                </tr>
              </table>

            </td>
          </tr>


          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                padding:24px 36px 28px;
                background:#ffffff;
              "
            >

              <div
                style="
                  margin:0 0 6px;
                  font-size:12px;
                  line-height:18px;
                  font-weight:600;
                  color:#687386;
                "
              >
                ${config.APP_NAME}
              </div>

              <div
                style="
                  margin:0;
                  font-size:11px;
                  line-height:17px;
                  color:#a0a8b5;
                "
              >
                Expo &amp; Event Management Platform
              </div>

              <div
                style="
                  margin:12px 0 0;
                  font-size:10px;
                  line-height:16px;
                  color:#b0b7c2;
                "
              >
                This is an automated email. Please do not reply directly.
              </div>

            </td>
          </tr>

        </table>


        <!-- Outside footer -->
        <div
          style="
            max-width:560px;
            margin:18px auto 0;
            font-size:10px;
            line-height:16px;
            color:#a7afbb;
            text-align:center;
          "
        >
          © ${new Date().getFullYear()} ${config.APP_NAME}. All rights reserved.
        </div>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const info = await transporter.sendMail({
      from: config.EMAIL_FROM,
      to: email,
      subject,
      text: message,
      html: buildEmailHtml({
        subject,
        message,
      }),
    });

    return info;
  } catch (error) {
    console.error("EMAIL ERROR");
    console.error(error);
    throw error;
  }
};