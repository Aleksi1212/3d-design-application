'use client';

import images from "../../functions/importImages";

import Image from 'next/image'
import Link from "next/link";

import { useEffect, useState } from 'react'
import useProfileImage from "../../hooks/profileImagehook";

import { db } from "../../datalayer/config";
import { query, collection, where, getDocs } from "firebase/firestore";

interface userDataTypes {
    userName: string
    messagingId: string
    profileUrl: string
}

function MessageSideBar({ user }: any) {
    const { userId } = user || {}

    const [userData, setUserData] = useState<userDataTypes>({ userName: '', messagingId: '', profileUrl: 'profileImages/defaultProfile.png' })
    const profileImage = useProfileImage(userData.profileUrl)

    useEffect(() => {
        let isMounted = true

        async function getUserData() {
            try {
                const userQuery = query(collection(db, 'data'), where('userId', '==', userId))

                const querySnapshot = await getDocs(userQuery)
                const data: any = {
                    userName: querySnapshot.docs.map((doc) => doc.data().username),
                    messagingId: querySnapshot.docs.map((doc) => doc.data().messagingId),
                    profileUrl: querySnapshot.docs.map((doc) => doc.data().profileUrl)
                }

                if (isMounted) {
                    setUserData({ userName: data.userName[0], messagingId: data.messagingId[0], profileUrl: data.profileUrl[0] })
                }

            } catch(err) {
                setUserData({ userName: 'error', messagingId: '', profileUrl: userData.profileUrl })
            }
        }

        getUserData()

        return () => {
            isMounted = false
        }
    }, [])


    return (
        <div className="h-full w-[20%] bg-white relative">
            <div className="absolute top-0 w-full h-[9%] border-b-2 border-[#D2D2D2] flex justify-center items-center">
                <div className="w-[90%] h-[2rem] flex justify-between items-center shadow-md rounded-md">
                    <Image src={images.search} alt="search" width={20} height={20} className="absolute pointer-events-none left-6" />
                    <input type="text" placeholder="Find or start a conversation" className="w-full h-[2rem] bg-[#F6F7F9] rounded-md pl-8" />
                </div>
            </div>

            <div className="absolute bottom-0 w-full h-[9%] border-t-2 border-[#D2D2D2] flex justify-between items-center px-4">
                <div>
                    <div className="w-[4rem] h-[4rem] rounded-full shadow-md bg-[#F6F7F9] overflow-hidden">
                        {
                            profileImage.errors.includes(profileImage.profileImage) || profileImage.profileImage.length <= 0 ? (
                                <h1>{profileImage.profileImage}</h1>
                            ) : (
                                <Image src={profileImage.profileImage} alt="profileImage" width={500} height={500}
                                style={{
                                    objectFit: 'cover',
                                    width: userData.profileUrl === 'profileImages/defaultProfile.png' || userData.profileUrl === '' ? '40%' : '100%',
                                    height: userData.profileUrl === 'profileImages/defaultProfile.png' || userData.profileUrl === '' ? '40%' : '100%',
                                }} />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageSideBar