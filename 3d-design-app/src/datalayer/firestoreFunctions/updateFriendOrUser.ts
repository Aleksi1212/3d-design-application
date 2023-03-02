import { db, storage } from "../config"
import { query, collection, collectionGroup, where, getDocs, doc, getDoc, deleteDoc, updateDoc, setDoc, arrayUnion, arrayRemove  } from "firebase/firestore"
import { ref, uploadBytes, deleteObject } from "firebase/storage"

import images from "../../functions/importImages"
import { generateId } from "../otherFunctionality"

async function updateFriendOrUser(friendOrUserData: any) {
    const que = query(collection(db, 'data'), where('userId', '==', friendOrUserData.userId !== null ? friendOrUserData.userId : 'errorid'))
    const querySnapshot = await getDocs(que)
    const docId = querySnapshot.docs.map((doc) => doc.id)

    // remove friend
    if (friendOrUserData.action === 'remove' && friendOrUserData.friendOrUser === 'friend') {
        const friendsDocRef = doc(db, 'data', docId[0], 'friends', friendOrUserData.friendId)

        const docExists = await getDoc(friendsDocRef)
        
        if (docExists.data()) {
            const userQuery = query(collection(db, 'data'), where('userId', '==', friendOrUserData.friendId))
            const userQuerySnapshot = await getDocs(userQuery)
            const userDocId = userQuerySnapshot.docs.map((doc) => doc.id)

            const userDocRef = doc(db, 'data', userDocId[0], 'friends', friendOrUserData.userId)

            const removeFriendPromise = await Promise.allSettled([
                deleteDoc(friendsDocRef),
                deleteDoc(userDocRef)
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
        const blockedDocRef_1 = doc(db, 'data', docId[0], 'blockedUsers', 'blocked')
        const blockedDocRef_2 = doc(db, 'data', docId[0], 'blockedUsers', friendOrUserData.blockedUser)

        const friendDoc = doc(db, 'data', docId[0], 'friends', friendOrUserData.blockedUser)

        const friendQuery = query(collectionGroup(db, 'friends'), where('friendData.friendId', '==', friendOrUserData.blockedUser))
        const userQuery = query(collection(db, 'data'), where('userId', '==', friendOrUserData.blockedUser))

        const friendQuerySnapshot = await getDocs(friendQuery)
        const friendExists = friendQuerySnapshot.docs.map((doc) => doc.data())

        const userQuerySnapshot = await getDocs(userQuery)
        const userData = userQuerySnapshot.docs.map((doc) => doc.exists() ? doc.data() : {
            messagingId: '',
            email: '',
            method: '',
            userName: '',
            locked: false,
            profileUrl: '',
            userId: ''
        })

        const blockUserPromise = await Promise.allSettled([
            updateDoc(blockedDocRef_1, {
                'blockedusers': arrayUnion(friendOrUserData.blockedUser)
            }),

            setDoc(blockedDocRef_2, {
                blockedBy: friendOrUserData.userId,
                blockedUserData: {
                    messagingId: userData[0].messagingId,
                    profileUrl: userData[0].profileUrl,
                    userId: userData[0].userId,
                    username: userData[0].username
                }
            }),

            friendExists.length > 0 ?
            deleteDoc(friendDoc) : null
        ])

        if (blockUserPromise[0].status === 'fulfilled') {
            return { message: 'User Blocked', image: images.success, type: 'success' }

        } else if (blockUserPromise[0].status === 'rejected') {
            const setBlockedUserPromise = await Promise.allSettled([
                setDoc(blockedDocRef_1, {
                    blockedusers: [friendOrUserData.blockedUser],
                    user: friendOrUserData.userId
                }),

                setDoc(blockedDocRef_2, {
                    blockedBy: friendOrUserData.userId,
                    blockedUserData: {
                        messagingId: userData[0].messagingId,
                        profileUrl: userData[0].profileUrl,
                        userId: userData[0].userId,
                        username: userData[0].username
                    }
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
        const blockedDocRef_1 = doc(db, 'data', docId[0], 'blockedUsers', 'blocked')
        const blockedDocRef_2 = doc(db, 'data', docId[0], 'blockedUsers', friendOrUserData.blockedUser)

        const unblockUserPromise = await Promise.allSettled([
            updateDoc(blockedDocRef_1, {
                'blockedusers': arrayRemove(friendOrUserData.blockedUser)
            }),

            deleteDoc(blockedDocRef_2)
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

export default updateFriendOrUser