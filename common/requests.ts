import { Request } from "express";
import { User } from "./types";
export interface IUserRequest extends Request {
    user?: User
}