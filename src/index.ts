import express, {Request, Response}      from 'express';
import bodyParser                        from 'body-parser';
import {validateEmail, validatePassword} from "./utils";
import login                             from "./api-requests/login";
import register                          from "./api-requests/register";
import getLoginPage                      from "./page-requests/getLoginPage";
import getProfilePage                    from "./page-requests/getProfilePage";
import getRegisterPage                   from "./page-requests/getRegisterPage";
import getIndexPage                      from "./page-requests/getIndexPage";
import createPost                        from "./api-requests/create-post"
import postPost                          from "./api-requests/post-post"
import session                           from "express-session"
import redis                             from "redis";
import logOut                            from "./api-requests/logout";
import connectRedis                      from "connect-redis";
import likePost                          from "./api-requests/like-post";
import database                          from "./database";
import getBlogPage                       from "./page-requests/getBlogPage";
import editPage                          from "./page-requests/getEditPage";
import edit                              from "./api-requests/edit";
import getResetPasswordPage              from "./page-requests/getResetPasswordPage";
import resetPassword                     from "./api-requests/reset-password";
import removeUser                        from "./api-requests/removeUser";
import getRemoveUserPage                 from "./page-requests/getRemoveUserPage";
import getUserProfile                    from "./page-requests/getAnotherProfilePage"
import addComment                        from "./api-requests/add-comment"
import removeComment                     from "./api-requests/remove-post";
import getFindUserPage                   from "./page-requests/getFindUserPage";
import getAllCommentsPage                from "./page-requests/getAllCommentsPage";
import multer    from "multer";

database.connect();
const redisStore = connectRedis(session);
const client = redis.createClient();
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.static('uploads'));
app.set('view engine', 'ejs');
app.use('/images', express.static('uploads'));
app.use(session({
    secret: 'process.env.secret',
    store: new redisStore({host: 'localhost', port: 6379, client: client, ttl: 260}),
    saveUninitialized: false,
    resave: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req: Request, res: Response, next: any) => {
    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
    });
    next();
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.png') //Appending .jpg
    }
});
const upload = multer({ storage });

app.get('/get-news-feed', getBlogPage);
app.post('/like-post', likePost);
app.post('/edit', upload.none(), edit);
app.get('/logout', logOut);
app.post('/post-post', upload.none(), postPost);
app.get('/create-post', createPost);
app.post('/register', validateEmail, validatePassword, upload.single('photo'), register);
app.post('/login', validateEmail, validatePassword, upload.none(), login);
app.get('/profile-page', getProfilePage);
app.get('/register-page', getRegisterPage);
app.get('/login-page', getLoginPage);
app.get('/', getIndexPage);
app.get('/edit-page', editPage);
app.get('/reset-password-page', getResetPasswordPage);
app.post('/reset-password', resetPassword);
app.post('/remove-user', upload.none(), removeUser);
app.get('/remove-user-page', upload.none(), getRemoveUserPage);
app.get('/user-profile/:id', upload.none(), getUserProfile);
app.post('/add-comment', upload.none(), addComment);
app.post('/remove-post', removeComment);
app.post('/find-user-page', upload.none(), getFindUserPage);
app.get('/all-comments/:id', upload.none(), getAllCommentsPage);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});
