import {Request, Response} from "express-serve-static-core";
import {writeHTMLFile} from "../utils";

export default (req: Request, res: Response) => {
    // @ts-ignore
    if (req.session.email) {
        const {email, nickname, status, gender, posts, totalLikes, profilePhoto}: any = req.session;

        res.render('profile.ejs', {
            email, gender, status, name: nickname, posts, likes: totalLikes, profilePhoto
        }, ((err: Error, html: string) => {
            if (err) console.error(err.message);
            writeHTMLFile(res, html);
        }));
    } else {
        res.redirect('/');
    }

}
