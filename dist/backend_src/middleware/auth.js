"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.JWT_KEY;
if (!secretKey) {
    throw new Error('JWT_KEY is not defined in environment variables');
}
function authMiddleware(req, res, next) {
    let token = req.header('Authorization');
    if (!token)
        return res.status(401).send('Access denied. No token provided.');
    token = token.split(' ')[1]; // Extract the token part after 'Bearer'
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        req.auth = decoded;
        next();
    }
    catch (error) {
        res.status(400).send('Invalid token.');
    }
}
exports.default = authMiddleware;
