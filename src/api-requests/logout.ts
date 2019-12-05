import {Request, Response} from "express-serve-static-core";

export default (req: Request, res: Response) => {
    if (req.session) {
        req.session.destroy((err: Error) => {
            if (err) throw err;
            res.redirect('/');
        });
    }
}
