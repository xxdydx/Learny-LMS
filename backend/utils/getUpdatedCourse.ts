import {
  Section,
  User,
  File,
  Chapter,
  Enrollment,
  Course,
  Assignment,
  Submission,
} from "../models";

async function getUpdatedCourse(courseId: number): Promise<Course | null> {
  const editedCourse = await Course.findByPk(courseId, {
    attributes: { exclude: ["teacherId"] },
    include: [
      {
        model: User,
        as: "teacher",
        attributes: ["name", "username", "id", "email", "role"],
      },
      {
        model: User,
        as: "students",
        attributes: ["name", "username", "id", "email", "role"],
        through: {
          attributes: [],
        },
      },
      {
        model: Chapter,
        as: "chapters",
        attributes: ["title", "id", "pinned"],

        include: [
          {
            model: Section,
            as: "sections",

            include: [
              {
                model: File,
                as: "files",
                attributes: ["name", "id", "link", "awskey", "visibledate"],
              },
              {
                model: Assignment,
                as: "assignments",
                attributes: [
                  "name",
                  "id",
                  "link",
                  "awskey",
                  "visibledate",
                  "deadline",
                  "marks",
                ],
                include: [
                  {
                    model: Submission,
                    as: "submissions",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    order: [
      ["createdAt", "DESC"],
      [{ model: Chapter, as: "chapters" }, "createdAt", "DESC"],
      [
        { model: Chapter, as: "chapters" },
        { model: Section, as: "sections" },
        "createdAt",
        "ASC",
      ],
      [
        { model: Chapter, as: "chapters" },
        { model: Section, as: "sections" },
        { model: File, as: "files" },
        "createdAt",
        "ASC",
      ],
      [
        { model: Chapter, as: "chapters" },
        { model: Section, as: "sections" },
        { model: Assignment, as: "assignments" },
        "createdAt",
        "ASC",
      ],
      [
        { model: Chapter, as: "chapters" },
        { model: Section, as: "sections" },
        { model: Assignment, as: "assignments" },
        { model: Submission, as: "submissions" },
        "createdAt",
        "ASC",
      ],
    ],
  });

  return editedCourse;
}

export default getUpdatedCourse;
