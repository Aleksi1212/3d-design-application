import { db, storage } from "../config";
import { query, collection, collectionGroup, where, getDocs, doc, getDoc, deleteDoc, updateDoc, setDoc, arrayUnion, arrayRemove  } from "firebase/firestore"
import { ref, uploadBytes, deleteObject } from "firebase/storage"

import images from "../../functions/importImages";
import { generateId } from "../otherFunctionality";

import { StaticImageData } from "next/image";


interface returnType {
    message: string
    image: StaticImageData
    type: string
}

class UpdateFriendOrUser {
    docId: string

    static async createDocId(userId: string) {
        const userQuery = query(collection(db, 'data'), where('userId', '==', userId))
        const userQuerySnapshot = await getDocs(userQuery)
        const docId = userQuerySnapshot.docs.map((doc) => doc.id)

        return new UpdateFriendOrUser(docId[0])
    }

    constructor(docId: string) {
        this.docId = docId
    }


    // method to remove friend
    async removeFriend(userId: string, friendId: string) {
        try {
            const friendQuery = query(collection(db, 'data'), where('userId', '==', friendId))
            const friendQuerySnapshot = await getDocs(friendQuery)
            const friendDocId = friendQuerySnapshot.docs.map((doc) => doc.id)

            const friendsDocRef = doc(db, 'data', this.docId, 'friends', friendId)
            const userDocRef = doc(db, 'data', friendDocId[0], 'friends', userId)


            const removeFriend = await Promise.allSettled([
                deleteDoc(friendsDocRef),
                deleteDoc(userDocRef)
            ])

            return (
                removeFriend[0].status == 'fulfilled' ? {
                    message: 'Friend Removed', image: images.success, type: 'success'
                } : {
                    message: removeFriend[0].reason.message, image: images.error, type: removeFriend[0].reason.constructor.name
                }
            ) as returnType

        } catch(err: any) {
            return { message: 'Error Removing Friend', image: images.error, type: err.constructor.name } as returnType
        }
    }


    // method to send friend request
    async sendFriendRequest(userId: string, userName: string, userMessagingId: string, friendId: string, friendName: string, friendMessagingId: string) {
        try {
            const friendQuery = query(collection(db, 'data'), where('userId', '==', friendId))
            const friendQuerySnapshot = await getDocs(friendQuery)
            const friendDocId = friendQuerySnapshot.docs.map((doc) => doc.id)
            
            const userDocRef = doc(db, 'data', this.docId, 'friends', friendId)
            const friendDocRef = doc(db, 'data', friendDocId[0], 'friendRequests', userId)

            const addFriend = await Promise.allSettled([
                setDoc(userDocRef, {
                    friendData: {
                        friendId: friendId,
                        friendName: friendName,
                        messagingId: friendMessagingId
                    },
                    user: userId,
                    state: 'pending'
                }),

                setDoc(friendDocRef, {
                    requestData: {
                        requestFromId: userId,
                        requestFromName: userName,
                        messagingId: userMessagingId
                    },
                    sentTo: friendId
                })
            ])

            return (
                addFriend[0].status === 'fulfilled' ? {
                    message: 'Friend Request Sent', image: images.success, type: 'success'
                } : {
                    message: addFriend[0].reason.message, image: images.error, type: addFriend[0].reason.constructor.name
                }
            ) as returnType

        } catch(err: any) {
            return { message: 'Error Sending Friend Request', image: images.error, type: err.constructor.name  } as returnType
        }
    }


    // method to change users visibility
    async updateUserState(state: boolean) {
        try {
            const userDocRef = doc(db, 'data', this.docId)
            const update_UserState = await Promise.allSettled([
                updateDoc(userDocRef, {
                    'locked': state
                })
            ])

            return (
                update_UserState[0].status === 'fulfilled' ? {
                    message: state ? 'Profile Locked' : 'Profile Unlocked', image: images.success, type: 'success'
                } : {
                    message: update_UserState[0].reason.message, image: images.error, type: update_UserState[0].reason.constructor.name
                }
            ) as returnType

        } catch(err: any) {
            return { message: state ? 'Error locking Profile' : 'Error Unlocking Profile', image: images.error, type: err.constructor.name } as returnType
        }
    }


