export interface DammUser {
    emails: string;
    first_name: string;
    last_name: string;
    ugkthid: string;
    user: string;
    admin: string[];
}

type hivePermission = {
    id: string,
    scope?: string
}

export interface SsoUser {
    sub: string,
    name: string,
    given_name: string,
    family_name: string,
    email: string,
    email_verified: boolean
    permissions: hivePermission[]
}

import 'express';

declare module 'express-serve-static-core' {
    interface Request {
        session: import('express-session').Session & {
            user?: DammUser;
            tokens?: Record<string, any>;
        };
    }
}
