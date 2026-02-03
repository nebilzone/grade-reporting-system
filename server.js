const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log("EMAIL:", process.env.EMAIL_USER);
console.log("PASS LENGTH:", process.env.EMAIL_PASS?.length);
app.use(cors());
app.use(bodyParser.json());

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send approval email
app.post("/api/send-approval", async (req, res) => {
  const { name, email, password, studentId } = req.body;

  if (!name || !email || !password || !studentId) {
    return res.status(400).json({
      error: "All fields are required",
    });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Student Account Has Been Approved",
    html: `
      <h3>Hello ${name},</h3>
      <p>Your student account has been <b>approved</b>.</p>

      <p><b>Login Details:</b></p>
      <ul>
        <li>Student ID: ${studentId}</li>
        <li>Email: ${email}</li>
        <li>Password: ${password}</li>
      </ul>

      <p>You can now log in using your email and password.</p>
      <p><b>Please change your password after first login.</b></p>

      <br/>
      <p>Regards,<br/>Student Registration System</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Approval email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
