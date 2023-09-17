import { silentAuthorization } from "../common/middlewares";
import { IUserRequest } from "../common/requests";
import { ping } from "../functions/api/ping";
import darkModeRouter from "./dark-mode";
import donationsRouter from "./donations";
import eventsRouter from "./events";
import filesRouter from "./files";
import patchesRouter from "./patches";
import storageRouter from "./storage";
import tagsRouter from "./tags";
import express from "express";
import { StatusCodes } from "http-status-codes";

const router = express.Router();

router.use("/patches", patchesRouter);
router.use("/tags", tagsRouter);
router.use("/files", filesRouter);
router.use("/events", eventsRouter);
router.use("/storage", storageRouter);
router.use("/donations", donationsRouter);
router.use("/dark-mode", darkModeRouter);

router.get("/ping", (req, res) => {
  res.json(ping());
});

router.get(
  "/check-token",
  silentAuthorization,
  async (req: IUserRequest, res) => {
    if (!req.user)
      return res.status(StatusCodes.BAD_REQUEST).json({
        statusCode: StatusCodes.BAD_REQUEST,
      });
    return res.status(StatusCodes.OK).json(req.user);
  }
);

router.get("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    statusCode: StatusCodes.NOT_FOUND,
    body: "Invalid API path",
  });
});

export default router;
