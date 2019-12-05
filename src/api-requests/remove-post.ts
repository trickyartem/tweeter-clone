import {Request, Response} from "express-serve-static-core"
import database            from "../database";
import {MysqlError}        from "mysql";

export default (req: Request, res: Response) => {
    if (req.session) {
        if (req.session.email) {
            const {postId, likes} = req.body;
            const {userId} = req.session;

            const postLikes = likes;
            database.query(`delete from Comments
                                            where post_id = ${postId}`,
                (err: MysqlError) => {
                    if (err) console.error(err);

                    database.query(`delete from LikedPosts
                                                where post_id = ${postId}`,
                        (error: Error) => {
                            if (error) console.error(error);

                            database.query(`delete from Posts
                                                    where post_id = ${postId}`,
                                (err1: MysqlError) => {
                                    if (err1) console.error(err1);

                                    database.query(`update Users
                                                                  set totalLikes = totalLikes - ${postLikes}
                                                                where User_PK = ${userId}`,
                                        (error1: MysqlError) => {
                                            if (error1) console.error(error1);

                                            if (req.session) {
                                                const a = req.session.posts.findIndex((el: any) => el.post_id = postId);

                                                req.session.posts.splice(a, 1);
                                                req.session.totalLikes -= likes;
                                                res.json({result: true, totalLikes: req.session.totalLikes})
                                            }
                                        });
                                });
                     })
                })
        } else {
            res.redirect('/')
        }
    }
}
