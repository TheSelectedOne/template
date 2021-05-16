import "reflect-metadata";
import { createConnection } from "typeorm";
import cors from "cors";
import express, { Request, Response } from "express";
import { User } from "./Entities/User";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import https from "https";
import { cookieLogin, createUser, loginUser } from "./Resolvers/user";
import fs from "fs";
import { VerifyToken } from "./Util/Verifytoken";

dotenv.config();

const main = async () => {
    const connection = createConnection({
        type: "postgres",
        host: <string>process.env.DB_HOST,
        port: <number | undefined>process.env.DB_PORT,
        username: <string>process.env.DB_USERNAME,
        password: <string>process.env.DB_PASSWORD,
        database: <string>process.env.DB_NAME,
        synchronize: true,
        logging: true,
        entities: [User],
    });
    (await connection).runMigrations();

    const app = express();
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
            credentials: true,
        })
    );
    app.use(express.json());
    app.use(cookieParser());

    app.get("/auth", [VerifyToken], (_: Request, res: Response) => {
        cookieLogin(res.locals.token, res);
        return;
    });

    app.post("/login", (req: Request, res: Response) => {
        loginUser(req.body, res);
        return;
    });

    app.post("/register", (req: Request, res: Response) => {
        createUser(req.body, res);
        return;
    });

    https
        .createServer(
            {
                key: fs.readFileSync("./cert/cert.key"),
                cert: fs.readFileSync("./cert/cert.pem"),
            },
            app
        )
        .listen(5000);
};

main();
