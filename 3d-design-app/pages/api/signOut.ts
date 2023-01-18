import { signOut } from "firebase/auth";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../src/datalayer/config";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(405).json({ message: 'method not allowed' })
    }

    const user = auth.currentUser

    console.log(user);
    signOut(auth)
    .then(() => {
        console.log(`signed out user with id: ${user?.uid}`)
        res.status(200).json({ message: 'ok' })
    })
    .catch((err) => {
        console.error(err);
        res.status(400).json({ message: 'bad request' })
    })
}