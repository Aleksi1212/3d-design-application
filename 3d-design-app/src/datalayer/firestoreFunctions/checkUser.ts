import { db } from "../config"
import { query, collection, where, getDocs, addDoc } from "firebase/firestore"

import { generateId } from "../otherFunctionality"

async function checkUser(userId: string, userName: string, userEmail: string, method: string) {
    const messagingId = generateId(5)

    const que = query(collection(db, 'data'), where('userId', '==', userId))
    const querySnapshot = await getDocs(que)

    if (querySnapshot.empty) {
        const createNewUserPromise = await Promise.allSettled([
            addDoc(collection(db, 'data'), {
                userId: userId,
                username: userName,
                email: userEmail,
                method: method,
                locked: false,
                messagingId: messagingId,
                profileUrl: 'profileImages/defaultProfile.png'
            }),

            addDoc(collection(db, 'dataDesigns'), {
                userId: userId,
                username: userName,
                email: userEmail,
                method: method,
                profileUrl: 'profileImages/defaultProfile.png'
            })
        ])

        if (createNewUserPromise[0].status === 'fulfilled') {
            console.log(`new user created with id: ${userId}`)
        } else {
            console.error(createNewUserPromise[0].reason)
        }
    } else {
        console.log('data exists');
    }
}

export default checkUser