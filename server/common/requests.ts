import { Request } from "express";
export interface IUserRequest extends Request {
    user?: {
        emails: string;
        first_name: string;
        last_name: string;
        ugkthid: string;
        user: string;
        admin: string[];
    }
}