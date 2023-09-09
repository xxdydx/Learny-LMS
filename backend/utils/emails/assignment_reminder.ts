import sgMail from "@sendgrid/mail";
import schedule from "node-schedule";

export function assignmentReminders(
  date: Date,
  email: string,
  name: string,
  assignment_name: string,
  course: string
) {
  let emailSent = true;

  sgMail.setApiKey(
    "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"
  );
  const msg = {
    to: email,
    from: "aeeducation7@gmail.com",
    templateId: "d-13c0a6d6c59c43c79be92c74e2d6e4ec",
    dynamicTemplateData: {
      name: name,
      assignment_name: assignment_name,
      course: course,
    },
  };

  function sendEmail() {
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent successfully");
        emailSent = false;
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  }

  const sendDate = new Date(date.getTime() - 3 * 24 * 60 * 60 * 1000);

  schedule.scheduleJob(sendDate, function () {
    sendEmail();
  });
  (function wait() {
    if (!emailSent) {
      setTimeout(wait, 1000);
    }
  })();
}
