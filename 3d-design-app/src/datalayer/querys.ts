import { db, storage } from "./config"
import { addDoc, collection, getDocs, getDoc, query, where, doc, setDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, collectionGroup, deleteField } from "firebase/firestore"
import { ref, uploadBytes, deleteObject } from "firebase/storage"

import images from "../functions/importImages"

// function to generate a random id with the length of given number
function generateId(length: number) {
    let id = ''
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return id
}

/*
function that checks if users data exists, if so, then does nothing,
but if not, then adds a new user to the database
 */
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


/* 
Function that creates a new cookie with values userState and userId.
If user is signed in, then userState is true, and userId is the current users userId, else userState is false and userId is null
*/
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


// function to update designs data. Add new design, remove existing design or update existing design
async function updateDesign(userId: string, action: string, oldDesignId: string, newName: string) {
    const newDesignId = generateId(8)

    const designQue = query(collection(db, 'dataDesigns'), where('userId', '==', userId))
    const profileQue = query(collection(db, 'data'), where('userId', '==', userId))

    const designQuerySnapshot = await getDocs(designQue)
    const profileQuerySnapshot = await getDocs(profileQue)

    const designDocId = designQuerySnapshot.docs.map((doc) => doc.id)
    const profileDocId = profileQuerySnapshot.docs.map((doc) => doc.id)

    if (action === 'add') {
        const designDocRef = doc(db, 'dataDesigns', designDocId[0], 'designs', newDesignId)
        const profileDocRef = doc(db, 'data', profileDocId[0], 'usersDesigns', newDesignId)
    
        const designPromises = await Promise.allSettled([
            setDoc(designDocRef, {
                designData: {
                    docId: newDesignId,
                    docName: 'Untitled'
                },
                user: userId
            }),

            setDoc(profileDocRef, {
                designData: {
                    docId: newDesignId,
                    docName: 'Untitled'
                },
                user: userId
            })
        ])

        if (designPromises[0].status === 'fulfilled') {
            return { message: 'New Design Created', image: images.success, type: 'success' }
        }

        return { message: designPromises[0].reason.message, image: images.error, type: designPromises[0].reason.constructor.name }

    } else if (action === 'remove') {
        const designDocRef = doc(db, 'dataDesigns', designDocId[0], 'designs', oldDesignId)
        const profileDocRef = doc(db, 'data', profileDocId[0], 'usersDesigns', oldDesignId)

        const deleteDesignPromise = await Promise.allSettled([
            deleteDoc(designDocRef),
            deleteDoc(profileDocRef)
        ])

        if (deleteDesignPromise[0].status === 'fulfilled') {
            return { message: 'Design Deleted', image: images.success, type: 'success' }
        }

        return { message: deleteDesignPromise[0].reason.message, image: images.error, type: deleteDesignPromise[0].reason.constructor.name }

    } else if (action === 'update') {
        const designDocRef = doc(db, 'dataDesigns', designDocId[0], 'designs', oldDesignId)
        const profileDocRef = doc(db, 'data', profileDocId[0], 'usersDesigns', oldDesignId)

        const updateDesignPromise = await Promise.allSettled([
            updateDoc(designDocRef, {
                'designData.docName': newName
            }),

            updateDoc(profileDocRef, {
                'designData.docName': newName
            })
        ])

        if (updateDesignPromise[0].status === 'fulfilled') {
            return { message: `Name Updated To: ${newName}`, image: images.success, type: 'success' }
        }

        return { message: updateDesignPromise[0].reason.message, image: images.error, type: updateDesignPromise[0].reason.constructor.name }
    }
}


