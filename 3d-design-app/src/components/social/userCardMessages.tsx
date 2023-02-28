'use client';

import Image from "next/image";
import Link from 'next/link'

import images from "../../functions/importImages";

import { useEffect, useState, useReducer } from 'react'
import { useRouter } from 'next/navigation'

import useProfileImage from "../../hooks/profileImagehook";

import { db } from "../../datalayer/config";
import { collection, where, onSnapshot, query } from "firebase/firestore";

interface hoverState {
    overUser: boolean
    overMenu: boolean
    clicked: boolean
    children: number
}

interface payloadType {
    payload: hoverState
}

function UserCardMessages({ user }: any) {
    const { viewingUserId, userId, userName, messagingId } = user || {}

    const [blockable, setBlockable] = useState<boolean>(true)
    const [profileUrl, setProfileUrl] = useState<Array<string>>([''])
    const profileImage = useProfileImage(profileUrl[0])

    function reducer(state: any, action: payloadType) {
        if (!blockable) {
            return {
                ...action.payload,
                children: 3
            }
        } else {
            return {
                ...action.payload,
                children: 2
            }
        }
    }

    const [hover, setHover] = useReducer(reducer, { overUser: false, overMenu: false, clicked: false, children: 3 } as hoverState)

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
        <div className="w-[90%] h-[5rem] rounded-md px-5 flex justify-between items-center hover:bg-[#F2F3F9] relative">
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

                <h1 className="text-lg">{userName}</h1>

            </div>

            <div className="w-[8rem] flex justify-between">
                <button className="friendButton">
                    <Image src={images.message} alt="message" />
                </button>

                <button className="friendButton">
                    <Image src={images.userMenu} alt="menu" />
                </button>
            </div>
        </div>
    )
}

export default UserCardMessages