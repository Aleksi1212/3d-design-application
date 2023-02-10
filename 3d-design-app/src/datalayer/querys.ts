import { db, storage } from "./config"
import { addDoc, collection, getDocs, getDoc, query, where, doc, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, collectionGroup, deleteField } from "firebase/firestore"
import { ref, uploadBytes } from "firebase/storage"

import images from "../functions/importImages"

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
                messagingId: messagingId,
                profileUrl: 'profileImages/defaultProfile.png'
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

interface types {
    userId: string,
    userName: any,
    action: string,
    friendId: any,
    friendName: any,
    friendMessagingId: any,
    userMessagingId: any,
    friendOrUser: string,
    state: any,
    blockedUser: any,
    image: any,
    // alertMessage: any
}

async function updateFriendOrUser(friendOrUserData: types) {
    const que = query(collection(db, 'data'), where('userId', '==', friendOrUserData.userId))
    const querySnapshot = await getDocs(que)
    const docId = querySnapshot.docs.map((doc) => doc.id)

    // remove friend
    if (friendOrUserData.action === 'remove' && friendOrUserData.friendOrUser === 'friend') {
        const docRef = doc(db, 'data', docId[0], 'friends', friendOrUserData.friendId)
        const docExists = await getDoc(docRef)
        
        if (docExists.data()) {
            const removeFriendPromise = await Promise.allSettled([
                deleteDoc(docRef)
            ])

            return removeFriendPromise[0].status === 'fulfilled' ? { message: 'Friend Removed', image: images.success } : { message: removeFriendPromise[0].reason, image: images.error }
        } else {
            return { message:'Error Removing Friend', image: images.error }
        }
        
    // send friend request
    } else if (friendOrUserData.action === 'add' && friendOrUserData.friendOrUser === 'friend') {
        const docRef = doc(db, 'data', docId[0], 'friends', friendOrUserData.friendId)
    
        const addFriendPromise = await Promise.allSettled([
            setDoc(docRef, {
                friendData: {
                    friendId: friendOrUserData.friendId,
                    friendName: friendOrUserData.friendName,
                    messagingId: friendOrUserData.friendMessagingId
                },
                user: friendOrUserData.userId,
                state: 'pending'
            })
        ])
    
        if (addFriendPromise[0].status === 'fulfilled') {
            const newQue = query(collection(db, 'data'), where('userId', '==', friendOrUserData.friendId))
            const querySnapshot = await getDocs(newQue)
            const friendDocId = querySnapshot.docs.map((doc) => doc.id)
    
            const friendDocRef = doc(db, 'data', friendDocId[0], 'friendRequests', friendOrUserData.userId)
    
            const friendRequestPromise = await Promise.allSettled([
                setDoc(friendDocRef, {
                    requestData: {
                        requestFromId: friendOrUserData.userId,
                        requestFromName: friendOrUserData.userName,
                        messagingId: friendOrUserData.userMessagingId
                    },
                    sentTo: friendOrUserData.friendId
                })
            ])
    
            return friendRequestPromise[0].status === 'fulfilled' ? { message: 'Friend Request Sent', image: images.success } : { message: friendRequestPromise[0].reason, image: images.error }
        }
    
        return { message: addFriendPromise[0].reason, image: images.error }

    // lock profile so that only friends can view it
    } else if (friendOrUserData.action === 'update' && friendOrUserData.friendOrUser === 'user') {
        const docRef = doc(db, 'data', docId[0])

        const updateStatePromise = await Promise.allSettled([
            updateDoc(docRef, {
                'locked': friendOrUserData.state
            })
        ])

        if (updateStatePromise[0].status === 'fulfilled') {
            return { message: friendOrUserData.state ? 'Succesfully Locked' : 'Succesfully Unlocked', image: images.success }
        }
        return { message: updateStatePromise[0].reason, image: images.error }

    // block user
    } else if (friendOrUserData.action === 'block' && friendOrUserData.friendOrUser === 'user') {
        const docRef = doc(db, 'data', docId[0], 'blockedUsers', 'blocked')

        const que = query(collectionGroup(db, 'friends'), where('friendData.friendId', '==', friendOrUserData.blockedUser))
        const querySnapshot = await getDocs(que)
        const friendExists = querySnapshot.docs.map((doc) => doc.data())

        const blockUserPromise = await Promise.allSettled([
            updateDoc(docRef, {
                'blockedusers': arrayUnion(friendOrUserData.blockedUser)
            })
        ])

        if (blockUserPromise[0].status === 'fulfilled') {
            return { message: 'User Blocked', image: images.success }

        } else if (blockUserPromise[0].status === 'rejected') {
            const setBlockedUserPromise = await Promise.allSettled([
                setDoc(docRef, {
                    blockedusers: [friendOrUserData.blockedUser],
                    user: friendOrUserData.userId
                })
            ])

            return setBlockedUserPromise[0].status === 'fulfilled' ? { message: 'User Blocked', image: images.success } : { message: setBlockedUserPromise[0].reason, image: images.error }
        }

        if (friendExists.length > 0) {
            updateFriendOrUser({
                userId: friendOrUserData.userId, userName: null, action: 'remove', friendId: friendOrUserData.blockedUser,
                friendName: null, friendMessagingId: null, userMessagingId: null, friendOrUser: 'friend', state: null,
                blockedUser: null, image: null
            })
        }

    // unblock user
    } else if (friendOrUserData.action === 'unBlock' && friendOrUserData.friendOrUser === 'user') {
        const docRef = doc(db, 'data', docId[0], 'blockedUsers', 'blocked')

        const unblockUserPromise = await Promise.allSettled([
            updateDoc(docRef, {
                'blockedusers': arrayRemove(friendOrUserData.blockedUser)
            })
        ])

        return unblockUserPromise[0].status === 'fulfilled' ? { message: 'User Unblocked', image: images.success } : { message: unblockUserPromise[0].reason, image: images.error }

    // update profile picture
    } else if (friendOrUserData.action === 'updateProfile' && friendOrUserData.friendOrUser === 'user') {
        const imageId = generateId(5)
        const testRef = ref(storage, `profileImages/${imageId+friendOrUserData.image.name}`)

        uploadBytes(testRef, friendOrUserData.image)
        .then(async (snapshot) => {
            const docRef = doc(db, 'data', docId[0])
            await updateDoc(docRef, {
                'profileUrl': `profileImages/${imageId+friendOrUserData.image.name}`
            })
        })
        .catch((err) => {
            console.log(err);
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