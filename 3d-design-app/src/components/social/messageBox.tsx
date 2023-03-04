'use client';

import Image from 'next/image'
import images from '../../functions/importImages';

import { useReducer, Reducer, useState } from 'react'

import useUserData from '../../hooks/userDataHook';
import useProfileImage from '../../hooks/profileImagehook';
import useRealtimeChanges from '../../hooks/realtimeChangeshook';

import messageUser from '../../datalayer/firestoreFunctions/messageUser';

function MessageBox({ user }: any) {
    const { userMessagingId, userName, viewingUserName, viewingUserMessagingId } = user || {}
    
    const profileUrl = useUserData({ type: 'messagingId', id: userMessagingId })
    const profileImage = useProfileImage(profileUrl.profileUrl)

    const messagesData = useRealtimeChanges('', '', userMessagingId)
    const [message, setMessage] = useState<string>('')

    const [rows, setRows] = useReducer<Reducer<number, number>>((prev, next) => {
        if (next < 3) {
            return next
        }
        return 3
    }, 1)

    function changeRowCount(event: any) {
        const textarea = event.target;
        const newRows = textarea.value.split("\n").length;

        setRows(newRows)
    }

    async function handleSubmit(event: any, message: string) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()

            const sendMessage = await messageUser(viewingUserMessagingId, userMessagingId, viewingUserName, userName, message, 'message')

            if (sendMessage?.type === 'success') {
                setMessage('success')
            } else {
                setMessage('error')
            }
        }
    }

    return (
        <div className="h-full w-[80%] flex flex-col">
            <nav className="w-ful h-[9%] bg-[#F6F7F9] flex items-center pl-5">
                <div className="flex gap-x-5 items-center">
                    <div className="bg-white w-16 h-16 rounded-full shadow-md flex justify-center items-center overflow-hidden">
                        {
                            profileImage.errors.includes(profileImage.profileImage) || profileImage.profileImage.length <= 0 ? (
                                <h1>{profileImage.profileImage}</h1>
                            ) : (
                                <Image src={profileImage.profileImage} alt="profileImage" width={500} height={500}
                                style={{
                                    objectFit: 'cover',
                                    width: profileUrl.profileUrl === 'profileImages/defaultProfile.png' || profileUrl.profileUrl === '' ? '40%' : '100%',
                                    height: profileUrl.profileUrl === 'profileImages/defaultProfile.png' || profileUrl.profileUrl === '' ? '40%' : '100%',
                                }} />
                            )
                        }
                    </div>

                    <div className="flex flex-col justify-center">
                        <h1 className="text-lg">{userName}</h1>
                        <p className="text-xs opacity-90">{userMessagingId}</p>
                    </div>
                </div>
            </nav>

            <div className="w-full h-[91%] bg-[#D2D2D2] flex flex-col px-14">
                <div className="w-full h-[48rem] max-h-[48rem] overflow-auto">

                </div>

                <div className="w-full bg-[#F6F7F9] h-[3rem] rounded-xl shadow-lg relative flex items-center">
                    <div className='w-full h-[3rem]'>
                        <textarea className="bg-[#F6F7F9] w-full rounded-xl outline-none pl-12 pr-20 py-3 resize-none flex" placeholder={`Message ${userName}`}
                            rows={rows}
                            value={message}
                            
                            onInput={changeRowCount}
                            onChange={(event: any) => setMessage(event.target.value)}
                            onKeyDown={(event: any) => handleSubmit(event, message)}
                        ></textarea>
                    </div>

                    <Image src={images.addImage} alt="addImage" className="absolute left-3" width={25} />

                    <div className="flex absolute gap-x-2 right-3">
                        <Image src={images.addDesign} alt="design" width={25} />
                        <Image src={images.happy1} alt="emoji" width={25} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageBox