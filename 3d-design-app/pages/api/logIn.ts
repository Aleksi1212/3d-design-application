import type { NextApiRequest, NextApiResponse } from "next";
import { createUserWithEmailAndPassword  } from 'firebase/auth'
import { auth } from "../../src/datalayer/config";

import { db } from "../../src/datalayer/config";
import { collection, query, where, getDocs, addDoc, doc } from "firebase/firestore";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({message: 'error'})
    }


    // createUserWithEmailAndPassword(auth, req.body.email, req.body.name)
    //     .then((userCredential) => {
    //         const user = userCredential.user
    //         console.log(user);
    //     })
    //     .catch((err) => {
    //         const errorCode = err.code
    //         const errorMessage = err.message
    //         console.log(`code: ${errorCode}, message: ${errorMessage}`); 
    //     })

    const { username, userId, email, documents } = req.body

    try {
        const docRef = await addDoc(collection(db, 'data'), {
            username: username,
            userId: userId,
            email: email,
            documents: documents
        })

        console.log(`new user created with id: ${docRef.id}`);
        
        res.status(200).json({ message: 'ok' })
    } catch (err) {
        console.error(err);
    }
}