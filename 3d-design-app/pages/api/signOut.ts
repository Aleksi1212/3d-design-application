import { signOut } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../src/datalayer/config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'method not allowed' })
    }

    const user = auth.currentUser
    signOut(auth)
    .then(() => {
        console.log(`signed out user with id: ${user?.uid}`)
    })
    .catch((err) => {
        console.error(err);
    })
}