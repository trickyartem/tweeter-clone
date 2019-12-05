import {Request, Response} from "express-serve-static-core";
import {readFile}          from "../utils";

export default (req: Request, res: Response) => {
    readFile(res, './public/index.html')
};
