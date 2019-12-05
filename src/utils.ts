import {Request, Response} from "express-serve-static-core";
import * as fs             from "fs-extra";

type InputType = "email" | "password";

function inputValidate(input: string, type: InputType) {
    switch (type) {
        case "email":
            return /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,10}$/g.test(input);
        case "password":
            return /\w{6,24}/g.test(input);
    }
    return false;
}

export function validateEmail(req: Request, res: Response, next: Function, path?: string) {
    const {email} = req.body;

    if (!inputValidate(email, "email")) {
        res.redirect(path || '/' );
    } else {
        next();
    }
}

export function validatePassword(req: Request, res: Response, next: Function) {
    const {password} = req.body;

    if (!inputValidate(password, "password")) {
        res.redirect('/');
    } else {
        next();
    }
}
export const readFile = (res: Response, path: string) => {
    fs.readFile(path, (error: Error, response: Buffer) => {
        if (error) {
            res.writeHead(404);
            res.write(`Contents you are looking are Not Found ${error}`);
        } else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(response);
        }
        res.end();
    });
};
