import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../src/datalayer/config";
import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'method not allowed' })
    }

    const { email, password } = req.body

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
        const user = userCredentials.user

        console.log(`Found with id: ${user.uid}`);
    })
    .catch((err) => {
        console.log(err);
    })

    auth.onAuthStateChanged(user => {
        if (user) {
            
        }
    })
}