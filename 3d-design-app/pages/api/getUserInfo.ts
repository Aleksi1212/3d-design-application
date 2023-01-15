import type { NextApiRequest, NextApiResponse } from "next";

import { db } from "../../src/datalayer/config";
import { collection, query, where, getDocs } from "firebase/firestore";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'Method not Allowed' })
    }

    const { userId } = req.body

    const que = query(collection(db, 'data'), where('userId', '==', userId))

    const querySnapshots = await getDocs(que)
    const data = querySnapshots.docs.map((doc) => doc.data())

    console.log(`data found with id: ${userId}`);

    res.status(200).json({ userData: data })
}