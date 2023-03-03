'use client';

import Link from 'next/link'
import Image from 'next/image'

import UserCard from './userCardProfile';

import { useState, useEffect, SetStateAction } from 'react';
import useRealtimeChanges from '../../hooks/realtimeChangeshook';

import { db } from '../../datalayer/config';
import { collectionGroup, query, where, onSnapshot } from 'firebase/firestore';

import images from '../../functions/importImages';
import acceptFriendRequest from '../../datalayer/firestoreFunctions/acceptFriendRequest';

function Notifications({ user }: any) {
    const { currentUserId, userName } = user || {}

    const friendRequests = useRealtimeChanges(currentUserId, currentUserId, '')

    // const [pendingFriends, setPendingFriends] = useState([])

    // useEffect(() => {
    //     const pendingFriendsQuery = query(collectionGroup(db, 'friendRequests'), where('sentTo', '==', currentUserId))

    //     const getPendingFriends = onSnapshot(pendingFriendsQuery, (querySnapshot) => {
    //         let pendingFriends: SetStateAction<any> = []

    //         querySnapshot.forEach((pendingFriend) => {
    //             pendingFriends.push(pendingFriend.data().requestData)
    //         })

    //         setPendingFriends(pendingFriends)
    //     })

    //     return () => getPendingFriends()
    // }, [])

    return (
        <section className="w-full h-[100vh] bg-[#F6F7F9] flex justify-center items-center">
            <div className='absolute left-20 top-20  flex justify-between w-[10rem]'>
                <div className="flex flex-col items-center gap-y-1">
                    <Link href={`/dashboard/${currentUserId}`} className="flex w-[2.5rem] h-[2.5rem]" id="dashLink">
                        <div className="flex flex-col h-full w-[50%] gap-y-[.1rem] ">
                            <div className="dashIcon h-[70%] w-[95%]" id="icon"></div>
                            <div className="dashIcon h-[30%] w-[95%]" id="icon"></div>
                        </div>

                        <div className="flex flex-col h-full w-[50%] gap-y-[.1rem] items-end ">
                            <div className="dashIcon h-[30%] w-[95%]" id="icon"></div>
                            <div className="dashIcon h-[70%] w-[95%]" id="icon"></div>
                        </div>
                    </Link>
                    <div className="w-full text-white bg-[#5D5D5D] rounded-md text-sm px-2 transition-all origin-top scale-0 duration-300" id="dashMessage">Dashboard</div>
                </div>

                <div className='relative flex flex-col justify-end'>

                    <div className='rounded-full w-[3rem] h-[3rem] absolute -top-[.4rem] left-[.4rem]' id='profileIcon'>
                        <Link href={`/profile/${currentUserId}=${userName}`} className="w-full h-full flex justify-center items-center">
                            <Image src={images.userProfile} alt="profile" width={30}height={30} />
                        </Link>
                    </div>

                    <svg width="60" height="45" className='-mt-1 ml-[.3rem] transition-all duration-[400ms]' id='profileSvg'>
                        <circle cx="26" cy="21" r="20" fill="none" stroke="#4D4D4D" strokeWidth="2"/>
                    </svg>

                    <div className='w-full text-white bg-[#5D5D5D] rounded-md text-sm transition-all origin-top scale-0 duration-200 flex justify-center' id='profileMessage'>Profile</div>
                </div>
            </div>

            <div className='w-[40rem] h-[50rem] bg-white shadow-lg rounded-xl pt-10 flex flex-col items-center'>
                <div className='w-full  flex justify-evenly items-center text-xl mb-7'>
                    <button className='flex flex-col items-center' id='otherAction'>
                        <h1>Friend Requests</h1>
                        <div className='bg-[#5D5D5D] opacity-75' id='otherBar'></div>
                    </button>

                    <button className='flex flex-col items-center' id='otherAction'>
                        <h1>Messages</h1>
                        <div className='bg-[#5D5D5D] opacity-75' id='otherBar'></div>
                    </button>
                </div>

                <hr className='w-[80%] h-[2.5px] bg-[#5D5D5D] opacity-40' />

                <div className=' w-[110%] h-full max-h-full overflow-auto flex flex-col pt-7 ml-[11.9rem]'>
                    {
                        friendRequests.pendingFriends.map((pendingFriend: any) => {
                            return <UserCard key={pendingFriend.requestFromId} 
                            user={{
                                viewingUser: currentUserId,
                                usersId: pendingFriend.requestFromId,
                                usersName: pendingFriend.requestFromName,
                                messagingId: pendingFriend.messagingId,

                                initialAction: {
                                    message: 'Accept',
                                    image: images.acceptRequest,
                                    action: acceptFriendRequest,
                                },

                                secondaryAction: { message: 'Decline Request', color: '#FA5252', action: '' }
                            }} />
                        })
                    }
                </div>
            </div>

        </section>
    )
}

export default Notifications