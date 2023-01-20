import { db, auth } from "./config"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"

import { createUserWithEmailAndPassword, EmailAuthCredential } from "firebase/auth"
import { setCookie } from 'cookies-next'

async function getUserData(data: object) {
    const res = await fetch('http://localhost:3000/api/getUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const userData = await res.json()

    // return userData?.userData as any[]

    return {
        userData: userData?.userData as any[],
        userState: userData?.userState as any
    }
}

async function checkUser (userInfo: any) {
    const que = query(collection(db, 'data'), where('userId', '==', userInfo.userId))
    const querySnapshot = await getDocs(que)

    if (querySnapshot.empty) {
        try {
            const docRef = await addDoc(collection(db, 'data'), {
                userId: userInfo.userId,
                username: userInfo.userName,
                email: userInfo.userEmail,
                documents: []
            })

            console.log(`Data added with id: ${docRef.id}`);
            
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log('data exists');
    }
}

export {
    getUserData,
    checkUser,
}