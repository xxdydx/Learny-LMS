import express from "express";
import { Section, User, File, Chapter } from "../models";
import { Course } from "../models";
import { tokenExtractor } from "../utils/middleware";
import { CustomRequest } from "../types";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import multer from "multer";
import getUpdatedCourse from "../utils/getUpdatedCourse";

const router = express.Router();
dotenv.config();

// configure AWS details
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();

// configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// To create files for a chapter of a course
router.post(
  "/:id/files",
  tokenExtractor,
  upload.single("file"),
  async (req: CustomRequest, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(404).send("You need to be logged in");
    }
    if (!req.file) {
      return res.status(400).send("File missing.");
    }

    try {
      let section = await Section.findByPk(req.params.id);
      if (!section) {
        return res.status(404).send("Section not found");
      }
      let chapter = await Chapter.findByPk(section?.chapterId);
      let course = await Course.findByPk(chapter?.courseId);

      if (user.id.toString() !== course?.teacherId.toString()) {
        return res
          .status(403)
          .send(`You don't have permissions to create files`);
      }

      const fileName = req?.file.originalname;
      const fileData = req?.file.buffer;
      let link = "";
      let awskey = "";
      const bucketName = process.env.AWS_BUCKET_NAME;
      const dirName = `Section${section.id}/Files/`;

      // Defining parameters for S3 file upload
      const params = {
        Key: dirName + fileName,
        Body: fileData,
        Bucket: bucketName ? bucketName : "",
        ContentType: req?.file.mimetype,
      };
      // Upload the file to S3
      try {
        const data = await s3.upload(params).promise();
        link = data.Location;
        awskey = data.Key;
      } catch (err) {
        res.status(500).send("Internal server error");
      }

      // check whether link and awskey are empty, before a file is created in database
      if (link.trim().length === 0 || awskey.trim().length === 0) {
        return res
          .status(500)
          .send(
            "Error initialising AWS keys and links. Contact support for more info."
          );
      }

      const file = await File.create({
        name: req.body.name,
        link: link,
        sectionId: section.id,
        awskey: awskey,
        visibledate: req.body.visibledate,
      });

      const editedCourse = await getUpdatedCourse(course.id);
      if (!editedCourse) {
        return res.status(404).send("Course not found");
      }

      return res.json(editedCourse);
    } catch (error) {
      next(error);
    }
  }
);

// to delete a section

router.delete("/:id", tokenExtractor, async (req: CustomRequest, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(404).send("You need to be logged in");
  }
  try {
    let section = await Section.findByPk(req.params.id);
    if (!section) {
      return res.status(404).send("Section not found");
    }
    let chapter = await Chapter.findByPk(section?.chapterId);
    let course = await Course.findByPk(chapter?.courseId);

    if (user.id.toString() !== course?.teacherId.toString()) {
      return res
        .status(403)
        .send(`You don't have permissions to delete this section`);
    }

    await section.destroy();

    // Display the edited course after the chapter is deleted
    const editedCourse = await getUpdatedCourse(course.id);
    if (!editedCourse) {
      return res.status(404).send("Course not found");
    }

    return res.json(editedCourse);
  } catch (err) {
    next(err);
  }
});

export default router;
