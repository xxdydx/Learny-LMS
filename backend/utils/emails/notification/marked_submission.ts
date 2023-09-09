import sgMail from "@sendgrid/mail";

export function markedSubmissionNotif(
  student_email: string,
  student_name: string,
  assignment_name: string,
  course: string,
  assignment_id: number
) {
  sgMail.setApiKey(
    process.env.SENDGRID_SECRET ? process.env.SENDGRID_SECRET : ""
  );
  const student_msg = {
    to: student_email,
    from: "aeeducation7@gmail.com",
    templateId: "d-cb44f2d4e56b4e0487745759eba97b15",
    dynamicTemplateData: {
      name: student_name,
      assignment_name: assignment_name,
      course: course,
      assignment_id: assignment_id,
    },
  };

  sgMail
    .send(student_msg)
    .then(() => {
      console.log("Student email sent successfully");
    })
    .catch((error) => {
      console.error("Error sending student email:", error);
    });
}
