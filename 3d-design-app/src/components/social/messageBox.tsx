'use client';

import Image, { StaticImageData } from 'next/image'
import images from '../../functions/importImages';

import { useReducer, Reducer, useState, useEffect } from 'react'

import useUserData from '../../hooks/userDataHook';
import useProfileImage from '../../hooks/profileImagehook';

import { messageUser, useGetMessages } from '../../datalayer/firestoreFunctions/messageUser';

import ProfileBox from '../styledComponents/profileBox';

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

interface profileTypes {
    profileImage: any
    errors: Array<string>
}

interface messageBoxtype {
    message: string
    messageDate: string
    messageId: string
    messageStatus: string
    messageType: string
    sentFromName: string
    show: boolean
    profileData: profileTypes
    profileUrl: string
}

interface messageDataTypes {
    messageData: messageBoxtype
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
                setAlert({ ...alert, top: '-2.5rem' })
            }, 2500)
        }
    }, [alert])

    return (
        <div className="h-full w-[80%] flex flex-col">
            <div className="absolute left-[50%] w-[15rem] h-[2rem] bg-[#3D3D3D] rounded-lg pl-2 flex items-center text-white transition-all duration-500"
                style={{ top: alert.top }}>
                <Image src={alert?.image} alt="image" />
                <h1 className="px-2">|</h1>
                <h1>{alert.message}</h1>
            </div>

            <nav className="w-ful h-[9%] bg-[#F6F7F9] flex items-center pl-5">
                <div className="flex gap-x-4">
                    <ProfileBox styles={{
                        dimensions: '4rem',
                        backgroundColor: 'white',
                        shadow: 'md',
                        bold: false,

                        userName: userName,
                        info: userMessagingId,
                        profileImage: recieverProfileImage,
                        profileUrl: profileUrl.profileUrl
                    }} />
                </div>
            </nav>

            <div className="w-full h-[91%] bg-[#D2D2D2] flex flex-col px-14 pb-16 justify-end">
                <div className="w-full flex flex-col max-h-[48rem] overflow-auto pb-5" id="messagesContainer">
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
                                }} />
                            }
                        })
                    }
                </div>

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
    )
}

function Message({ messageData }: messageDataTypes) {
    const { message, messageDate, messageId, messageStatus, messageType, sentFromName, profileData, profileUrl, show } = messageData || {}

    if (!show) {
        return (
            <div className="flex flex-col w-max -mt-6 mb-6">
                <div className="ml-14 max-w-[40rem] text-lg flex flex-wrap">
                    {message}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-max my-6">
            <div className="flex gap-x-2">
                <ProfileBox styles={{
                    dimensions: '3rem',
                    backgroundColor: 'white',
                    shadow: 'none',
                    bold: true,

                    userName: sentFromName,
                    info: messageDate,
                    profileImage: profileData,
                    profileUrl: profileUrl
                }} />
            </div>

            <div className="ml-14 max-w-[40rem] text-lg flex flex-wrap">
                {message}
            </div>
        </div>
    )
    
    
}

export default MessageBox