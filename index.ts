import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import compression from 'compression'
// import helmet from 'helmet'
import cors from 'cors'
import mongoose from "mongoose";
import {decodeToken} from "./healper/auth.healper";
import morgan from 'morgan'

// connect with database
mongoose.connect(process.env.DATABASE_URL as string).then((response) => {
    console.log('MongoDB Connected Successfully.')
}).catch((err) => {
    console.log('Database connection failed.')
})

const app: Express = express();
const port = process.env.PORT;

app.use(compression())
// app.use(helmet())
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
);

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*"); //* will allow from all cross domain
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     )
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
//     res.locals.socket = io
//     next()
// });
app.use(cors())
app.use(decodeToken)

//config router
app.use(morgan('combined'))

import apiRoutes from "./routes/api";
app.use('/api', apiRoutes)

app.listen(port, () => {
    console.log(`[server]: Server is running att http://localhost:${port}`);
});

