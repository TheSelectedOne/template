"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUser = exports.cookieLogin = exports.logoutUser = exports.loginUser = exports.createUser = void 0;
const User_1 = require("../Entities/User");
const nanoid_1 = require("nanoid");
const argon2_1 = __importDefault(require("argon2"));
const PasswordCheck_1 = require("../Util/PasswordCheck");
const GenerateToken_1 = require("../Util/GenerateToken");
const Redis_1 = require("../Util/Redis");
const createUser = (data, res) => __awaiter(void 0, void 0, void 0, function* () {
    const passwordCheckResponse = PasswordCheck_1.PasswordCheck(data.password, data.confirmPassword);
    if (!passwordCheckResponse)
        return res.send({ Error: passwordCheckResponse }).end();
    const hashedPassword = yield argon2_1.default.hash(data.password);
    const id = nanoid_1.nanoid();
    const user = User_1.User.create({
        id: id,
        username: data.username,
        email: data.email,
        password: hashedPassword,
    });
    yield user.save().catch((err) => {
        return res.send({ Error: err }).end();
    });
    const redisId = nanoid_1.nanoid();
    yield Redis_1.redis.set(redisId, id).catch((err) => {
        return res.send({ Error: err }).end();
    });
    const cookieToken = GenerateToken_1.GenerateToken(redisId);
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
});
exports.createUser = createUser;
const loginUser = (data, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.User.findOne({
        where: {
            email: data.email,
        },
    });
    if (!user)
        return res
            .send({ Error: "Account with this email does not exist" })
            .end();
    if (!argon2_1.default.verify(user.password, data.password))
        return res.send({ Error: "Wrong password!" }).end();
    const redisId = nanoid_1.nanoid();
    yield Redis_1.redis.set(redisId, user.id);
    const cookieToken = GenerateToken_1.GenerateToken(redisId);
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
});
exports.loginUser = loginUser;
const logoutUser = (token, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Redis_1.redis.del(token);
    res.cookie("token", "none", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    return res.status(200).end();
});
exports.logoutUser = logoutUser;
const cookieLogin = (token, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield Redis_1.redis.get(token);
    if (!userId)
        return res.sendStatus(403).end();
    const user = User_1.User.findOne(userId, {
        select: ["email", "username"],
    });
    if (!user)
        return res.send({ Error: "User does not exist" }).status(404).end();
    return res.send(user).end();
});
exports.cookieLogin = cookieLogin;
const editUser = () => __awaiter(void 0, void 0, void 0, function* () { });
exports.editUser = editUser;
//# sourceMappingURL=user.js.map