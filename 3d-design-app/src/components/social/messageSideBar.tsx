'use client';

import images from "../../functions/importImages";

import Image from 'next/image'
import Link from "next/link";

import useUserData from "../../hooks/userDataHook";
import useProfileImage from "../../hooks/profileImagehook";

function MessageSideBar({ user }: any) {
    const { userId } = user || {}

    const userData = useUserData(userId)
    const profileImage = useProfileImage(userData.profileUrl)

    return (
        <div className="h-full w-[20%] bg-white relative">
            <div className="absolute top-0 w-full h-[9%] border-b-2 border-[#D2D2D2] flex justify-center items-center">
                <div className="w-[90%] h-[2rem] flex justify-between items-center shadow-md rounded-md">
                    <Image src={images.search} alt="search" width={20} height={20} className="absolute pointer-events-none left-6" />
                    <input type="text" placeholder="Find or start a conversation" className="w-full h-[2rem] bg-[#F6F7F9] rounded-md pl-8" />
                </div>
            </div>

            <div className="absolute bottom-0 w-full h-[9%] border-t-2 border-[#D2D2D2] flex justify-between items-center px-4">
                <div className="flex gap-x-4">
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

                    <div className="flex flex-col justify-center">
                        <h1 className="text-lg">{userData.userName}</h1>
                        <p className="text-xs opacity-90">{userData.messagingId}</p>
                    </div>
                </div>

                <div className="flex gap-x-4">
                    <Link href={`/dashboard/${userId}`} id="dashboard">
                        <Image src={images.dashboard} alt="dashboard" width={30} />
                    </Link>

                    <button id="settings">
                        <Image src={images.settings} alt="settings" width={30} />
                    </button>

                    <div className="profileRoute right-[2.2rem] -top-1 text-sm h-[1.5rem] w-[5rem]" id="dashboardMessage">Dashboard</div>
                    <div className="profileRoute right-[-1px] -top-1 text-sm h-[1.5rem]" id="settingsMessage">Settings</div>
                </div>
            </div>
        </div>
    )
}

export default MessageSideBar