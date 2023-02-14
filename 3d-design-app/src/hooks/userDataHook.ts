'use client';

import { useState, useEffect, SetStateAction } from "react";

import { db } from "../datalayer/config";
import { collection, collectionGroup, onSnapshot, query, where } from "firebase/firestore";

interface currentUserTypes {
    userId: string
    name: string
    email: string
    method: string
    profileUrl: string
}

function useUserData(userId: string, currentUserId: string) {
    const [friendData, setFriendData] = useState([])
    const [currentUserFriendData, setCurrentUserFriendData] = useState([])
    const [designData, setDesignData] = useState([])

    const [userLocked, setUserLocked] = useState({ state: false })
    const [blocked, setBlocked] = useState(false)
    const [messagingId, setMessagingId] = useState(String)
    const [profileUrl, setProfileUrl] = useState(String)

    const [currentUserMessagingId, setCurrentUserMessagingId] = useState(String)
    const [currentUserName, setCurrentUserName] = useState(String)
    const [currentUserEmail, setCurrentUserEmail] = useState(String)
    const [currentUserMethod, setCurrentUserMethod] = useState(String)

    // const [currentUserData, setCurrentUserData] = useState<currentUserTypes>({ userId: '', name: '', email: '', method: '', profileUrl: '' })
    
    useEffect(() => {
        const querys = {
            friendQuery: query(collectionGroup(db, 'friends'), where('user', '==', userId), where('state', '==', 'accepted')),
            currentUserFriendQuery: query(collectionGroup(db, 'friends'), where('user', '==', currentUserId), where('state', '==', 'accepted')),
            userQuery: query(collection(db, 'data'), where('userId', '==', userId)),
            currendUserQuery: query(collection(db, 'dataDesigns'), where('userId', '==', currentUserId)),
            blockedQuery: query(collectionGroup(db, 'blockedUsers'), where('blockedusers', 'array-contains', userId), where('user', '==', currentUserId)),
            designQuery: query(collectionGroup(db, 'designs'), where('user', '==', currentUserId)),
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
            let messagingId: string = ''
            let userName: string = ''
            let email: string = ''
            let method: string = ''

            querySnapshot.forEach((currentUser) => {
                messagingId = currentUser.data().messagingId
                userName = currentUser.data().username
                email = currentUser.data().email
                method = currentUser.data().method

            })

            setCurrentUserMessagingId(messagingId)
            setCurrentUserName(userName)
            setCurrentUserEmail(email)
            setCurrentUserMethod(method)

            // setCurrentUserData({ messagingId: messagingId, name: userName, email: email, method: method })
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

        return () => {
            getFriendData()
            getCurrentUserFriends()
            getDesigns()
            getUserData()
            getCurrentUserData()
            getBlockedData()
        }
    }, [])

    return {
        friendData: friendData,
        currentUserFriendData: currentUserFriendData,
        designData: designData,

        userLocked: userLocked,
        blocked: blocked,
        messagingId: messagingId,
        profileUrl: profileUrl,

        currentUserMessagingId: currentUserMessagingId,
        currentUserName: currentUserName,
        currentUserEmail: currentUserEmail,
        currentUserMethod: currentUserMethod,
    }
}

export default useUserData