import { Section, User, File, Chapter, Enrollment, Course } from "../models";

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
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Section,
            as: "sections",
            order: [["createdAt", "DESC"]],
            include: [
              {
                model: File,
                as: "files",
                attributes: ["name", "id", "link", "awskey", "visibledate"],
                order: [["createdAt", "DESC"]],
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
    ],
  });

  return editedCourse;
}

export default getUpdatedCourse;
