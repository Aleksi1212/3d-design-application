'use client';

import Image, { StaticImageData } from 'next/image'
import Link from 'next/link';
import images from '../../../functions/importImages';

import { useReducer, Reducer, useState, useEffect } from 'react'

import useUserData from '../../../hooks/userDataHook';
import useProfileImage from '../../../hooks/profileImagehook';

import messageUser from '../../../datalayer/firestoreFunctions/messages/sendMessage';
import useGetMessages from '../../../datalayer/firestoreFunctions/messages/getMessages';

import ProfileBox from '../../styledComponents/profileBox';
import Message from './messageContainer';

interface alertType {
    message: string
    image: StaticImageData
    top: string
}

interface messageType {
    message: string
    messageDate: string
    messageId: string
    messageStatus: string
    messageType: string
    show: boolean
}

function MessageBox({ user }: any) {
    const { userMessagingId, userName, viewingUserName, viewingUserMessagingId, viewingUserId } = user || {}
    
    const messagesData = useGetMessages(userMessagingId, viewingUserId)
    const [message, setMessage] = useState<string>('')
    const [alert, setAlert] = useState<alertType>({ message: '', image: images.error, top: '-2.5rem' })

    const profileUrl = useUserData({ type: 'messagingId', id: userMessagingId })
    const recieverProfileImage = useProfileImage(profileUrl.profileUrl)
    const senderProfileImage = useProfileImage(messagesData.senderUserData.profileUrl)
    
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

    async function sendMessage(event: any, message: string) {
        const allLetters = /^[^a-zA-Z]*$/

        if (event.key === 'Enter' && !event.shiftKey && !allLetters.test(message)) {
            event.preventDefault()

            const awaitMessage = await messageUser(viewingUserMessagingId, userMessagingId, viewingUserId, '', viewingUserName, userName, message, 'message')

            if (awaitMessage?.type === 'success') {
                setMessage('')
            } else {
                setAlert({ message: awaitMessage?.message, image: awaitMessage?.image, top: '6rem' })
            }
        }
    }


    useEffect(() => {
        if (alert.top !== '2.5rem') {
            setTimeout(() => {
                setAlert({ message: alert.message, image: alert.image, top: '-2.5rem' })
            }, 2500)
        }
    }, [alert])


    return (
        <div className="h-full w-[80%] flex flex-col">
            <div className="absolute left-[50%] px-4 h-[2rem] bg-[#3D3D3D] rounded-lg pl-2 flex items-center text-white transition-all duration-500"
                style={{ top: alert.top }}>
                <Image src={alert?.image} alt="image" />
                <h1 className="px-2">|</h1>
                <h1>{alert.message}</h1>
            </div>

            <nav className="w-ful h-[9%] bg-[#F6F7F9] flex justify-between items-center pl-5 pr-20">
                <div className="flex gap-x-4">
                    <ProfileBox styles={{
                        dimensions: '4rem',
                        backgroundColor: 'white',
                        bold: false,

                        userName: userName,
                        info: userMessagingId,
                        profileImage: recieverProfileImage,
                        profileUrl: profileUrl.profileUrl
                    }} />
                </div>
                
                <Link href={`/messages/${viewingUserId}=${viewingUserName}_${viewingUserMessagingId}`} className="w-[10rem] h-[80%] flex justify-center items-center rounded-md hover:bg-[#D9D9D9] bg-white shadow-md">
                    Friend List
                </Link>
            </nav>

            <div className="w-full h-[91%] bg-[#D2D2D2] flex flex-col pr-14 pb-16 justify-end">
                <div className="w-full flex flex-col max-h-[48rem] overflow-auto pb-5 pl-14" id="messagesContainer">
                    {
                        messagesData.messages.map((message: messageType) => {
                            if (message.messageType === 'message' && (message.messageStatus === 'sent' || message.messageStatus === 'recieved')) {
                                return <Message key={message.messageId} messageData={{
                                    ...message,
                                    sentFromName: message.messageStatus === 'sent' ? viewingUserName : userName,
                                    profileData: message.messageStatus === 'sent' ? {
                                        profileImage: senderProfileImage.profileImage, errors: senderProfileImage.errors
                                    } : {
                                        profileImage: recieverProfileImage.profileImage, errors: recieverProfileImage.errors
                                    },
                                    profileUrl: message.messageStatus === 'sent' ? messagesData.senderUserData.profileUrl : profileUrl.profileUrl,
                                    currentUserName: viewingUserName,
                                    recieverMessagingId: userMessagingId,
                                    senderMessagingId: viewingUserMessagingId
                                }} />
                            }
                        })
                    }
                </div>
                
                <div className="pl-14">
                    <div className="w-full bg-[#F6F7F9] h-[3rem] rounded-xl shadow-lg relative flex items-center">
                        <div className='w-full h-[3rem]'>
                            <textarea className="bg-[#F6F7F9] w-full rounded-xl outline-none pl-12 pr-20 py-3 resize-none flex" placeholder={`Message ${userName}`}
                                rows={rows}
                                value={message}
                                
                                onInput={changeRowCount}
                                onChange={(event: any) => setMessage(event.target.value)}
                                onKeyDown={(event: any) => sendMessage(event, message)}
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
        </div>
    )
}

export default MessageBox