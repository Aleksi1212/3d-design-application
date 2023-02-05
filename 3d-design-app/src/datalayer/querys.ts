import { db } from "./config"
import { addDoc, collection, getDocs, query, where, doc, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"

function generateId(length: number) {
    let id = ''
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return id
}

async function getUserData(data: any) {
    const que = query(collection(db, 'data'), where('userId', '==', data.userId))
    const querySnapshot = await getDocs(que)

    const userData = querySnapshot.docs.map((doc) => doc.data())
    return userData
}

async function checkUser(userId: string, userName: string, userEmail: string, method: string) {
    const messagingId = generateId(5)

    const que = query(collection(db, 'data'), where('userId', '==', userId))
    const querySnapshot = await getDocs(que)

    if (querySnapshot.empty) {
        try {
            const docRef = await addDoc(collection(db, 'data'), {
                userId: userId,
                username: userName,
                email: userEmail,
                method: method,
                locked: false,
                messagingId: messagingId
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


async function updateDesign(userId: string, action: string, oldDesignId: string, newName: string) {
    const newDesignId = generateId(8)

    const que = query(collection(db, 'data'), where('userId', '==', userId))
    const querySnapshot = await getDocs(que)
    const docId = querySnapshot.docs.map((doc) => doc.id)

    if (action === 'add') {
        const docRef = doc(db, 'data', docId[0], 'designs', newDesignId)
    
        await setDoc(docRef, {
            designData: {
                docId: newDesignId,
                docName: 'Untitled'
            },
            user: userId
        })

    } else if (action === 'remove') {
        const docRef = doc(db, 'data', docId[0], 'designs', oldDesignId)

        await deleteDoc(docRef)

    } else if (action === 'update') {
        const docRef = doc(db, 'data', docId[0], 'designs', oldDesignId)

        await updateDoc(docRef, {
            'designData.docName': newName
        })
    }
}

async function updateFriendOrUser(userId: string, action: string, friendId: string | any, friendName: string | any, messagingId: string | any, friendOrUser: string, state: boolean | null, blockedUser: string | null) {
    const que = query(collection(db, 'data'), where('userId', '==', userId))
    const querySnapshot = await getDocs(que)
    const docId = querySnapshot.docs.map((doc) => doc.id)

    if (action === 'remove' && friendOrUser === 'friend') {
        const docRef = doc(db, 'data', docId[0], 'friends', friendId)
        await deleteDoc(docRef)

    } else if (action === 'update' && friendOrUser === 'user') {
        const docRef = doc(db, 'data', docId[0])
        await updateDoc(docRef, {
            'locked': state
        })

    } else if (action === 'add' && friendOrUser === 'friend') {
        const docRef = doc(db, 'data', docId[0], 'friends', friendId)
        await setDoc(docRef, {
            friendData: {
                friendId: friendId,
                friendName: friendName,
                messagingId: messagingId
            },
            user: userId
        })

    } else if (action === 'block' && friendOrUser === 'user') {
        const docRef = doc(db, 'data', docId[0], 'blockedUsers', 'blocked')

        const result = await Promise.allSettled([
            updateDoc(docRef, {
                users: arrayUnion(blockedUser)
            })
        ])

        if (result[0].status === 'rejected') {
            await setDoc(docRef, {
                users: [blockedUser]
            })
        }

    } else if (action === 'unBlock' && friendOrUser === 'user') {
        const docRef = doc(db, 'data', docId[0], 'blockedUsers', 'blocked')
        await updateDoc(docRef, {
            users: arrayRemove(blockedUser)
        })
    }
}



export {
    getUserData,
    checkUser,
    cookieSetter,
    updateDesign,
    updateFriendOrUser,
    generateId
}