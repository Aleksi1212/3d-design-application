'use client';

import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import updateFriendOrUser from "../../datalayer/firestoreFunctions/updateFriendOrUser";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

import useProfileImage from "../../hooks/profileImagehook";
import useRealtimeChanges from "../../hooks/realtimeChangeshook";

import SearchUsers from "./searchBox";
import UserCard from "./userCardProfile";
import AuthBox from "../authentication/authenticationBox";

import userActions from "../../functions/actions";
import images from "../../functions/importImages";

interface alertType {
    message: string,
    image: StaticImageData,
    top: string
}

function ProfilePage({ user }: any) {
    const { userId, userName, currentUser, pendingCount } = user || {}
    
    const router = useRouter()

    const userData = useRealtimeChanges(userId, currentUser.userId)
    const profileImage = useProfileImage(userData.profileUrl)
    const actions = userActions(userId, userData.currentUserData.username, userData.currentUserData.messagingId, userName, userData.messagingId, currentUser.userId, userData.userLocked.state, userData.blocked )
    
    const [alert, setAlert] = useState<alertType>({ message: 'ok', image: images.success, top: '-2.5rem' })
    const [logIn, setLogIn] = useState<string>('none')
    const [loading, setLoading] = useState<boolean>(false)
    const [hovered, setHovered] = useState<boolean>(false)

    let currentUserFriends: any = []
    userData.currentUserFriendData.map((friend: any) => {
        currentUserFriends.push(friend.friendId)
    })
    
    useEffect(() => {
        if (alert.top !== '-2.5rem') {
            setTimeout(() => {
                setAlert({ message: alert.message, image: alert.image, top: '-2.5rem' })
            }, 2000)
        }
    }, [alert])

    return (
        <>
            <section className="bg-[#F6F7F9] w-full h-[100vh] flex justify-center items-center gap-x-6">
                <div className="bg-[#3D3D3D] absolute w-[15rem] h-[2rem] rounded-lg pl-2 flex items-center text-white transition-all duration-200"
                    style={{ top: alert.top }}>
                    <Image src={alert?.image} alt="image" />
                    <h1 className="px-2">|</h1>
                    <h1>{alert.message}</h1>
                </div>

                <div className='absolute left-20 top-20  flex justify-between w-[10rem]'>
                    <div className="flex flex-col items-center gap-y-1">
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

                    <div className='relative flex flex-col justify-end'>
                        <div className='rounded-full w-[3rem] h-[3rem] absolute -top-[.4rem] left-[.4rem]' id='profileIcon'>
                            <Link href={`/profile/${currentUser.userId}=${userData.currentUserData.username}`} className="w-full h-full flex justify-center items-center">
                                <Image src={images.userProfile} alt="profile" width={30}height={30} />
                            </Link>
                        </div>

                        <svg width="60" height="45" className='-mt-1 ml-[.3rem] transition-all duration-[400ms]' id='profileSvg'>
                            <circle cx="26" cy="21" r="20" fill="none" stroke="#4D4D4D" strokeWidth="2"/>
                        </svg>

                        <div className='w-full text-white bg-[#5D5D5D] rounded-md text-sm transition-all origin-top scale-0 duration-200 flex justify-center' id='profileMessage'>Profile</div>
                    </div>
                </div>

                <div className="w-[40rem] h-[50rem] bg-white shadow-lg flex flex-col items-center justify-evenly rounded-xl ">
                    <div className="w-full flex items-center justify-between pl-20 pr-20">
                        <div className="w-[12rem] h-[12rem] shadow-lg bg-gray-100 rounded-full flex justify-center items-center relative overflow-hidden" id="addNewProfileImage"
                            onMouseEnter={() => currentUser.userId === userId ?  setHovered(true) : null} onMouseLeave={() => currentUser.userId === userId ?  setHovered(false) : null}>
                            {
                                profileImage.errors.includes(profileImage.profileImage) || profileImage.profileImage.length <= 0 ? (
                                    <h1>{profileImage.profileImage}</h1>

                                ) : !loading ? (
                                    <Image src={profileImage.profileImage} alt="profileImage" width={500} height={500}
                                    style={{
                                    objectFit: 'cover',
                                    width: userData.profileUrl === 'profileImages/defaultProfile.png' || userData.profileUrl === '' ? '25%' : '100%',
                                    height: userData.profileUrl === 'profileImages/defaultProfile.png' || userData.profileUrl === '' ? '25%' : '100%',
                                    opacity: hovered ? '20%' : '100%'
                                }} />
                                
                                ) : loading || profileImage.profileImage == '' ? (
                                    <Loader />
                                    ) : (
                                        null
                                        )
                                    }

                            {
                                currentUser.userId === userId ? (
                                    <label className="w-full h-full rounded-full absolute cursor-pointer">
                                        <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={async (e: any) => {
                                            if (e.target.files.length > 0) {
                                                setLoading(true)
                                                
                                                const changeImageResult = await updateFriendOrUser({ 
                                                    userId: currentUser.userId, userName: null, action: 'updateProfile', friendId: null, friendName: null,
                                                    friendMessagingId: null, userMessagingId: null, friendOrUser: 'user', state: null, blockedUser: null,
                                                    image: e.target.files[0]
                                                })
                                                
                                                setLoading(false)
                                                setAlert({ message: changeImageResult?.message, image: changeImageResult?.image, top: '1.25rem' })
                                            }
                                        }} />
                                    </label>
                                ) : (
                                    null
                                    )
                                }

                            <h1 className="absolute pointer-events-none" style={{ display: hovered ? 'flex' : 'none' }}>Change Profile Picture</h1>
                        </div>

                        <div className="flex flex-col justify-between gap-y-4 items-center">
                            <h1 className="text-3xl">{userName}</h1>
                            <div className="flex justify-center relative gap-x-5" style={{ width: 'calc(100% + 20px)' }}>
                                {
                                    actions.map((action: any) => {
                                        return (
                                            <button id="profileAction" className="relative" key={action.key}
                                            onClick={async () => {
                                                if (action.type === 'func') {
                                                    const alert = await action.action(action.params)
                                                    
                                                    if (alert.type === 'FirebaseError') {
                                                        setLogIn('flex')
                                                    } else {
                                                        setAlert({ message: alert.message, image: alert.image, top: '1.25rem' })
                                                    }
                                                } else {
                                                    router.push(action.params)
                                                }
                                            }}>
                                                {
                                                    action.key === 'notifications' && userData.pendingFriends.length > 0 ? (
                                                        <div className="bg-[#FA5252] w-[1rem] h-[1rem] rounded-full absolute -right-1 flex justify-center items-center text-white text-xs">
                                                            {userData.pendingFriends.length > 9 ? '9+' : userData.pendingFriends.length}
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
                            currentUser.userId !== userId && userData.blocked || currentUser.userId !== userId && userData.userLocked.state ? (
                                <h1 className="text-xl">
                                    {userData.blocked ? 'User Blocked' : userData.userLocked.state ? 'Account Only Viewable For Friends' : null}
                                </h1>
                            ) : (
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
                                                    initialAction: { message: 'Message', action: '', image: images.message },
                                                    secondaryAction: friendCard.friendId === currentUser.userId ? { message: 'Edit Profile', color: '#40C057', action: '' } :  
                                                    currentUserFriends.includes(friendCard.friendId) ? { message: 'Remove Friend', color: '#FA5252', action: 'remove' } : { message: 'Add Friend', color: '#40C057', action: 'add' }
                                                }} />
                                            })
                                        }
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>

                <SearchUsers viewer={{ userId: currentUser.userId, alert: (alertData: alertType) => setAlert(alertData)}} />

                <div className="absolute w-full h-[100vh] backdrop-blur-md items-center justify-center" style={{ display: logIn }}>
                    <button className="w-full h-full cursor-default" onClick={() => setLogIn('none')}></button>
                    <button className="absolute top-20 left-20 flex flex-col items-center" onClick={() => setLogIn('none')}>
                        <Image src={images.closeError} alt="close" id="closeImage" />
                        <div className="w-[5rem] rounded-md bg-[#4D4D4D] text-white transition-all duration-200 origin-top scale-0" id="closeBox">Close</div>
                    </button>

                    <div className="w-[26rem] h-[31rem] absolute flex justify-center items-center">
                        {
                            currentUser.userId === null ? (
                                <AuthBox method={'logIn'} header={'Log In To Make Changes'} styles={{ marginTop: '0', color: '#F6F7F9' }} buttons={{
                                    email: 'Log In With Email',
                                    google: 'Log In With Google',
                                    github: 'Log In With GitHub',
                                    facebook: 'Log In With FaceBook'
                                }} />
                            ) : (
                                null
                            )
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

export function Loader() {
    return (
        <div className="lds-ring">
            <div></div> <div></div>
            <div></div> <div></div>
        </div>
    )
}

export default ProfilePage