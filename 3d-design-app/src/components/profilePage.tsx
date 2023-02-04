'use client';

import Image from "next/image";

import { db } from "../datalayer/config";
import { collection, collectionGroup, onSnapshot, query, where } from "firebase/firestore";
import { updateFriendOrUser } from "../datalayer/querys";

import { useEffect, useState } from "react";
import useImages  from '../hooks/importImages'

import SearchUsers from "./searchUsers";
import UserCard from "./userCard";

function ProfilePage({ user }: any) {
    const { userId, userName, currentUser } = user || {}

    const images = useImages(require.context('../images', false, /\.(png|jpe?g|svg)$/))

    const [friendData, setFriendData] = useState([])
    const [userData, setUserData] = useState({ state: null })
    
    useEffect(() => {
        const friendQue = query(collectionGroup(db, 'friends'), where('user', '==', userId))
        
        const getFriendData = onSnapshot(friendQue, (querySnapshot) => {
            let friends: any = []
            querySnapshot.forEach((friend) => {
                friends.push(friend.data().friendData)
            })
            
            setFriendData(friends)
        })
        
        const userQue = query(collection(db, 'data'), where('userId', '==', userId))
        
        const getUserData = onSnapshot(userQue, (querySnapshot) => {
            let userState: any = { state: Boolean }
            querySnapshot.forEach((user) => {
                userState.state = user.data().locked
            })
            
            setUserData(userState)
        })
        
        return () => {
            getFriendData()
            getUserData()
        }
    }, [])

    const actions = userId === currentUser.userId ? [
        userData.state ? {
            image: images['unlockProfile.png'], color: '#5D5D5D', message: 'Unlock', key: 'unlock'
        } : {
            image: images['lockProfile.png'], color: '#5D5D5D', message: 'Lock', key: 'lock'
        },

        { image: images['editProfile.png'], color: '#5D5D5D', message: 'Edit', key: 'edit' },
        { image: images['signOut.png'], color: '#FA5252', message: 'Sign Out', key: 'signOut' }
    ] : [
        { image: images['message.png'], color: '#5D5D5D', message: 'Message', key: 'message'},
        { image: images['addFriend.png'], color: '#40C057', message: 'Add', key: 'add' },
        { image: images['block.png'], color: '#FA5252', message: 'Block', key: 'block' }
    ]
    
    return (
        <section className="bg-[#F6F7F9] w-full h-[100vh] flex justify-center items-center gap-x-6">
            <div className="w-[40rem] h-[50rem] bg-white shadow-lg flex flex-col items-center justify-evenly rounded-xl ">
                <div className="w-full flex items-center justify-between pl-20 pr-20">
                    <div className="w-[12rem] h-[12rem] shadow-lg bg-gray-100 rounded-full flex justify-center items-center">
                        <Image src={images['userProfile.png']} alt="profileImage" />
                    </div>

                    <div className="flex flex-col justify-between gap-y-4 items-center">
                        <h1 className="text-3xl">{userName}</h1>
                        <div className="flex justify-between relative" style={{ width: 'calc(100% + 20px)' }}>
                            {
                                actions.map((action: any) => {
                                    return (
                                        <button id="profileAction" key={action.key}
                                        onClick={() => {
                                            if (action.key === 'lock') {
                                                updateFriendOrUser(userId, 'update', null, null, null, 'user', true)
                                            } else if (action.key === 'unlock') {
                                                updateFriendOrUser(userId, 'update', null, null, null, 'user', false)
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
                                    viewingUser: userId, 
                                    usersId: friendCard.friendId, 
                                    usersName: friendCard.friendName, 
                                    messagingId: friendCard.messagingId, 
                                    action: { message: 'Remove Friend', color: '#FA5252', action: 'remove' } 
                                }} />
                            })
                        }
                    </div>
                </div>
            </div>

            <SearchUsers viewer={{ userId: currentUser.userId }} />
        </section>
    )
}

export default ProfilePage