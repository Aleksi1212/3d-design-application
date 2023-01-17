import type { NextApiRequest, NextApiResponse } from "next";
import { signInWithEmailAndPassword  } from 'firebase/auth'
import { auth } from "../../src/datalayer/config";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({message: 'error'})
    }

    const { email, password } = req.body

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            console.log(`user found with id: ${user.uid}`);
            
            res.redirect(`/home/${user.uid}`)
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/logIn')
        })
}