// function to update users data
async function updateFriendOrUser(friendOrUserData: any) {
    const que = query(collection(db, 'data'), where('userId', '==', friendOrUserData.userId !== null ? friendOrUserData.userId : 'errorid'))
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

            return removeFriendPromise[0].status === 'fulfilled' ? { 
                message: 'Friend Removed', image: images.success, type: 'success' 
            } : { 
                message: removeFriendPromise[0].reason.message, image: images.error, type: removeFriendPromise[0].reason.constructor.name 
            }

        } else {
            return { message:'Friend Not Found', image: images.error, type: 'unkown error' }
        }
        
    // send friend request
    } else if (friendOrUserData.action === 'add' && friendOrUserData.friendOrUser === 'friend') {
        const friendQue = query(collection(db, 'data'), where('userId', '==', friendOrUserData.friendId))
        const newquerySnapshot = await getDocs(friendQue)
        const friendDocId = newquerySnapshot.docs.map((doc) => doc.id)

        const docRef = doc(db, 'data', docId[0], 'friends', friendOrUserData.friendId)
        const friendDocRef = doc(db, 'data', friendDocId[0], 'friendRequests', friendOrUserData.userId !== null ? friendOrUserData.userId : 'errorid')

        const addFriendPromise = await Promise.allSettled([
            setDoc(docRef, {
                friendData: {
                    friendId: friendOrUserData.friendId,
                    friendName: friendOrUserData.friendName,
                    messagingId: friendOrUserData.friendMessagingId
                },
                user: friendOrUserData.userId,
                state: 'pending'
            }),

            setDoc(friendDocRef, {
                requestData: {
                    requestFromId: friendOrUserData.userId,
                    requestFromName: friendOrUserData.userName,
                    messagingId: friendOrUserData.userMessagingId
                },
                sentTo: friendOrUserData.friendId
            })
        ])
    
        return addFriendPromise[0].status === 'fulfilled' ? {
            message: 'Friend Request Sent', image: images.success, type: 'success'
        } : {
            message: addFriendPromise[0].reason.message, image: images.error, type: addFriendPromise[0].reason.constructor.name
        }
        
    // lock profile so that only friends can view it
    } else if (friendOrUserData.action === 'update' && friendOrUserData.friendOrUser === 'user') {
        const docRef = doc(db, 'data', docId[0])

        const updateStatePromise = await Promise.allSettled([
            updateDoc(docRef, {
                'locked': friendOrUserData.state
            })
        ])

        if (updateStatePromise[0].status === 'fulfilled') {
            return { message: friendOrUserData.state ? 'Succesfully Locked' : 'Succesfully Unlocked', image: images.success, type: 'success' }
        }
        return { message: updateStatePromise[0].reason.message, image: images.error, type: updateStatePromise[0].reason.constructor.name }

    // block user
    } else if (friendOrUserData.action === 'block' && friendOrUserData.friendOrUser === 'user') {
        const docRef = doc(db, 'data', docId[0], 'blockedUsers', 'blocked')
        const friendDoc = doc(db, 'data', docId[0], 'friends', friendOrUserData.blockedUser)

        const que = query(collectionGroup(db, 'friends'), where('friendData.friendId', '==', friendOrUserData.blockedUser))
        const querySnapshot = await getDocs(que)
        const friendExists = querySnapshot.docs.map((doc) => doc.data())


        const blockUserPromise = await Promise.allSettled([
            updateDoc(docRef, {
                'blockedusers': arrayUnion(friendOrUserData.blockedUser)
            }),
            friendExists.length > 0 ?
            deleteDoc(friendDoc) : null
        ])

        if (blockUserPromise[0].status === 'fulfilled') {
            return { message: 'User Blocked', image: images.success, type: 'success' }

        } else if (blockUserPromise[0].status === 'rejected') {
            const setBlockedUserPromise = await Promise.allSettled([
                setDoc(docRef, {
                    blockedusers: [friendOrUserData.blockedUser],
                    user: friendOrUserData.userId
                }),
                friendExists.length > 0 ?
                deleteDoc(friendDoc) : null
            ])

            return setBlockedUserPromise[0].status === 'fulfilled' ? { 
                message: 'User Blocked', image: images.success, type: 'success' 
            } : { 
                message: setBlockedUserPromise[0].reason.message, image: images.error, type: setBlockedUserPromise[0].reason.constructor.name
            }
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

        return unblockUserPromise[0].status === 'fulfilled' ? { 
            message: 'User Unblocked', image: images.success, type: 'success' 
        } : { 
            message: unblockUserPromise[0].reason.message, image: images.error, type: unblockUserPromise[0].reason.constructor.name
        }

    // update profile picture
    } else if (friendOrUserData.action === 'updateProfile' && friendOrUserData.friendOrUser === 'user') {
        const imageId = generateId(5)

        const storageRef = ref(storage, `profileImages/${imageId+friendOrUserData.image.name}`)
        const docRef = doc(db, 'data', docId[0])
        const oldprofileUrl = await getDoc(docRef)

        const profilePicturePromise = oldprofileUrl?.data()?.profileUrl !== 'profileImages/defaultProfile.png' ? 

        await Promise.allSettled([
            uploadBytes(storageRef, friendOrUserData.image),
            deleteObject(ref(storage, oldprofileUrl?.data()?.profileUrl)),
            updateDoc(docRef, {
                'profileUrl': `profileImages/${imageId+friendOrUserData.image.name}`
            })
        ])
        
        :

        await Promise.allSettled([
            uploadBytes(storageRef, friendOrUserData.image),
            updateDoc(docRef, {
                'profileUrl': `profileImages/${imageId+friendOrUserData.image.name}`
            })
        ])

        return profilePicturePromise[0].status === 'fulfilled' ? {
            message: 'Profile Image Updated', image: images.success, type: 'success'
        } : {
            message: profilePicturePromise[0].reason.message, image: images.error, type: profilePicturePromise[0].reason.constructor.name
        }
    }
}

// function that accepts pending friend requests
async function acceptFriendRequest(sentToId: string, sentFromId: string, sentFromName: string, sentFromMessagingId: string) {
    const querys = {
        sentToQuery: query(collection(db, 'data'), where('userId', '==', sentToId)),
        sentFromQuery: query(collection(db, 'data'), where('userId', '==', sentFromId))
    }

    const sentToSnapShot = await getDocs(querys.sentToQuery)
    const sentFromSnapShot = await getDocs(querys.sentFromQuery)

    const docIds = {
        sentToDocId: sentToSnapShot.docs.map((doc) => doc.id),
        sentFromDocId: sentFromSnapShot.docs.map((doc) => doc.id)
    }

    const docRefs = {
        sentToDocRef: doc(db, 'data', docIds.sentToDocId[0], 'friendRequests', sentFromId), 
        sentFromDocRef: doc(db, 'data', docIds.sentFromDocId[0], 'friends', sentToId),
        addFriendRef: doc(db, 'data', docIds.sentToDocId[0], 'friends', sentFromId)
    }

    const acceptRequestPromise = await Promise.allSettled([
        deleteDoc(docRefs.sentToDocRef),
        updateDoc(docRefs.sentFromDocRef, {
            'state': 'accepted'
        }),

        setDoc(docRefs.addFriendRef, {
            friendData: {
                friendId: sentFromId,
                friendName: sentFromName,
                messagingId: sentFromMessagingId
            },
            state: 'accepted',
            user: sentToId
        })
    ])

    return acceptRequestPromise[0].status === 'fulfilled' ? {
        message: 'Friend Added', image: images.success, type: 'success'
    } : {
        message: acceptRequestPromise[0].reason.message, image: images.error, type: acceptRequestPromise[0].reason.constructor.name
    }
}

export {
    checkUser,
    cookieSetter,
    updateDesign,
    updateFriendOrUser,
    generateId,
    acceptFriendRequest
}