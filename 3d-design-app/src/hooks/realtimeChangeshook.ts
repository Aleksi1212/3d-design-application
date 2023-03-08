'use client';

import { useState, useEffect, SetStateAction } from "react";

import { db } from "../datalayer/config";
import { collection, collectionGroup, onSnapshot, query, where } from "firebase/firestore";

interface currentUserTypes {
    userId: string
    username: string
    email: string
    method: string
    profileUrl: string
    messagingId: string
}

function useRealtimeChanges(userId: string, currentUserId: string, userMessagingId: string) {
    const [friendData, setFriendData] = useState([])
    const [currentUserFriendData, setCurrentUserFriendData] = useState([])
    const [pendingFriends, setPendingFriends] = useState([])
    const [designData, setDesignData] = useState([])

    const [blockedUsers, setBlockedUsers] = useState([])

    const [userLocked, setUserLocked] = useState({ state: false })
    const [blocked, setBlocked] = useState(false)
    const [messagingId, setMessagingId] = useState(String)
    const [profileUrl, setProfileUrl] = useState(String)

    const [currentUserData, setCurrentUserData] = useState<currentUserTypes>({ userId: '', username: '', email: '', method: '', profileUrl: '', messagingId: '' })
    
    useEffect(() => {
        const querys = {
            friendQuery: query(collectionGroup(db, 'friends'), where('user', '==', userId), where('state', '==', 'accepted')),
            currentUserFriendQuery: query(collectionGroup(db, 'friends'), where('user', '==', currentUserId), where('state', '==', 'accepted')),
            pendingFriendsQuery: query(collectionGroup(db, 'friendRequests'), where('sentTo', '==', currentUserId)),

            userQuery: query(collection(db, 'data'), where('userId', '==', userId)),
            currendUserQuery: query(collection(db, 'data'), where('userId', '==', currentUserId !== null ? currentUserId : userId)),

            blockedQuery: query(collectionGroup(db, 'blockedUsers'), where('blockedusers', 'array-contains', userId), where('user', '==', currentUserId)),
            blockedUsersQuery: query(collectionGroup(db, 'blockedUsers'), where('blockedBy', '==', currentUserId)),

            designQuery: query(collectionGroup(db, 'usersDesigns'), where('user', '==', currentUserId))
        }

        const getFriendData = onSnapshot(querys.friendQuery, (querySnapshot) => {
            let friends: SetStateAction<any> = []
            
            querySnapshot.forEach((friend) => {
                friends.push(friend.data().friendData)
            })

            setFriendData(friends)
        })

        const getCurrentUserFriends = onSnapshot(querys.currentUserFriendQuery, (querySnapshot) => {
            let currentUserFriends: SetStateAction<any> = []

            querySnapshot.forEach((currentUserFriend) => {
                currentUserFriends.push(currentUserFriend.data().friendData)
            })

            setCurrentUserFriendData(currentUserFriends)
        })

        const getUserData = onSnapshot(querys.userQuery, (querySnapshot) => {
            let userLocked: any = { state: Boolean }
            let profileUrl: string = ''
            let messagingId: string = ''

            querySnapshot.forEach((user) => {
                userLocked.state = user.data().locked
                profileUrl = user.data().profileUrl
                messagingId = user.data().messagingId
            })

            setUserLocked(userLocked)
            setProfileUrl(profileUrl)
            setMessagingId(messagingId)
        })

        const getCurrentUserData = onSnapshot(querys.currendUserQuery, (querySnapshot) => {
            let userData: any

            querySnapshot.forEach((currentUser) => {
                userData = {
                    ...currentUser.data()
                }
            })

            setCurrentUserData(userData)
        })

        const getBlockedData = onSnapshot(querys.blockedQuery, (querySnapshot) => {
            let blockedData: Array<any> = []

            querySnapshot.forEach((user) => {
                blockedData.push(user.data())
            })

            blockedData.length > 0 ? setBlocked(true) : setBlocked(false)
        })

        const getDesigns = onSnapshot(querys.designQuery, (querySnapshot) => {
            let desingns: SetStateAction<any> = []

            querySnapshot.forEach((design) => {
                desingns.push(design.data().designData)
            })

            setDesignData(desingns)
        })

        const getPendingFriends = onSnapshot(querys.pendingFriendsQuery, (querySnapshot) => {
            let pendingFriends: SetStateAction<any> = []

            querySnapshot.forEach((pendingFriend) => {
                pendingFriends.push(pendingFriend.data().requestData)
            })

            setPendingFriends(pendingFriends)
        })

        const getBlockedUsers = onSnapshot(querys.blockedUsersQuery, (querySnapshot) => {
            let blockedUsers: SetStateAction<any> = []

            querySnapshot.forEach((user) => {
                blockedUsers.push(user.data().blockedUserData)
            })

            setBlockedUsers(blockedUsers)
        })

        return () => {
            getFriendData()
            getCurrentUserFriends()
            getPendingFriends()
            
            getUserData()
            getCurrentUserData()

            getBlockedData()
            getBlockedUsers()

            getDesigns()
        }
    }, [])

    return {
        friendData: friendData,
        currentUserFriendData: currentUserFriendData,
        pendingFriends: pendingFriends,

        designData: designData,
        blockedUsers: blockedUsers,

        userLocked: userLocked,
        blocked: blocked,
        messagingId: messagingId,
        profileUrl: profileUrl,

        currentUserData: currentUserData
    }
}

export default useRealtimeChanges