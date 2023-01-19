import { NextApiRequest, NextApiResponse } from "next";

import { auth, db } from "../../src/datalayer/config";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'method not allowed' })
    }

    const { email, username, password } = req.body

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredentials) => {
            const user = userCredentials.user

            try {
                const docRef = await addDoc(collection(db, 'data'), {
                    userId: user.uid,
                    username: username,
                    email: user.email,
                    documents: []
                })

                console.log(`New document created with id: ${docRef.id}`);
                
                res.redirect(`/dashboard/${user.uid}`)
            }
            catch(err) {
                console.log(err);
                res.redirect('/signUp')
            }
        })
        .catch((err) => {
            console.log(err);
            res.redirect('/signUp')
        })
}