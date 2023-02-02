import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'method not allowed' })
    }

    const { userState, userId } = req.body

    setCookie('auth', JSON.stringify({ userState: userState, userId: userId }), { req, res, httpOnly: true, secure: true, path: '/', sameSite: 'strict' })
    res.status(200).json({ message: 'cookie set' })
}