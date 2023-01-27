import { db } from "./config"
import { addDoc, collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove, setDoc, collectionGroup } from "firebase/firestore"

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
                method: method
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
            documents: arrayUnion({ docId: designId, docName: desName })
        })

    } else if (type === 'remove') {
        await updateDoc(docRef, {
            documents: arrayRemove({ docId: desId, docName: desName })
        })
    } else if (type === 'update') {
        await updateDoc(docRef, {
            documents: arrayUnion({ docId: desId, docName: desName })
        })
    }
}

async function addNewDesign(userId: string) {
    let desId = ''
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < 8; i++) {
        desId += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    // await setDoc(collectionGroup(db, 'designs'), {
    //     design: {
    //         docId: desId,
    //         docName: 'Untitled'
    //     },
    //     user: userId
    // })

    const que = query(collection(db, 'data'), where('userId', '==', userId))
    const querySnapshot = await getDocs(que)
    const docId = querySnapshot.docs.map((doc) => doc.id)

    const docRef = doc(db, 'data', docId[0], 'designs', desId)

    setDoc(docRef, {
        test: 'test'
    })
    
}

export {
    getUserData,
    checkUser,
    cookieSetter,
    updateDesign,
    addNewDesign
}