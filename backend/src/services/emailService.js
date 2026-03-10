import transporter from "../config/nodemailer.js";

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Vanni AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code - Vanni AI 🔐",
    priority: "high",
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "High",
    },
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0; padding:0; background-color:#F0F4FF; font-family:'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F4FF; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:20px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%); padding: 36px 40px; text-align:center;">
              <div style="font-size:42px; margin-bottom:8px;">🔐</div>
              <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:800; letter-spacing:-0.5px;">Verify It's You!</h1>
              <p style="margin:8px 0 0; color:rgba(255,255,255,0.85); font-size:15px;">One quick step to get started</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 20px;">
              <p style="margin:0 0 24px; color:#444; font-size:16px; line-height:1.6;">
                Hey there! 👋 Use the verification code below to confirm your identity on <strong style="color:#FF6B35;">Vanni AI</strong>.
              </p>

              <!-- OTP Box -->
              <div style="background: linear-gradient(135deg, #FFF4EF, #FFF9F7); border: 2px dashed #FF6B35; border-radius:16px; padding: 28px; text-align:center; margin: 0 0 24px;">
                <p style="margin:0 0 8px; font-size:13px; color:#888; text-transform:uppercase; letter-spacing:2px; font-weight:600;">Your OTP Code</p>
                <div style="font-size:48px; font-weight:900; letter-spacing:14px; color:#FF6B35; font-family:'Courier New', monospace;">
                  ${otp}
                </div>
                <p style="margin:12px 0 0; font-size:13px; color:#e74c3c; font-weight:600;">⏱️ Expires in 5 minutes</p>
              </div>

              <!-- Warning Box -->
              <div style="background:#FFF8E1; border-left:4px solid #FFC107; border-radius:8px; padding:14px 18px; margin-bottom:24px;">
                <p style="margin:0; font-size:13px; color:#7D6608;">
                  🚨 <strong>Never share this code</strong> with anyone. Vanni AI will never ask for your OTP.
                </p>
              </div>

              <p style="margin:0; color:#888; font-size:14px; line-height:1.6;">
                Didn't request this? You can safely ignore this email. Someone may have entered your email by mistake.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border:none; border-top:1px solid #eee;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 36px; text-align:center;">
              <p style="margin:0 0 6px; font-size:20px;">🇮🇳</p>
              <p style="margin:0; font-size:13px; color:#aaa; font-style:italic;">Apni Awaaz, Apna English</p>
              <p style="margin:8px 0 0; font-size:12px; color:#ccc;">© ${new Date().getFullYear()} Vanni AI. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP email:", error);
    return false;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: `"Vanni AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Vanni AI! 🎉",
    priority: "high",
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "High",
    },
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0; padding:0; background-color:#F0F4FF; font-family:'Segoe UI', Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F4FF; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:20px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1B4F72 0%, #2E86C1 100%); padding: 40px; text-align:center;">
              <div style="font-size:52px; margin-bottom:10px;">🎉</div>
              <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:800; letter-spacing:-0.5px;">Welcome to Vanni AI!</h1>
              <p style="margin:10px 0 0; color:rgba(255,255,255,0.85); font-size:15px;">Your English learning journey starts now 🚀</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 36px 40px 10px;">
              <h2 style="margin:0 0 12px; color:#1B4F72; font-size:22px;">Hey ${name}! 👋</h2>
              <p style="margin:0; color:#555; font-size:15px; line-height:1.7;">
                We're so excited to have you join the <strong style="color:#FF6B35;">Vanni AI</strong> family! 
                You've taken the first step toward speaking English with confidence. 💪
              </p>
            </td>
          </tr>

          <!-- Features -->
          <tr>
            <td style="padding: 24px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">

                <tr>
                  <td style="background:#F0F8FF; border-radius:12px; padding:16px 20px; margin-bottom:12px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:28px; padding-right:14px;">🗣️</td>
                        <td>
                          <strong style="color:#1B4F72; font-size:15px;">Speak & Practice</strong>
                          <p style="margin:4px 0 0; color:#666; font-size:13px;">Talk to Vanni anytime, anywhere</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr><td style="height:10px;"></td></tr>

                <tr>
                  <td style="background:#FFF4EF; border-radius:12px; padding:16px 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:28px; padding-right:14px;">🧠</td>
                        <td>
                          <strong style="color:#FF6B35; font-size:15px;">AI-Powered Feedback</strong>
                          <p style="margin:4px 0 0; color:#666; font-size:13px;">Get instant corrections & suggestions</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr><td style="height:10px;"></td></tr>

                <tr>
                  <td style="background:#F0FFF4; border-radius:12px; padding:16px 20px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:28px; padding-right:14px;">📈</td>
                        <td>
                          <strong style="color:#27AE60; font-size:15px;">Track Your Progress</strong>
                          <p style="margin:4px 0 0; color:#666; font-size:13px;">Watch your English improve daily</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 10px 40px 36px; text-align:center;">
              <a href="${process.env.CLIENT_URL}" style="
                display:inline-block;
                background: linear-gradient(135deg, #FF6B35, #FF8C42);
                color:#ffffff;
                text-decoration:none;
                padding:16px 40px;
                border-radius:50px;
                font-size:16px;
                font-weight:700;
                letter-spacing:0.3px;
                box-shadow: 0 4px 15px rgba(255,107,53,0.4);
              ">Start Learning Now 🚀</a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border:none; border-top:1px solid #eee;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 36px; text-align:center;">
              <p style="margin:0 0 6px; font-size:20px;">🇮🇳</p>
              <p style="margin:0; font-size:13px; color:#aaa; font-style:italic;">Apni Awaaz, Apna English</p>
              <p style="margin:8px 0 0; font-size:12px; color:#ccc;">© ${new Date().getFullYear()} Vanni AI · All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    return false;
  }
};
