'use client';

import Link from 'next/link'
import Image from 'next/image'

import useUserData from "../../../hooks/userDataHook";
import useProfileImage from "../../../hooks/profileImagehook";

import ProfileBox from '../../styledComponents/profileBox';
import images from '../../../functions/importImages';

import changeHistoryVisibility from '../../../datalayer/firestoreFunctions/messages/changeHistoryVisibility';

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
                    bold: false,

                    userName: userData.userName,
                    info: messagingId,
                    profileImage: profileImage,
                    profileUrl: userData.profileUrl
                }} />
            </Link>
            
            <button className="hover:brightness-150 active:scale-90" onClick={async () => {
                const test = await changeHistoryVisibility(currentUserId, messagingId)
                console.log(test)
            }}>
                <Image src={images.close} alt="close" />
            </button>
        </div>
    )
}

export default MessageWithBox