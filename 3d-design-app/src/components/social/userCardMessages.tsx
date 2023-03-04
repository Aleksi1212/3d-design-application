'use client';

import Image from "next/image";
import Link from 'next/link'

import images from "../../functions/importImages";

import { useEffect, useState, useReducer } from 'react'
import { useRouter } from "next/navigation";

import useProfileImage from "../../hooks/profileImagehook";

import { db } from "../../datalayer/config";
import { collection, where, onSnapshot, query } from "firebase/firestore";

import updateFriendOrUser from "../../datalayer/firestoreFunctions/updateFriendOrUser";
import messageUser from "../../datalayer/firestoreFunctions/messageUser";

interface hoverState {
    overUser: boolean
    clicked: boolean
}

interface payloadType {
    type: string
    payload: hoverState
}

function UserCardMessages({ user }: any) {
    const { viewingUserId, viewingUserName, viewingUserMessagingId, userId, userName, messagingId, userState } = user || {}

    const router = useRouter()

    const [profileUrl, setProfileUrl] = useState<Array<string>>([''])
    const profileImage = useProfileImage(profileUrl[0])

    function reducer(state: any, action: payloadType) {
        if (action.type === 'friend') {
            return {
                ...action.payload
            }
        } else {
            return {
                overUser: false,
                clicked: false
            }
        }
    }

    const [hover, setHover] = useReducer(reducer, { overUser: false, clicked: false } as hoverState)

    useEffect(() => {
        const profileImageQuery = query(collection(db, 'data'), where('userId', '==', userId))

        const getProfileImageUrl = onSnapshot(profileImageQuery, (querySnapshot) => {
            let profileImageUrl: Array<string> = []
            querySnapshot.forEach((userData) => {
                profileImageUrl.push(userData.data().profileUrl)
            })

            setProfileUrl(profileImageUrl)
        })

        return () => getProfileImageUrl()
    }, [])


    return (
        <div className="w-[90%] h-[5rem] rounded-md px-5 flex justify-between items-center hover:bg-[#F2F3F9] relative"
            onMouseEnter={() => setHover({ payload: { overUser: true, clicked: hover.clicked }, type: userState })}
            onMouseLeave={() => setHover({ payload: { overUser: false, clicked: false }, type: userState })}
        >
            <div className="absolute w-[97%] h-[2px] bg-[#8D8D8D] top-[-2px]"></div>

            <div className="flex justify-start items-center gap-x-5 w-[70rem]">
                <div className="w-[4rem] h-[4rem] bg-white rounded-full flex justify-center items-center overflow-hidden">
                    {
                        profileImage.errors.includes(profileImage.profileImage) || profileImage.profileImage.length <= 0 ? (
                            <h1>{profileImage.profileImage}</h1>
                        ) : (
                            <Image src={profileImage.profileImage} alt="profileImage" width={500} height={500}
                            style={{
                                objectFit: 'cover',
                                width: profileUrl[0] === 'profileImages/defaultProfile.png' || profileUrl[0] === '' ? '40%' : '100%',
                                height: profileUrl[0] === 'profileImages/defaultProfile.png' || profileUrl[0] === '' ? '40%' : '100%',
                            }} />
                        )
                    }
                </div>

                <div>
                    <h1 className="text-lg">{userName}</h1>
                    <p className="text-xs opacity-90">{messagingId}</p>
                </div>

            </div>

            <Link href={`/messages/${viewingUserId}=${viewingUserName}/${messagingId}=${userName}`}>test</Link>

            <div className="w-[8rem] flex" style={{ justifyContent: userState === 'friend' ? 'space-between' : 'flex-end' }}>
                {
                    userState === 'friend' ? (
                        <>
                            <button className="friendButton" id="message"
                                onClick={async () => {
                                    const addNewConversation = await messageUser(viewingUserMessagingId, messagingId, viewingUserName, userName, 'Message history started with', 'start')

                                    if (addNewConversation?.type === 'success') {
                                        router.push(`/messages/${viewingUserId}=${viewingUserName}/${messagingId}=${userName}`)
                                    }
                                }}
                            >
                                <Image src={images.message} alt="message" />
                            </button>

                            <button className="friendButton" id="menu" 
                                onClick={() => setHover({ payload: { overUser: hover.overUser, clicked: true }, type: userState })}
                            >

                                <Image src={images.userMenu} alt="menu" />
                            </button>

                            <div className="messageFriend right-[5.3rem] top-[-1.5rem] w-[5rem]">Message</div>
                            <div className="friendActions right-[.75rem] top-[-1.5rem]">More</div>

                            <div className="absolute w-[7.5rem] bg-[#5D5D5D] -right-[7.5rem] top-[-.5rem] text-white rounded-md transition-all duration-200 origin-left"
                                style={{ transform: hover.overUser && hover.clicked ? 'scale(1)' : 'scale(0)' }}
                            >
                                <button onClick={() => router.push(`/profile/${userId}=${userName}`)} className="w-full h-[2rem] rounded-t-md hover:bg-[#40C057]">View Profile</button>
                                
                                <button className="w-full h-[2rem] hover:bg-[#FA5252] border-y-2"
                                    onClick={() => updateFriendOrUser({
                                        userId: viewingUserId, userName: null, action: 'remove', friendId: userId, friendName: userName,
                                        friendMessagingId: messagingId, userMessagingId: null, friendOrUser: 'friend', state: null, blockedUser: null, image: null
                                    })}
                                >
                                    Remove Friend
                                </button>

                                <button className="w-full h-[2rem] rounded-b-md hover:bg-[#FA5252]">Block User</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <button className="friendButton" id="menu"
                                onClick={() => updateFriendOrUser({
                                    userId: viewingUserId, userName: null, action: 'unBlock', friendId: null, friendName: null,
                                    friendMessagingId: null, userMessagingId: null, friendOrUser: 'user', state: null,
                                    blockedUser: userId, image: null
                                })}
                            >
                                <Image src={images.unlockProfile} alt="unBlock" />
                            </button>

                            <div className="friendActions top-[-1.5rem] right-[.15rem] w-[5rem]">Unblock</div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default UserCardMessages