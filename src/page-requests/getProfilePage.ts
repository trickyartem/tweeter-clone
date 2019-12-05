import {Request, Response} from "express-serve-static-core";

export default (req: Request, res: Response) => {
    // @ts-ignore
    if (req.session.email) {
        const {email, nickname, status, gender, posts, totalLikes, profilePhoto}: any = req.session;

        res.render('profile.ejs', {
            email, gender, status, name: nickname, posts, likes: totalLikes, profilePhoto
        }, ((err: Error, html: string) => {
            if (err) console.error(err.message);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(html);
            res.end();
        }));
    } else {
        res.redirect('/');
    }

}
