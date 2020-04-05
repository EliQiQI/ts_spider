import fs from 'fs';
import path from 'path';
import {Request, Response, Router} from 'express';
import Crowller from './utils/crowller';
import CheeliuAnalyzer from "./cheeliuAnalyzer";
import {getResponseData} from "./utils/util";


interface RequestWithBody extends Request {
    body:
        {
            [key: string]: string | undefined;
        }

}

const router = Router();
router.get('/', (req: RequestWithBody, res: Response) => {
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.send(`
<html>
    <body>
        <a href="/getData">爬取内容</a>
        <a href="/showData">展示内容</a>
        <a href="/logout">退出</a>
    </body>
</html>
        `);
    } else {
        res.send(`
<html>
    <body>
        <form method="post" action="/login">
           <input type="password" name="password"/>
           <button>登录</button>
        </form>
    </body> 
</html>
    `);
    }

});
router.post('/login', (req: Request, res: Response) => {
    const {password} = req.body;
    const isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.json(getResponseData(false,'已经登录'));
    } else {
        if (password === '123' && req.session) {
            req.session.login = true;
            res.json(getResponseData(true));
        } else {
            res.json(getResponseData(false,'登录失败'));
        }
    }
});

router.get('/logout', (req: Request, res: Response) => {
    if (req.session) {
        req.session.login = undefined;
    }
    res.json(getResponseData(true));
});

router.get('/getData', (req: Request, res: Response) => {
    const isLogin=req.session?req.session.login:false;
    if (isLogin) {
        let url: string = 'https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=50&page_start=0';
        new Crowller(url, CheeliuAnalyzer.getInstance());
        res.send(getResponseData(true));
    } else {
        res.json(getResponseData(null,'请登录后爬取内容'));
    }

});

router.get('/showData', (req: Request, res: Response) => {
    try{
        const position=path.resolve(__dirname,"../data/data.json");
        const result=fs.readFileSync(position,'utf8');
        res.json(getResponseData(JSON.parse(result)));
    }catch (e) {
        res.json(getResponseData(null,'尚未爬取到内容'));
    }


});

export default router;
