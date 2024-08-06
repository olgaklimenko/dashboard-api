import express, {Request, Response, NextFunction} from 'express';
import {usersRouter} from './users/users.js'
const port = 8000;
const app = express();

app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
})

app.get('/hello', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send({"success": true});
})

app.use('/users', usersRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    res.status(401).send(err.message);
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
