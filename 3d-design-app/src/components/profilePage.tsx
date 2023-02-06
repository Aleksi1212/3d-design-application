'use client';

import Image from "next/image";
import Link from "next/link";

import { db } from "../datalayer/config";
import { collection, collectionGroup, onSnapshot, query, where } from "firebase/firestore";
import { updateFriendOrUser } from "../datalayer/querys";

import { useEffect, useState } from "react";
import images  from '../hooks/importImages'

import SearchUsers from "./searchUsers";
import UserCard from "./userCard";

function ProfilePage({ user }: any) {
    const { userId, userName, currentUser } = user || {}

    const [friendData, setFriendData] = useState([])
    const [currentUserFriendData, setCurrentUserFriendData] = useState([])

    const [userData, setUserData] = useState({ state: null })
    const [blocked, setBlocked] = useState(false)
    
    useEffect(() => {
        const friendQue = query(collectionGroup(db, 'friends'), where('user', '==', userId))
        const getFriendData = onSnapshot(friendQue, (querySnapshot) => {
            let friends: any = []

            querySnapshot.forEach((friend) => {
                friends.push(friend.data().friendData)
            })
            
            setFriendData(friends)
        })

        const currentUserFriendQue = query(collectionGroup(db, 'friends'), where('user', '==', currentUser.userId))
        const getCurrendUserFriends = onSnapshot(currentUserFriendQue, (querySnapshot) => {
            let currentUserFriends: any = []

            querySnapshot.forEach((friend) => {
                currentUserFriends.push(friend.data().friendData)
            })

            setCurrentUserFriendData(currentUserFriends)
        })

        
        const userQue = query(collection(db, 'data'), where('userId', '==', userId))
        const getUserData = onSnapshot(userQue, (querySnapshot) => {
            let userState: any = { state: Boolean }

            querySnapshot.forEach((user) => {
                userState.state = user.data().locked
            })
            
            setUserData(userState)
        })

        const blockedQue = query(collectionGroup(db, 'blockedUsers'), where('blockedusers', 'array-contains', userId), where('user', '==', currentUser.userId))
        const getBlockedData = onSnapshot(blockedQue, (querySnapshot) => {
            let blockedData: any = []

            querySnapshot.forEach((user) => {
                blockedData.push(user.data())
            })

            blockedData.length > 0 ? setBlocked(true) : setBlocked(false)
        })

        return () => {
            getFriendData()
            getCurrendUserFriends()
            getUserData()
            getBlockedData()
        }
    }, [])

    let currentUserFriends: any = []
    currentUserFriendData.map((friend: any) => {
        currentUserFriends.push(friend.friendId)
    })

    const actions = userId === currentUser.userId ? [
        userData.state ? {
            image: images.unlockProfile, color: '#5D5D5D', message: 'Unlock', key: 'unlock', action: updateFriendOrUser, params: {
                userId: currentUser.userId, action: 'update', 
            }
        } : {
            image: images.lockProfile, color: '#5D5D5D', message: 'Lock', key: 'lock', action: updateFriendOrUser
        },

        { image: images.editProfile, color: '#5D5D5D', message: 'Edit', key: 'edit' },
        { image: images.signOut, color: '#FA5252', message: 'Sign Out', key: 'signOut' }
    ] : !blocked ? [
        { image: images.message, color: '#5D5D5D', message: 'Message', key: 'message'},
        { image: images.addFriend, color: '#40C057', message: 'Add', key: 'add' },
        { image: images.block, color: '#FA5252', message: 'Block', key: 'block' }
    ] : [
        { image: images.block, color: '#FA5252', message: 'Unblock', key: 'unblock' }
    ]

    
    return (
        <section className="bg-[#F6F7F9] w-full h-[100vh] flex justify-center items-center gap-x-6">
            <div className="absolute left-20 top-20  flex flex-col items-center gap-y-1">
                <Link href={`/dashboard/${currentUser.userId}`} className="flex w-[2.5rem] h-[2.5rem]" id="dashLink">
                    <div className="flex flex-col h-full w-[50%] gap-y-[.1rem] ">
                        <div className="dashIcon h-[70%] w-[95%]" id="icon"></div>
                        <div className="dashIcon h-[30%] w-[95%]" id="icon"></div>
                    </div>

                    <div className="flex flex-col h-full w-[50%] gap-y-[.1rem] items-end ">
                        <div className="dashIcon h-[30%] w-[95%]" id="icon"></div>
                        <div className="dashIcon h-[70%] w-[95%]" id="icon"></div>
                    </div>
                </Link>

                <div className="w-full text-white bg-[#5D5D5D] rounded-md text-sm px-2 transition-all origin-top scale-0 duration-200" id="dashMessage">Dashboard</div>
            </div>

            <div className="w-[40rem] h-[50rem] bg-white shadow-lg flex flex-col items-center justify-evenly rounded-xl ">
                <div className="w-full flex items-center justify-between pl-20 pr-20">
                    <div className="w-[12rem] h-[12rem] shadow-lg bg-gray-100 rounded-full flex justify-center items-center">
                        <Image src={images.userProfile} alt="profileImage" />
                    </div>

                    <div className="flex flex-col justify-between gap-y-4 items-center">
                        <h1 className="text-3xl">{userName}</h1>
                        <div className="flex justify-center relative gap-x-5" style={{ width: 'calc(100% + 20px)' }}>
                            {
                                actions.map((action: any) => {
                                    return (
                                        <button id="profileAction" key={action.key}
                                        onClick={() => {
                                            if (action.key === 'lock') {
                                                updateFriendOrUser(currentUser.userId, 'update', null, null, null, 'user', true, null)
                                            } else if (action.key === 'unlock') {
                                                updateFriendOrUser(currentUser.userId, 'update', null, null, null, 'user', false, null)
                                            }
                                        }}>
                                            
                                            <Image src={action.image} alt="actionImage" width={25} height={25} />
                                            <div style={{ backgroundColor: action.color, marginRight: action.key === 'signOut' ? '.25rem' : '0' }}
                                                id="profileBar"></div>

                                            <div className="actionBox">{action.message}</div>
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <hr className="w-[80%] h-[2.5px] bg-[#5D5D5D] opacity-40" />

                <div className="w-full h-[30rem] flex flex-col items-center pt-2">
                    {
                        !blocked ? (
                            <>
                                <div className="w-full flex justify-evenly text-[1.5rem]">
                                    <button className="flex flex-col items-center" id="otherAction">
                                        <h1>Friends</h1>
                                        <div id="otherBar" className="bg-[#5D5D5D] opacity-75"></div>
                                    </button>

                                    <button className="flex flex-col items-center" id="otherAction">
                                        <h1>Designs</h1>
                                        <div id="otherBar" className="bg-[#5D5D5D] opacity-75"></div>
                                    </button>
                                </div>

                                <div className="w-[110%] max-h-full h-full ml-[11.5rem] flex overflow-auto flex-col mt-2 pt-6" id="friendContainer">
                                    {
                                        friendData.map((friendCard: any) => {
                                            return <UserCard key={friendCard.friendId} 
                                            user={{ 
                                                viewingUser: currentUser.userId, 
                                                usersId: friendCard.friendId, 
                                                usersName: friendCard.friendName, 
                                                messagingId: friendCard.messagingId, 
                                                action: friendCard.friendId === currentUser.userId ? { message: 'Edit Profile', color: '#40C057', action: '' } :  
                                                currentUserFriends.includes(friendCard.friendId) ? { message: 'Remove Friend', color: '#FA5252', action: 'remove' } : { message: 'Add Friend', color: '#40C057', action: 'add' }
                                            }} />
                                        })
                                    }
                                </div>
                            </>
                        ) : (
                            <h1 className="text-xl">User blocked</h1>
                        )
                    }
                </div>
            </div>

            <SearchUsers viewer={{ userId: currentUser.userId }} />
        </section>
    )
}

export default ProfilePage