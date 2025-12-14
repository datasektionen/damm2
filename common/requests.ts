import { Request } from "express";
import { DammUser } from "./types";
export interface IUserRequest extends Request {
    user?: DammUser
}