    // method to block user
    async blockUser(blockedUserId: string, userId: string) {
        try {
            const blockedDocRef_1 = doc(db, 'data', this.docId, 'blockedUsers', 'blocked')
            const blockedDocRef_2 = doc(db, 'data', this.docId, 'blockedUsers', blockedUserId)

            const friendDoc = doc(db, 'data', this.docId, 'friends', blockedUserId)

            const friendQuery = query(collectionGroup(db, 'friends'), where('friendData.friendId', '==', blockedUserId))
            const blockedUserQuery = query(collection(db, 'data'), where('userId', '==', blockedUserId))

            const friendQuerySnapshot = await getDocs(friendQuery)
            const friendExists = friendQuerySnapshot.docs.map((doc) => doc.data())

            if (friendExists.length > 0) {
                this.removeFriend(userId, blockedUserId)
            }

    
            const userQuerySnapshot = await getDocs(blockedUserQuery)
            const blockedUserData = userQuerySnapshot.docs.map((doc) => doc.exists() ? doc.data() : {
                messagingId: '',
                email: '',
                method: '',
                userName: '',
                locked: false,
                profileUrl: '',
                userId: ''
            })

            const block_User = await Promise.allSettled([
                updateDoc(blockedDocRef_1, {
                    'blockedusers': arrayUnion(blockedUserId)
                }),
    
                setDoc(blockedDocRef_2, {
                    blockedBy: userId,
                    blockedUserData: {
                        messagingId: blockedUserData[0].messagingId,
                        profileUrl: blockedUserData[0].profileUrl,
                        userId: blockedUserData[0].userId,
                        username: blockedUserData[0].username
                    }
                }),
    
                friendExists.length > 0 ?
                deleteDoc(friendDoc) : null
            ])


            if (block_User[0].status === 'fulfilled') {
                return { message: 'User Blocked Succesfully', image: images.success, type: 'success' } as returnType
            }

            const setBlockeduser = await Promise.allSettled([
                setDoc(blockedDocRef_1, {
                    blockedusers: [blockedUserId],
                    user: userId
                }),

                setDoc(blockedDocRef_2, {
                    blockedBy: userId,
                    blockedUserData: {
                        messagingId: blockedUserData[0].messagingId,
                        profileUrl: blockedUserData[0].profileUrl,
                        userId: blockedUserData[0].userId,
                        username: blockedUserData[0].username
                    }
                }),

                friendExists.length > 0 ?
                deleteDoc(friendDoc) : null
            ])

            return (
                setBlockeduser[0].status === 'fulfilled' ? {
                    message: 'User Blocked Succesfully', image: images.success, type: 'success'
                } : {
                    message: setBlockeduser[0].reason.message, image: images.error, type: setBlockeduser[0].reason.constructor.name
                }
            ) as returnType


        } catch(err: any) {
            return { message: 'Error Blocking User', image: images.error, type: err.constructor.name } as returnType
        }
    }


    // method to unblock user
    async unBlockUser(blockedUserId: string) {
        try {
            const blockedDocRef_1 = doc(db, 'data', this.docId, 'blockedUsers', 'blocked')
            const blockedDocRef_2 = doc(db, 'data', this.docId, 'blockedUsers', blockedUserId)

            const unblock_User = await Promise.allSettled([
                updateDoc(blockedDocRef_1, {
                    'blockedusers': arrayRemove(blockedUserId)
                }),
    
                deleteDoc(blockedDocRef_2)
            ])

            return (
                unblock_User[0].status === 'fulfilled' ? {
                    message: 'User Succesfully Unblocked', image: images.success, type: 'success'
                } : {
                    message: unblock_User[0].reason.message, image: images.error, type: unblock_User[0].reason.constructor.name
                }
            ) as returnType


        } catch(err: any) {
            return { message: 'Error Unblocking User', image: images.error, type: err.constructor.name } as returnType
        }
    }


    // method to update profile image
    async updateProfilePicture(image: any) {
        try {
            const imageId = generateId(5)

            const storageRef = ref(storage, `profileImages/${imageId+image.name}`)
            const userDocRef = doc(db, 'data', this.docId)
            const oldprofileUrl = await getDoc(userDocRef)

            const update_ProfilePicture = oldprofileUrl.data()?.profileUrl !== 'profileImages/defaultProfile.png' ?

            await Promise.allSettled([
                uploadBytes(storageRef, image),
                deleteObject(ref(storage, oldprofileUrl.data()?.profileUrl)),
                updateDoc(userDocRef, {
                    'profileUrl': `profileImages/${imageId+image.name}`
                })
            ])

            :

            await Promise.allSettled([
                uploadBytes(storageRef, image),
                updateDoc(userDocRef, {
                    'profileUrl': `profileImages/${imageId+image.name}`
                })
            ])

            return (
                update_ProfilePicture[0].status === 'fulfilled' ? {
                    message: 'Profile Image Updated', image: images.success, type: 'success'
                }: {
                    message: update_ProfilePicture[0].reason.message, image: images.error, type: update_ProfilePicture[0].reason.constructor.name
                }
            ) as returnType


        } catch(err: any) {
            return { message: 'Error Changing Profile Image', image: images.error, type: err.constructor.name } as returnType
        }
    }
}


export default UpdateFriendOrUser