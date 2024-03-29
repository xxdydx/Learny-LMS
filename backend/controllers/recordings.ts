import express from "express";
import { Section, User, File, Chapter } from "../models";
import { Course } from "../models";
import { tokenExtractor } from "../utils/middleware";
import { ChapterType, CustomRequest } from "../types";
import { Op } from "sequelize";
import getUpdatedCourse from "../utils/getUpdatedCourse";
import axios from "axios";
import Recording from "../models/recording";

const client_id = process.env.ZOOM_CLIENT_ID;
const client_secret = process.env.ZOOM_CLIENT_SECRET;
const secret = Buffer.from(client_id + ":" + client_secret).toString("base64");

const router = express.Router();
router.get("/", tokenExtractor, async (req: CustomRequest, res, next) => {
  const courseId = parseInt(req.query.courseId as string);
  let course = await Course.findByPk(courseId);
  let where = {};
  const query = course?.zoomName;
  if (course) {
    where = {
      title: {
        [Op.eq]: query,
      },
    };
  }
  try {
    const user = req.user;

    if (!user) {
      return res
        .json(403)
        .send("You need to be logged in to perform this action");
    }
    const recordings = await Recording.findAll({
      where,
    });

    return res.json(recordings);
  } catch (error) {
    next(error);
  }
});

router.get("/all", tokenExtractor, async (req: CustomRequest, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(403)
        .send("You need to be logged in to perform this action");
    }
    const recordings = await Recording.findAll({
      where: {
        teacherId: {
          [Op.eq]: user.id,
        },
      },
    });
    return res.json(recordings);
  } catch (error) {
    next(error);
  }
});

router.post("/", tokenExtractor, async (req: CustomRequest, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(403)
        .send("You need to be logged in to perform this action");
    }
    if (user.role === "student") {
      return res.json(403).send("No permission to add recordings");
    }

    await Recording.create({
      start_time: req.body.startTime,
      title: req.body.title,
      share_url: req.body.shareUrl,
      duration: req.body.duration,
      teacherId: user.id,
    });
    return res.status(200).send("Recording added");
  } catch (error) {
    next(error);
  }
});

router.post("/sync", tokenExtractor, async (req: CustomRequest, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(403)
        .send("You need to be logged in to perform this action");
    }

    if (user.role === "student") {
      return res.json(403).send("No permission to add recordings");
    }
    const { code } = req.query;
    let token: string | null = null;

    const redirectUri = "https://learny-lms.vercel.app/recordings";
    const sendData = encodeURI(
      `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`
    );

    const config = {
      headers: { Authorization: "Basic " + secret },
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(sendData),
    };

    const { data } = await axios.post(
      "https://zoom.us/oauth/token",
      sendData,
      config
    );
    token = data.access_token;

    //  recordings api

    const recordingConfig = {
      headers: { Authorization: "Bearer " + token },
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(sendData),
    };
    const date = "2023-05-06";

    const recordingsBody = await axios.get(
      `https://api.zoom.us/v2/users/me/recordings?from=${date}`,
      recordingConfig
    );

    const recordingData = recordingsBody.data.meetings;

    if (recordingData) {
      await Recording.destroy({
        where: {
          teacherId: user.id,
        },
        truncate: true,
      });
    }

    // options for timezone conversion

    // Loop through recordingData and create recordings in our database
    for (var i = 0; i < recordingData.length; i++) {
      const recording = recordingData[i];

      await Recording.create({
        start_time: recording.start_time,
        title: recording.topic,
        passcode: recording.recording_play_passcode,
        share_url: `${recording.share_url}?pwd=${recording.recording_play_passcode}`,
        duration: recording.duration,
        teacherId: user.id,
      });
    }

    return res.status(200).send("Process complete");
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

router.delete("/:id", tokenExtractor, async (req: CustomRequest, res, next) => {
  const user = req.user;
  if (!user) {
    return res
      .status(403)
      .send("You need to be logged in to perform this action");
  }

  if (user.role === "student") {
    return res.json(403).send("No permission to delete recordings");
  }

  let recording = await Recording.findByPk(req.params.id);
  if (!recording) {
    return res.status(404).send("Recording not found");
  }
  if (recording.teacherId !== user.id) {
    return res.status(403).send("No permission to delete this recording");
  }

  try {
    await recording.destroy();
    res.status(204).end();
  } catch (error) {
    return next(error);
  }
});

router.delete(
  "/clearall",
  tokenExtractor,
  async (req: CustomRequest, res, next) => {
    const user = req.user;
    if (!user) {
      return res
        .status(403)
        .send("You need to be logged in to perform this action");
    }

    if (user.role === "student") {
      return res.json(403).send("No permission to delete recordings");
    }

    await Recording.destroy({
      where: {
        teacherId: user.id,
      },
      truncate: true,
    });
    return res.status(200).send("Process complete (Clearing all recordings)");
  }
);

export default router;
