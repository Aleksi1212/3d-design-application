import type { NextApiRequest, NextApiResponse } from "next";

import { signInWithEmailAndPassword  } from 'firebase/auth'
import { auth } from "../../src/datalayer/config";

import { setCookie } from "cookies-next";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({message: 'error'})
    }

    const { email, password } = req.body

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
            console.log(`user found with id: ${user.uid}`);
            
            setCookie('auth', JSON.stringify({ userState: true, userId: user.uid }), { req, res, httpOnly: true, secure: true, sameSite: 'strict' })
            res.redirect(`/dashboard/${user.uid}`)
        })
        .catch((err) => {
            console.log(err);

            setCookie('auth', JSON.stringify({ userState: false, userId: null }), { req, res, httpOnly: true, secure: true, sameSite: 'strict' })
            res.redirect('/logIn')
        })
}