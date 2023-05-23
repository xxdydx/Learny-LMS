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
        attributes: ["title", "id"],
        include: [
          {
            model: Section,
            as: "sections",
            include: [
              {
                model: File,
                as: "files",
                attributes: ["name", "id", "link"],
              },
            ],
          },
        ],
      },
    ],
  });

  return editedCourse;
}

export default getUpdatedCourse;
