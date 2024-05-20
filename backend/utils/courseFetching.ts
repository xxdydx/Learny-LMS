import { Op } from "sequelize";
import {
  Course,
  User,
  Chapter,
  Section,
  File,
  Assignment,
  Submission,
  Announcement,
} from "../models";

export const getCommonInclude = (role: string = "teacher", userId?: number) => {
  const baseInclude: any[] = [
    {
      model: User,
      as: "teacher",
      attributes: ["name", "username", "id", "email", "role"],
    },
    {
      model: Announcement,
      as: "announcements",
      required: false,
      where: {
        expiry: {
          [Op.gt]: new Date(),
        },
      },
    },
    {
      model: Chapter,
      as: "chapters",
      attributes: ["title", "id", "createdAt", "pinned"],
      include: [
        {
          model: Section,
          as: "sections",
          include: [
            {
              model: File,
              as: "files",
              attributes: ["name"],
            },
            {
              model: Assignment,
              as: "assignments",
              include: [
                {
                  model: Submission,
                  as: "submissions",
                  include: [
                    {
                      model: User,
                      as: "student",
                      attributes: ["name", "username", "id", "email", "role"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  if (role === "student" && userId) {
    baseInclude.push({
      model: User,
      as: "students",
      where: { id: { [Op.eq]: userId } },
      attributes: ["name", "username", "id", "email", "role"],
      through: { attributes: [] },
    });
  }

  if (role === "teacher") {
    baseInclude.push({
      model: User,
      as: "students",
      attributes: ["name", "username", "id", "email", "role"],
      through: { attributes: [] },
    });
  }

  return baseInclude;
};

export const getCommonOrder = (): any[] => [
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
];

export const getCoursesByRole = async (user: User) => {
  const commonAttributes = { exclude: ["teacherId"] };
  const commonInclude = getCommonInclude(user.role, user.id);
  const commonOrder = getCommonOrder();

  let where = {};
  if (user.role === "teacher") {
    where = {
      teacherId: { [Op.eq]: user.id },
      template: { [Op.not]: true },
    };
  } else if (user.role === "student") {
    where = {
      template: { [Op.not]: true },
    };
  } else if (user.role === "admin") {
    where = {};
  }

  return await Course.findAll({
    attributes: commonAttributes,
    where,
    include: commonInclude,
    order: commonOrder,
  });
};
