import { User } from "../Entities/User";
import { nanoid } from "nanoid";
import { RegisterInterface } from "../Interfaces/RegisterInterface";
import argon from "argon2";
import { PasswordCheck } from "../Util/PasswordCheck";
import { LoginInterface } from "../Interfaces/LoginInterface";
import { Response } from "express";
import { GenerateToken } from "../Util/GenerateToken";
import { redis } from "../Util/Redis";

export const createUser = async (data: RegisterInterface, res: Response) => {
    const passwordCheckResponse = PasswordCheck(
        data.password,
        data.confirmPassword
    );
    if (!passwordCheckResponse)
        return res.send({ Error: passwordCheckResponse }).end();
    const hashedPassword = await argon.hash(data.password);
    const id = nanoid();
    const user = User.create({
        id: id,
        username: data.username,
        email: data.email,
        password: hashedPassword,
    });
    await user.save().catch((err) => {
        return res.send({ Error: err }).end();
    });
    const redisId = nanoid();
    await redis.set(redisId, id).catch((err) => {
        return res.send({ Error: err }).end();
    });
    const cookieToken = GenerateToken(redisId);
    res.cookie("token", cookieToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return res
        .send({
            username: user.username,
            email: user.email,
        })
        .end();
};

export const loginUser = async (data: LoginInterface, res: Response) => {
    const user = await User.findOne({
        where: {
            email: data.email,
        },
    });
    if (!user)
        return res
            .send({ Error: "Account with this email does not exist" })
            .end();
    if (!argon.verify(user.password, data.password))
        return res.send({ Error: "Wrong password!" }).end();
    const redisId = nanoid();
    await redis.set(redisId, user.id);
    const cookieToken = GenerateToken(redisId);
    res.cookie("token", cookieToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    return res
        .send({
            username: user.username,
            email: user.email,
        })
        .end();
};

export const logoutUser = async (token: string, res: Response) => {
    await redis.del(token);
    res.cookie("token", "none", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    return res.status(200).end();
};

export const cookieLogin = async (token: string, res: Response) => {
    const userId = await redis.get(token);
    if (!userId) return res.sendStatus(403).end();
    const user = User.findOne(userId, {
        select: ["email", "username"],
    });
    if (!user)
        return res.send({ Error: "User does not exist" }).status(404).end();
    return res.send(user).end();
};

export const editUser = async () => {};
