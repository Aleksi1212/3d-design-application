'use client';

import Image from "next/image";
import Link from "next/link";

import { updateFriendOrUser } from "../datalayer/querys";

import { useState } from "react";
import { useRouter } from 'next/navigation'
import useProfileImage from "../hooks/profileImagehook";
import useUserData from "../hooks/userDataHook";

import SearchUsers from "./searchUsers";
import UserCard from "./userCard";

import userActions from "../functions/actions";
import images from "../functions/importImages";

function ProfilePage({ user }: any) {
    const { userId, userName, currentUser, pendingCount } = user || {}

    const userData = useUserData(userId, currentUser.userId)
    const profileImage = useProfileImage(userData.profileUrl)
    
    const [hovered, setHovered] = useState(false)
    const router = useRouter()

    let currentUserFriends: any = []
    userData.currentUserFriendData.map((friend: any) => {
        currentUserFriends.push(friend.friendId)
    })

    const actions = userActions(userId, userData.currentUserName, userData.currentUserMessagingId, userName, userData.messagingId, currentUser.userId, userData.userLocked.state, userData.blocked )

    return (
        <section className="bg-[#F6F7F9] w-full h-[100vh] flex justify-center items-center gap-x-6">
            <div className="absolute left-20 top-20  flex flex-col items-center gap-y-1">
                <Link href={`/dashboard/${currentUser.userId}`} className="flex w-[2.5rem] h-[2.5rem]" id="dashLink">
                    <div className="flex flex-col h-full w-[50%] gap-y-[.1rem] ">
                        <div className="dashIcon h-[70%] w-[95%]" id="icon"></div>
                        <div className="dashIcon h-[30%] w-[95%]" id="icon"></div>
                    </div>

                    <div className="flex flex-col h-full w-[50%] gap-y-[.1rem] items-end ">
                        <div className="dashIcon h-[30%] w-[95%]" id="icon"></div>
                        <div className="dashIcon h-[70%] w-[95%]" id="icon"></div>
                    </div>
                </Link>

                <div className="w-full text-white bg-[#5D5D5D] rounded-md text-sm px-2 transition-all origin-top scale-0 duration-200" id="dashMessage">Dashboard</div>
            </div>

            <div className="w-[40rem] h-[50rem] bg-white shadow-lg flex flex-col items-center justify-evenly rounded-xl ">
                <div className="w-full flex items-center justify-between pl-20 pr-20">
                    <div className="w-[12rem] h-[12rem] shadow-lg bg-gray-100 rounded-full flex justify-center items-center relative" id="addNewProfileImage"
                        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                        {
                            profileImage.errors.includes(profileImage.profileImage) || profileImage.profileImage.length <= 0 ? (
                                <h1>{profileImage.profileImage}</h1>
                            ) : (
                                <Image src={hovered ? images.addProfileImage : profileImage.profileImage} alt="profileImage" width={50} height={50} />
                            )
                        }

                        <label className="bg-black w-full h-full rounded-full cursor-pointer absolute" style={{ opacity: hovered ? '10%' : '0' }}>
                            <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e: any) => 
                                updateFriendOrUser({ 
                                    userId: currentUser.userId, userName: null, action: 'updateProfile', friendId: null, friendName: null,
                                    friendMessagingId: null, userMessagingId: null, friendOrUser: 'user', state: null, blockedUser: null, image: e.target.files[0]
                                })
                            } />
                        </label>

                    </div>

                    <div className="flex flex-col justify-between gap-y-4 items-center">
                        <h1 className="text-3xl">{userName}</h1>
                        <div className="flex justify-center relative gap-x-5" style={{ width: 'calc(100% + 20px)' }}>
                            {
                                actions.map((action: any) => {
                                    return (
                                        <button id="profileAction" className="relative" key={action.key}
                                        onClick={() => {
                                            if (action.type === 'func') {
                                                action.action(action.params)
                                            } else {
                                                router.push(action.params)
                                            }
                                        }}>
                                            {
                                                action.key === 'notifications' && pendingCount > 0 ? (
                                                    <div className="bg-[#FA5252] w-[1rem] h-[1rem] rounded-full absolute -right-1 flex justify-center items-center text-white text-xs">
                                                        {pendingCount > 9 ? '9+' : pendingCount}
                                                    </div>
                                                ) : (
                                                    null
                                                )
                                            }
                                            <Image src={action.image} alt="actionImage" width={25} height={25} />
                                            <div style={{ backgroundColor: action.color, marginRight: action.key === 'signOut' ? '.25rem' : '0' }}
                                                id="profileBar"></div>
                                            {
                                                action.key === 'notifications' ? (
                                                    <div className="actionBox w-24">{action.message}</div>
                                                ): (
                                                    <div className="actionBox w-16">{action.message}</div>
                                                )
                                            }
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <hr className="w-[80%] h-[2.5px] bg-[#5D5D5D] opacity-40" />

                <div className="w-full h-[30rem] flex flex-col items-center pt-2">
                    {
                        !userData.blocked ? (
                            <>
                                <div className="w-full flex justify-evenly text-[1.5rem]">
                                    <button className="flex flex-col items-center" id="otherAction">
                                        <h1>Friends</h1>
                                        <div id="otherBar" className="bg-[#5D5D5D] opacity-75"></div>
                                    </button>

                                    <button className="flex flex-col items-center" id="otherAction">
                                        <h1>Designs</h1>
                                        <div id="otherBar" className="bg-[#5D5D5D] opacity-75"></div>
                                    </button>
                                </div>

                                <div className="w-[110%] max-h-full h-full ml-[11.5rem] flex overflow-auto flex-col mt-2 pt-6" id="friendContainer">
                                    {
                                        userData.friendData.map((friendCard: any) => {
                                            return <UserCard key={friendCard.friendId} 
                                            user={{ 
                                                viewingUser: currentUser.userId,
                                                usersId: friendCard.friendId, 
                                                usersName: friendCard.friendName, 
                                                messagingId: friendCard.messagingId, 
                                                action: friendCard.friendId === currentUser.userId ? { message: 'Edit Profile', color: '#40C057', action: '' } :  
                                                currentUserFriends.includes(friendCard.friendId) ? { message: 'Remove Friend', color: '#FA5252', action: 'remove' } : { message: 'Add Friend', color: '#40C057', action: 'add' }
                                            }} />
                                        })
                                    }
                                </div>
                            </>
                        ) : (
                            <h1 className="text-xl">User blocked</h1>
                        )
                    }
                </div>
            </div>

            <SearchUsers viewer={{ userId: currentUser.userId }} />
        </section>
    )
}

export default ProfilePage