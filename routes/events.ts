import { unauthorizedResponse } from "../common/ApiResponse";
import prisma from "../common/client";
import {
  adminAuth,
  authorizePls,
  silentAuthorization,
  validationCheck,
} from "../common/middlewares";
import { DATE_FORMAT, EVENT_TYPE } from "../common/patterns";
import { IUserRequest } from "../common/requests";
import {
  getAll,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../functions/api/events";
import { dfunkt } from "../functions/generator/dfunkt";
import { generator } from "../functions/generator/generator";
import { EventType } from ".prisma/client";
import { CronJob } from "cron";
import express from "express";
import { body, param } from "express-validator";
import { StatusCodes } from "http-status-codes";
import moment from "moment";
import axios from "axios";

const router = express.Router();

const init = () => generator(dfunkt);

let cachedData = init()();

new CronJob(
  // Run every hour
  // seconds, minutes, hours, day of month, month, day of week
  "0 0 * * * *",
  () => {
    console.log("Performing automatic refresh");
    cachedData = init()();
  }, // onTick
  null, // onComplete
  true // start now
);

router.get("/all", silentAuthorization, async (req: IUserRequest, res) => {
  const darkMode = (await axios("https://darkmode.datasektionen.se/")).data;
  const user = req.user;
  const isAdminOrPrylis = Boolean(
    user?.admin.includes("admin") || user?.admin.includes("prylis")
  );

  if (darkMode && !isAdminOrPrylis) {
    return res.status(StatusCodes.OK).json([]);
  }

  const events = await getAll();
  events.body = [...events.body, ...cachedData].sort((a, b) =>
    moment(a.date).isBefore(b.date)
      ? 1
      : moment(a.date).isAfter(b.date)
      ? -1
      : 0
  );
  return res.status(events.statusCode).json(events);
});

router.post(
  "/create",
  authorizePls,
  // adminAuth,
  body("title")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("should be a non empty string"),
  body("content")
    .isString()
    .trim()
    .optional()
    .withMessage("should be a string"),
  body("date")
    .matches(DATE_FORMAT)
    .withMessage("should be a date with format YYYY-MM-DD"),
  body("type")
    .matches(EVENT_TYPE)
    .withMessage("should be one of 'GENERAL', 'ANNIVERSARY' or 'SM_DM'"),
  body("protocol")
    .trim()
    .isURL()
    .optional()
    .withMessage("should be a valid URL"),
  validationCheck,
  async (req: IUserRequest, res) => {
    if (
      !req.user?.admin.includes("post") &&
      !req.user?.admin.includes("admin")
    ) {
      unauthorizedResponse(res);
      return;
    }

    const { title, content, date, type, protocol } = req.body;
    if (type === EventType.SM_DM && !protocol)
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        error: "No url to protocol provided.",
      });

    const result = await createEvent(
      title,
      content ?? "",
      date,
      type,
      protocol ?? "",
      req.user.user
    );
    return res.status(result.statusCode).json(result);
  }
);

router.put(
  "/update",
  authorizePls,
  // adminAuth,
  body("id").isInt().not().isString().withMessage("should be an integer"),
  body("title")
    .isString()
    .trim()
    .notEmpty()
    .optional()
    .withMessage("should be a non empty string"),
  body("content")
    .isString()
    .trim()
    .optional()
    .withMessage("should be a string"),
  body("date")
    .matches(DATE_FORMAT)
    .optional()
    .withMessage("should be a date with format YYYY-MM-DD"),
  body("type")
    .matches(EVENT_TYPE)
    .optional()
    .withMessage("should be one of 'GENERAL', 'ANNIVERSARY' or 'SM_DM'"),
  body("protocol")
    .trim()
    .isURL()
    .optional()
    .withMessage("should be a valid URL"),
  validationCheck,
  async (req: IUserRequest, res) => {
    const { id, title, content, date, type, protocol } = req.body;

    const exists = await prisma.event.findUnique({ where: { id } });
    if (!exists)
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Not found" });
    if (
      exists.createdBy !== req.user?.user &&
      !req.user?.admin.includes("admin")
    ) {
      unauthorizedResponse(res);
      return;
    }

    if (type === EventType.SM_DM && !protocol)
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
        error: "No url to protocol provided.",
      });

    const result = await updateEvent({
      id,
      title,
      content,
      date,
      type,
      protocol,
    });
    return res.status(result.statusCode).json(result);
  }
);

router.delete(
  "/:id",
  authorizePls,
  adminAuth,
  param("id").isInt().withMessage("should be an integer"),
  validationCheck,
  async (req: IUserRequest, res) => {
    const id = Number(req.params.id);

    const result = await deleteEvent(id);
    return res.status(result.statusCode).json(result);
  }
);

export default router;
