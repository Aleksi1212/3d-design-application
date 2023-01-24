import type { NextApiRequest, NextApiResponse } from "next/types";

import { auth, db } from "../../src/datalayer/config";
import { reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";
import { collection, deleteDoc, getDocs, query, where, doc } from "firebase/firestore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'method not allowed' })
    }

    const user: any = auth.currentUser
    const credentials = EmailAuthProvider.credential(
        req.body.email,
        req.body.password
    )

    reauthenticateWithCredential(user, credentials)
    .then((result) => {
        const userData = result.user
        console.log('user', userData.uid);
        

        deleteUser(userData)
        .then(async () => {
            console.log('user deleted');
            
            const que = query(collection(db, 'data'), where('userId', '==', userData.uid))
            const querySnapshot = await getDocs(que)
            const docId = querySnapshot.docs.map((doc) => doc.id)

            await deleteDoc(doc(db, 'data', docId[0]))
            res.status(200).json({ message: 'deleted succesfully' })
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ message: 'error while deleting' })
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(400).json({ message: 'error while deleting' })
    })
}