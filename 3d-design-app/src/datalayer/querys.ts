import { db } from "./config"
import { addDoc, collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"

async function getUserData(data: any) {
    const que = query(collection(db, 'data'), where('userId', '==', data.userId))
    const querySnapshot = await getDocs(que)

    const userData = querySnapshot.docs.map((doc) => doc.data())
    return userData
}

async function checkUser(userId: string, userName: string, userEmail: string, method: string) {
    const que = query(collection(db, 'data'), where('userId', '==', userId))
    const querySnapshot = await getDocs(que)

    if (querySnapshot.empty) {
        try {
            const docRef = await addDoc(collection(db, 'data'), {
                userId: userId,
                username: userName,
                email: userEmail,
                method: method,
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

async function updateDesign(userId: string, type: string, desId: string | null, desName: string | null) {
    let designId = ''
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 8; i++) {
        designId += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    const que = query(collection(db, 'data'), where('userId', '==', userId))
    const querySnapshot = await getDocs(que)
    const docId = querySnapshot.docs.map((doc) => doc.id)

    const docRef = doc(db, 'data', docId[0])

    if (type === 'add') {
        await updateDoc(docRef, {
            documents: arrayUnion({ docId: designId, docName: 'Untitled' })
        })

    } else if (type === 'remove') {
        await updateDoc(docRef, {
            documents: arrayRemove({ docId: desId, docName: desName })
        })
    }
}

export {
    getUserData,
    checkUser,
    cookieSetter,
    updateDesign,
}