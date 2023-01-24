import { db, auth } from "./config"
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"

async function getUserData(data: object) {
    const res = await fetch('http://localhost:3000/api/getUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const userData = await res.json()

    return {
        userData: userData?.userData as any[],
        userState: userData?.userState as any
    }
}

async function checkUser(userId: string, userName: string, userEmail: string) {
    const que = query(collection(db, 'data'), where('userId', '==', userId))
    const querySnapshot = await getDocs(que)

    if (querySnapshot.empty) {
        try {
            const docRef = await addDoc(collection(db, 'data'), {
                userId: userId,
                username: userName,
                email: userEmail,
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

async function cookieSetter(userState: boolean, userId: string | null) {
    const res = await fetch('http://localhost:3000/api/cookieSetter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userState: userState, userId: userId })
    })

    const message = await res.json()
    return message.message as any
}

export {
    getUserData,
    checkUser,
    cookieSetter
}