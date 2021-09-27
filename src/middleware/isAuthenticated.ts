import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import auth from "../config/auth";

export default function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    //pega headers requisição
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'JWT Token is missing' })
    }

    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
    //const [, token] = authHeader.split(' ')
    //pega posição 1 do array onde está o token
    const token = authHeader.split(' ')[1]

    try {
        const decodeToken = verify(token, auth.jwt.secret)
        return next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid JWT Token' })
    }
}