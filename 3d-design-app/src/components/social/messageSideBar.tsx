'use client';

import images from "../../functions/importImages";

import Image from 'next/image'
import Link from "next/link";

import useUserData from "../../hooks/userDataHook";
import useProfileImage from "../../hooks/profileImagehook";

import { useEffect, useState } from "react";

import { db } from "../../datalayer/config";
import { query, where, collectionGroup, onSnapshot } from "firebase/firestore";

import ProfileBox from "../styledComponents/profileBox";

interface messagesWithUserTypes {
    recievedBy: string
    sentFrom: string
    type: string
    userId: string
}

function MessageSideBar({ user }: any) {
    const { userId } = user || {}
    
    const userData = useUserData({ type: 'userId', id: userId })
    const profileImage = useProfileImage(userData.profileUrl)

    const [messagesWith, setMessagesWith] = useState<Array<messagesWithUserTypes>>([])

    useEffect(() => {
        const getUsers_UserHasMessagesWithQuery = query(collectionGroup(db, 'messages'), where('userId', '==', userId), where('type', '==', 'sender'))

        const getUsers_UserHasMessagesWith = onSnapshot(getUsers_UserHasMessagesWithQuery, (querySnapshot) => {
            let messagesWith: Array<any> = []

            querySnapshot.forEach((messageWith) => {
                messagesWith.push(messageWith.data())
            })

            const filterMessagesWith = messagesWith.map((obj: any) => {
                const { ['messagesData']: _, ...rest } = obj

                return rest
            })

            setMessagesWith(filterMessagesWith)
        })

        return () => getUsers_UserHasMessagesWith()
    }, [])

    return (
        <div className="h-full w-[20%] bg-white flex flex-col">
            <div className="w-full h-[11%] border-b-2 border-[#D2D2D2] flex justify-center items-center">
                <div className="w-[90%] h-[2rem] flex justify-between items-center shadow-md rounded-md">
                    <Image src={images.search} alt="search" width={20} height={20} className="absolute pointer-events-none left-6" />
                    <input type="text" placeholder="Find or start a conversation" className="w-full h-[2rem] bg-[#F6F7F9] rounded-md pl-8" />
                </div>
            </div>

            <div className="h-full w-full max-h-full overflow-auto flex flex-col px-3 py-4 gap-y-[2px]">
                <h1 className="ml-2 text-sm">{`Messages - ${messagesWith.length}`}</h1>

                {
                    messagesWith.map((messageWith: messagesWithUserTypes) => {
                        return <MessageWithBox key={messageWith.recievedBy} messageWithUser={{
                            messagingId: messageWith.recievedBy,
                            currentUserId: messageWith.userId,
                            currentUserName: userData.userName,
                            currentUserMessagingId: messageWith.sentFrom
                        }} />
                    })
                }
            </div>

            <div className="w-full h-[9%] border-t-2 border-[#D2D2D2] flex justify-between items-center px-4">
                <div className="flex gap-x-4">
                    <ProfileBox styles={{
                        dimensions: '3.5rem',
                        backgroundColor: '#F6F7F9',
                        shadow: 'md',
                        bold: false,

                        userName: userData.userName,
                        info: userData.messagingId,
                        profileImage: profileImage,
                        profileUrl: userData.profileUrl
                    }} />
                </div>

                <div className="flex gap-x-4 relative">
                    <Link href={`/dashboard/${userId}`} id="dashboard">
                        <Image src={images.dashboard} alt="dashboard" width={30} />
                    </Link>

                    <button id="settings">
                        <Image src={images.settings} alt="settings" width={30} />
                    </button>

                    <div className="profileRoute right-[1.2rem] top-[-1.75rem] text-sm h-[1.5rem] w-[5rem]" id="dashboardMessage">Dashboard</div>
                    <div className="profileRoute right-[-1rem] top-[-1.75rem] text-sm h-[1.5rem]" id="settingsMessage">Settings</div>
                </div>
            </div>
        </div>
    )
}

interface userData {
    messagingId: string
    currentUserId: string
    currentUserName: string
    currentUserMessagingId: string
}

interface messageWithType {
    messageWithUser: userData
}

function MessageWithBox({ messageWithUser }: messageWithType) {
    const { messagingId, currentUserId, currentUserName, currentUserMessagingId } = messageWithUser || {}

    const userData = useUserData({ type: 'messagingId', id: messagingId })
    const profileImage = useProfileImage(userData.profileUrl)

    return (
        <div className="w-full h-[4rem] flex rounded-lg justify-between items-center px-2 mt-4 hover:bg-[#F2F3F9] relative">
            <div className="absolute w-[95%] h-[2px] bg-[#8D8D8D] top-[-2px]"></div>

            <Link href={`/messages/${currentUserId}=${currentUserName}_${currentUserMessagingId}/${messagingId}=${userData.userName}`} className="flex gap-x-4 w-[90%]">
                <ProfileBox styles={{
                    dimensions: '3.5rem',
                    backgroundColor: '#F6F7F9',
                    shadow: 'md',
                    bold: false,

                    userName: userData.userName,
                    info: messagingId,
                    profileImage: profileImage,
                    profileUrl: userData.profileUrl
                }} />
            </Link>

            <Image src={images.close} alt="close" />
        </div>
    )
}

export default MessageSideBar