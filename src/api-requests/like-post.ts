import {Request, Response} from "express-serve-static-core";
import database from "../database";
import {MysqlError} from "mysql";

export default (req: Request, res: Response) => {
    if (req.session) {
        if (req.session.email) {
            const {postId} = req.body;
            const {userId} = req.session;

            database.query(`select user_id from Posts
                                      where post_id = ${postId}`,
                (err: MysqlError, results: any) => {
                    if (err) console.error(err.message);
                    const postUserId = results[0].user_id;

                    database.query(`select * from LikedPosts
                                            where user_id = ${userId} and post_id = ${postId}`,
                        (error: MysqlError, liked: any) => {
                            if (error) console.error(error.message);

                            const ifLiked = liked.length > 0 ? -1 : 1;

                            database.query(`delete from LikedPosts
                                                            where user_id = ${userId} and post_id = ${postId}`,
                                (error1: MysqlError) => {
                                    if (error1) console.error();

                                    database.query(`update Posts, Users
                    inner join Posts P on Users.User_PK = P.user_id
                                set P.likes = P.likes + ${ifLiked},
                                    Users.totalLikes = Users.totalLikes + ${ifLiked}
                                where P.post_id = ${postId}
                                  and Users.User_PK = ${postUserId};`,
                                        (err2: MysqlError) => {
                                            if (err2) console.error(err2.message);

                                            database.query(`select * from Posts
                                            where user_id = ${postUserId}`,
                                                ((err1: MysqlError, posts: any) => {
                                                    if (err1) console.error(err1.message);

                                                    database.query(`select * from Comments
                                                                                where post_id = ${postId}`,
                                                        (shit: Error, comments: any) => {
                                                            if (req.session) {

                                                                let commentsLength = comments.length >= 2 ? 2 : comments.length === 1 ? 1 : 0;

                                                                for (let i = 0; i < posts.length; i++) {
                                                                    posts[i].comments = [];
                                                                    for (let j = 0; j < commentsLength; j++) {
                                                                        if (posts[i].post_id === comments[j].post_id) {
                                                                            posts[i].comments.push(comments[j])
                                                                        }
                                                                    }
                                                                }
                                                                req.session.posts = posts;
                                                                res.json({
                                                                    result: false,
                                                                    totalLikes: req.session.totalLikes += ifLiked
                                                                })
                                                            }
                                                        })
                                                }));
                                        })
                                });
                        });
                });
        } else {
            res.redirect('/');
        }
    }
}
