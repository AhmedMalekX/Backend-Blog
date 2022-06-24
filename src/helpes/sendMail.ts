import * as nodemailer from "nodemailer";
import { htmlTemplateForEmail } from "./emailTemplate";

export const sendMail = async (receiverEmail, subject, token) => {
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
      user: process.env.SENDINBLUE_EMAIL,
      pass: process.env.SENDINBLUE_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SENDINBLUE_EMAIL,
    to: receiverEmail,
    subject,
    html: htmlTemplateForEmail(token),
  };

  await transporter.sendMail(mailOptions, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
};
