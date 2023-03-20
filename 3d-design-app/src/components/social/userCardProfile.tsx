'use client';

import Link from "next/link";
import Image from "next/image";

import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";

import images from "../../functions/importImages";
import UpdateFriendOrUser from "../../datalayer/firestoreFunctions/updateFriendOrUser";
import messageUser from "../../datalayer/firestoreFunctions/messages/sendMessage";

import { db } from "../../datalayer/config";
import { query, collectionGroup, where, onSnapshot, collection } from "firebase/firestore";

import useProfileImage from "../../hooks/profileImagehook";
import useUserData from "../../hooks/realtimeChangeshook";
import acceptFriendRequest from "../../datalayer/firestoreFunctions/acceptFriendRequest";


interface reducerType {
    overUser: boolean,
    overMenu: boolean,
    clicked: boolean,
    children: number
}

interface payloadType {
    payload: reducerType
}

function UserCard({ user }: any) {
    const { viewingUser, viewingUserMessagingId, viewingUserName, usersId, usersName, messagingId, initialAction, secondaryAction } = user || {}

    const [blockable, setBlockable] = useState<boolean>(true)
    const [profileUrl, setProfileUrl] = useState<Array<string>>([''])
    const profileImage = useProfileImage(profileUrl[0])

    const [userMethods, setUserMethods] = useState<UpdateFriendOrUser>(new UpdateFriendOrUser('initialDocId'))
    const userData = useUserData(usersId, viewingUser)


    function reducer(state: any, action: payloadType) {
        if (!blockable || viewingUser === usersId) {
            return {
                ...action.payload,
                chilren: 3
            }
        } else {
            return {
                ...action.payload,
                children: 2
            }
        }
    }

    const [state, dispatch] = useReducer(reducer, { overUser: false, overMenu: false, clicked: false, children: 3 } as reducerType)

    useEffect(() => {
        let isMounted = true

        const blockedQue = query(collectionGroup(db, 'blockedUsers'), where('blockedusers', 'array-contains', usersId), where('user', '==', viewingUser))
        const seeIfBlocked = onSnapshot(blockedQue, (querySnapshot) => {
            let blocked: any = []
            querySnapshot.forEach((user) => {
                blocked.push(user.data())
            })

            blocked.length > 0 ? setBlockable(false) : setBlockable(true)
        })

        const userProfileQue = query(collection(db, 'data'), where('userId', '==', usersId))
        const getProfileImage = onSnapshot(userProfileQue, (querySnapshot) => {
            let imageUrl: any = []
            querySnapshot.forEach((image) => {
                imageUrl.push(image.data().profileUrl)
            })

            setProfileUrl(imageUrl)
        })

        async function initializeClass() {
            const updateUser = await UpdateFriendOrUser.createDocId(viewingUser)
            
            if (isMounted) {
                setUserMethods(updateUser)
            }
        }

        initializeClass()

        return () => {
            seeIfBlocked()
            getProfileImage()
            isMounted = false
        }
    }, [])

    const router = useRouter()
    
    return (
        <div className="w-[73%] h-[5rem] flex items-center justify-between border-b-2 border-gray-300 p-2 bg-white" id="friend" 
            onMouseEnter={() => dispatch({ payload: { overUser: true, overMenu: state.overMenu, clicked: state.clicked, children: state.children } })} 
            onMouseLeave={() => dispatch({ payload: { overUser: false, overMenu: state.overMenu, clicked: false, children: state.children } })}>

            <Link className="w-[75%]" href={`/profile/${usersId}=${usersName}`}>
                <div className="flex items-center text-lg gap-x-5">
                    <div className="h-[4rem] w-[4rem] bg-gray-100 shadow-lg rounded-full flex justify-center items-center overflow-hidden">
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
                        <h1>{usersName}</h1>
                        <p className="text-xs opacity-90">{messagingId}</p>
                    </div>
                </div>
            </Link>


            <div className="flex w-[7rem] justify-between relative">
                <button className="friendButton" id="message"
                    onClick={async () => {
                        if (initialAction.action === 'message') {
                            const startMessageHistory = await messageUser(viewingUserMessagingId, messagingId, viewingUser, usersId, viewingUserName, usersName, 'Message History Started With', 'start')

                            if (startMessageHistory?.type === 'success') {
                                router.push(`/messages/${viewingUser}=${viewingUserName}_${viewingUserMessagingId}/${messagingId}=${usersName}`)
                            }

                        } else if (initialAction.action === 'accept') {
                            const acceptFriend = await acceptFriendRequest(viewingUser, usersId, usersName, messagingId)
                            console.log(acceptFriend.message)
                        }
                    }}
                >
                    <Image src={initialAction.image} alt="initialAction" />
                </button>

                <button className="friendButton" id="menu"
                    onClick={() => dispatch({ payload: { overUser: state.overUser, overMenu: state.overMenu, clicked: true, children: state.children } })}>
                    <Image src={images.userMenu} alt="userMenu" />
                </button>
                
                <div className="messageFriend right-12 w-[5rem]">{initialAction.message}</div>
                <div className="friendActions">More</div>

                <div className="absolute w-[10rem] bg-[#5D5D5D] -right-[10.5rem] text-white rounded-md transition-all duration-200 origin-left" id="friendMenu"
                    onMouseEnter={() => dispatch({ payload: { overUser: state.overUser, overMenu: true, clicked: state.clicked, children: state.children } })} 
                    onMouseLeave={() => dispatch({ payload: { overUser: state.overUser, overMenu: false, clicked: state.clicked, children: state.children  } })}

                    style={{ transform: state.overUser && state.clicked || state.overMenu && state.clicked ? 'scale(1)' : 'scale(0)', top: state.children === 3 ? '-1.55rem' : '-.5rem' }}>

                    <button onClick={() => router.push(`/profile/${usersId}=${usersName}`)} className=" w-full h-[2rem] border-b-2 rounded-tr-md rounded-tl-md hover:bg-[#40C057]">View Profile</button>

                    {
                        blockable ? (
                            <button className={`w-full h-[2rem] hover:bg-[${secondaryAction.color}]`} style={{ 
                                borderBottom: viewingUser === usersId ? '0px' : '2px solid lightgray',
                                borderBottomLeftRadius: viewingUser === usersId ? '.375rem' : '0', borderBottomRightRadius: viewingUser === usersId ? '.375rem' : '0'
                            }}
                            onClick={async () => {
                                if (secondaryAction.action === 'add') {
                                    const sendFriendRequest = await userMethods.sendFriendRequest(
                                        viewingUser, userData.currentUserData.username, userData.currentUserData.messagingId,
                                        usersId, usersName, messagingId
                                    )

                                    console.log(sendFriendRequest)

                                } else if (secondaryAction.action === 'remove') {
                                    const removeFriend = await userMethods.removeFriend(viewingUser, usersId)
                                    console.log(removeFriend)
                                }
                            }}>
                            {secondaryAction.message}</button>
                        ) : (
                            null
                        )
                    }

                    {
                        viewingUser !== usersId ? (
                            <button className="w-full h-[2rem] rounded-bl-md rounded-br-md hover:bg-[#FA5252]"
                            onClick={async () => {
                                if (blockable) {
                                    const blockUser = await userMethods.blockUser(usersId, viewingUser)
                                    console.log(blockUser)
                                } else {
                                    const unBlockUser = await userMethods.unBlockUser(usersId)
                                    console.log(unBlockUser)
                                }
                            }}>{ blockable ? 'Block User' : 'Unblock User' }</button>
                        ) : (
                            null
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default UserCard