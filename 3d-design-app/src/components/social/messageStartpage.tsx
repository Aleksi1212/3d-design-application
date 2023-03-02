'use client';

import images from "../../functions/importImages";

import Image from "next/image";

import useUserData from "../../hooks/userDataHook";
import UserCardMessages from "./userCardMessages";

import { useState } from 'react'

function MessageStartPage({ user }: any) {
    const { userId, userName } = user || {}

    const [queryOption, setQueryOption] = useState<string>('Friends')
    const [search, setSearch] = useState<boolean>(false)
    const [searchedUsers, setSearchedUsers] = useState([])

    const userData = useUserData(userId, userId)

    let currentUserFriends: any = []
    userData.currentUserFriendData.map((friend: any) => {
        currentUserFriends.push(friend.friendId)
    })

    function searchUsers(userName: string) {
        if (search && queryOption === 'Friends') {
            const filteredSearch = userData.friendData.filter((friend: any) => friend.friendName.includes(userName))
            setSearchedUsers(filteredSearch)

        } else if (search && queryOption === 'Blocked Users') {
            const filteredSearch = userData.blockedUsers.filter((blockedUser: any) => blockedUser.username.includes(userName))
            setSearchedUsers(filteredSearch)
        }
    }

    return (
        <div className="flex flex-col h-full w-[80%]">
            <nav className="w-full h-[9%] bg-[#F6F7F9] flex justify-between items-center px-16">
                <div className="w-[25rem] h-full flex items-center justify-between text-xl">
                    <button className="w-[50%] h-[80%] rounded-md hover:bg-[#D9D9D9]" 
                        onClick={() => { setQueryOption('Friends'); setSearch(false) }}
                        style={queryOption === 'Friends' ? { backgroundColor: '#D3D3D3' } : {}}
                    >
                        Friends
                    </button>

                    <div className="bg-[#5D5D5D] opacity-60 w-[2px] h-[60%]"></div>

                    <button className="w-[50%] h-[80%] rounded-md hover:bg-[#D9D9D9]" 
                        onClick={() => { setQueryOption('Blocked Users'); setSearch(false) }}
                        style={queryOption === 'Blocked Users' ? { backgroundColor: '#D3D3D3' }: {}}
                    >
                        Blocked Users
                    </button>
                </div>

                <div className="w-[20rem] h-[2rem] flex items-center justify-between relative rounded-md shadow-md">
                    <Image src={images.search} alt="search" width={20} height={20} className="absolute pointer-events-none left-2" />
                    <input type="text" placeholder="Search" className="w-full bg-white h-full pl-8 rounded-md"
                        onClick={() => setSearch(true)}
                        onChange={(event: any) => searchUsers(event.target.value)}
                    />
                </div>
            </nav>

            <div className="w-full h-[91%] bg-[#D2D2D2] relative px-14 pt-5">
                <div className="w-full max-h-full h-full overflow-auto gap-y-[2px] flex flex-col" id="users">
                    <h1 className="mb-3 ml-5 opacity-75">
                        {
                            queryOption === 'Friends' ? `${queryOption} - ${userData.friendData.length}` :
                            queryOption === 'Blocked Users' ? `${queryOption} - ${userData.blockedUsers.length}` : null
                        }
                    </h1>

                    {
                        search && searchedUsers.length <= 0 ? (
                            <h1 className="w-full flex justify-center">No Users Found</h1>
                        ) : (
                            null
                        )
                    }

                    {
                        !search && queryOption === 'Friends' ? (
                            userData.friendData.map((friend: any) => {
                                return <UserCardMessages key={friend.friendId} user={{
                                    viewingUserId: userId,
                                    viewingUserName: userName,
                                    viewingUserMessagingId: userData.currentUserData.messagingId,

                                    userId: friend.friendId,
                                    userName: friend.friendName,
                                    messagingId: friend.messagingId,
                                    userState: 'friend'
                                }} />
                            })

                        ) : !search && queryOption === 'Blocked Users' ? (
                            userData.blockedUsers.map((blockedUser: any) => {
                                return <UserCardMessages key={blockedUser.userId} user={{
                                    viewingUserId: userId,
                                    viewingUserName: userName,
                                    vieviwngUserMessagingId: userData.currentUserData.messagingId,

                                    userId: blockedUser.userId,
                                    userName: blockedUser.username,
                                    messagingId: blockedUser.messagingId,
                                    userState: 'blocked'
                                }} />
                            })

                        ) : search && queryOption === 'Blocked Users' ? (
                            searchedUsers.map((blockedUser: any) => {
                                return <UserCardMessages key={blockedUser.userId} user={{
                                    viewingUserId: userId,
                                    viewingUserName: userName,
                                    viewingUserMessagingId: userData.currentUserData.messagingId,

                                    userId: blockedUser.userId,
                                    userName: blockedUser.username,
                                    messagingId: blockedUser.messagingId,
                                    userState: 'blocked'
                                }} />
                            })

                        ) : search && queryOption === 'Friends' ? (
                            searchedUsers.map((searchedFriend: any) => {
                                return <UserCardMessages key={searchedFriend.friendId} user={{
                                    viewingUserId: userId,
                                    viewingUserName: userName,
                                    viewingUserMessagingId: userData.currentUserData.messagingId,

                                    userId: searchedFriend.friendId,
                                    userName: searchedFriend.friendName,
                                    messagingId: searchedFriend.messagingId,
                                    userState: 'friend'
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