import sgMail from "@sendgrid/mail";

export function assignmentSubmission(
  student_email: string,
  student_name: string,
  teacher_email: string,
  teacher_name: string,
  assignment_name: string,
  course: string
) {
  sgMail.setApiKey(
    process.env.SENDGRID_SECRET ? process.env.SENDGRID_SECRET : ""
  );
  const student_msg = {
    to: student_email,
    from: "aeeducation7@gmail.com",
    templateId: "d-3c72ef1796e14c16a3522e3a477fc9aa",
    dynamicTemplateData: {
      name: student_name,
      assignment_name: assignment_name,
      course: course,
    },
  };

  const teacher_msg = {
    to: teacher_email,
    from: "aeeducation7@gmail.com",
    templateId: "d-c4418af5aa4344008b7896b0b52c0f74",
    dynamicTemplateData: {
      name: teacher_name,
      student_name: student_name,
      assignment_name: assignment_name,
      course: course,
    },
  };

  sgMail
    .send(teacher_msg)
    .then(() => {
      console.log("Teacher email sent successfully");
    })
    .catch((error) => {
      console.error("Error sending teacher email:", error);
    });

  sgMail
    .send(student_msg)
    .then(() => {
      console.log("Student email sent successfully");
    })
    .catch((error) => {
      console.error("Error sending student email:", error);
    });
}
