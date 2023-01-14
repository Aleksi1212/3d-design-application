import type { NextApiRequest, NextApiResponse } from "next";

export default function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({message: 'error'})
    }

    const { name } = req.body
    res.status(200).json({data: name})
}