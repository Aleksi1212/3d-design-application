'use client';

import images from "../../functions/importImages";

import Image from "next/image";

import useUserData from "../../hooks/userDataHook";
import UserCardMessages from "./userCardMessages";

import { useState } from 'react'

function MessageStartPage({ user }: any) {
    const { userId } = user || {}

    const [queryOption, setQueryOption] = useState<string>('')
    const userData = useUserData(userId, userId)

    let currentUserFriends: any = []
    userData.currentUserFriendData.map((friend: any) => {
        currentUserFriends.push(friend.friendId)
    })

    return (
        <div className="flex flex-col h-full w-[80%]">
            <nav className="w-full h-[9%] bg-[#F6F7F9] flex justify-between items-center px-16">
                <div className="w-[25rem] h-full flex items-center justify-between text-xl">
                    <button className="w-[50%] h-[80%] rounded-md focus:bg-[#D3D3D3] hover:bg-[#D9D9D9]" onClick={() => setQueryOption('Friends')}>Friends</button>
                    <button className="w-[50%] h-[80%] rounded-md focus:bg-[#D3D3D3] hover:bg-[#D9D9D9]" onClick={() => setQueryOption('Blocked Users')}>Blocked Users</button>
                </div>

                <div className="w-[20rem] h-[2rem] flex items-center justify-between relative rounded-md shadow-md">
                    <Image src={images.search} alt="search" width={20} height={20} className="absolute pointer-events-none left-2" />
                    <input type="text" placeholder="Search" className="w-full bg-white h-full pl-8 rounded-md" />
                </div>
            </nav>

            <div className="w-full h-[91%] bg-[#D2D2D2] relative px-14 pt-5">
                <div className="w-full max-h-full h-full overflow-auto gap-y-[2px] flex flex-col" id="users">
                    <h1 className="mb-3 ml-5 opacity-75">{queryOption === 'Friends' ? `${queryOption} - ${userData.friendData.length}` : null}</h1>

                    {
                        queryOption === 'Friends' ? (
                            userData.friendData.map((friend: any) => {
                                return <UserCardMessages key={friend.friendId} user={{
                                    userId: friend.friendId,
                                    userName: friend.friendName,
                                    messagingId: friend.messagingId
                                }} />
                            })
                        ) : (
                            null
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default MessageStartPage