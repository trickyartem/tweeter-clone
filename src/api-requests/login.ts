import {Request, Response} from "express-serve-static-core";
import database            from "../database";
import {MysqlError}        from "mysql";

export default (req: Request, res: Response) => {
    const {email, password} = req.body;

    database.query(`select * from Users
                             where email = '${email}';`,
        (err: MysqlError, result: any) => {
            if (err) {
                console.error(err.message);
            }

            if (result[0]) {

                database.query(`select * from Posts
                                       where user_id = ${result[0].User_PK}`,
                    (err: MysqlError, posts: any) => {
                        if (err) throw err;

                        database.query(`select * from Comments
                                                where user_id = ${result[0].User_PK}`,
                            ((err1: MysqlError, comments: any) => {
                                if (err1) console.error(err1);

                                let commentsLength = 0;

                                if (comments.length >= 2) {
                                    commentsLength = 2
                                } else if (comments.length === 1) {
                                    commentsLength = 1
                                }

                                for (let i = 0; i < posts.length; i++) {
                                    posts[i].comments = [];
                                    for (let j = 0; j < commentsLength; j++) {
                                        if (posts[i].post_id === comments[j].post_id) {
                                            posts[i].comments.push(comments[j])
                                        }
                                    }
                                }

                                if (result[0].password === password) {
                                    if (req.session) {
                                        req.session.email = result[0].email;
                                        req.session.password = result[0].password;
                                        req.session.nickname = result[0].name;
                                        req.session.status = result[0].status;
                                        req.session.gender = result[0].gender;
                                        req.session.userId = result[0].User_PK;
                                        req.session.profilePhoto = result[0].profilePhoto;
                                        req.session.posts = posts;
                                        req.session.totalLikes = posts.reduce((acc: number, curr: any) => {
                                            return acc + curr.likes;
                                        }, 0);

                                        res.redirect(`/profile-page`);
                                    }
                                } else {
                                    res.redirect('/');
                                }
                            }))
                    });
            } else {
                res.redirect('/login-page');
            }
        });
}
