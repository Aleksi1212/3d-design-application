'use client';

import Link from "next/link";
import Image from "next/image";

import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import images from "../hooks/importImages";

import { updateFriendOrUser } from "../datalayer/querys";

import { db } from "../datalayer/config";
import { query, collectionGroup, where, onSnapshot } from "firebase/firestore";

function UserCard({ user }: any) {
    const { viewingUser, usersId, usersName, messagingId, action } = user || {}

    const [blockable, setBlockable] = useState(true)

    function reducer(state: any, action: any) {
        if (!blockable || viewingUser === usersId) {
            return {
                overUser: action.payload.overUser,
                overMenu: action.payload.overMenu,
                clicked: action.payload.clicked,
                children: 2
            }
        } else {
            return {
                overUser: action.payload.overUser,
                overMenu: action.payload.overMenu,
                clicked: action.payload.clicked,
                children: 3
            }
        }
    }

    const [state, dispatch] = useReducer(reducer, { overUser: false, overMenu: false, clicked: false, children: 3 })

    useEffect(() => {
        const que = query(collectionGroup(db, 'blockedUsers'), where('blockedusers', 'array-contains', usersId), where('user', '==', viewingUser))

        const seeIfBlocked = onSnapshot(que, (querySnapshot) => {
            let blocked: any = []
            querySnapshot.forEach((user) => {
                blocked.push(user.data())
            })

            blocked.length > 0 ? setBlockable(false) : setBlockable(true)
        })

        return () => seeIfBlocked()
    }, [])

    const router = useRouter()
    
    return (
        <div className="w-[73%] h-[5rem] flex items-center justify-between border-b-2 border-gray-300 p-2 bg-white" id="friend" 
            onMouseEnter={() => dispatch({ payload: { overUser: true, overMenu: state.overMenu, clicked: state.clicked, children: state.children } })} 
            onMouseLeave={() => dispatch({ payload: { overUser: false, overMenu: state.overMenu, clicked: false, children: state.children } })}>
            <Link className="w-[75%]" href={`/profile/${usersId}=${usersName}`}>
                <div className="flex items-center text-lg gap-x-5">
                    <div className="h-[4rem] w-[4rem] bg-gray-100 shadow-lg rounded-full flex justify-center items-center">
                        <Image src={images.userProfile} alt="profileImage" width={30} height={30} />
                    </div>
                    
                    <div>
                        <h1>{usersName}</h1>
                        <p className="text-xs opacity-90">{messagingId}</p>
                    </div>
                </div>
            </Link>


            <div className="flex w-[7rem] justify-between relative">
                <button className="friendButton" id="message">
                    <Image src={images.message} alt="message" />
                </button>

                <button className="friendButton" id="menu"
                    onClick={() => dispatch({ payload: { overUser: state.overUser, overMenu: state.overMenu, clicked: true, children: state.children } })}>
                    <Image src={images.userMenu} alt="userMenu" />
                </button>

                <div className="messageFriend right-12 w-[5rem]">Message</div>
                <div className="friendActions">More</div>

                <div className="absolute w-[10rem] bg-[#5D5D5D] -right-[10.5rem] text-white rounded-md transition-all duration-200 origin-left" id="friendMenu"
                    onMouseEnter={() => dispatch({ payload: { overUser: state.overUser, overMenu: true, clicked: state.clicked, children: state.children } })} 
                    onMouseLeave={() => dispatch({ payload: { overUser: state.overUser, overMenu: false, clicked: state.clicked, children: state.clicked  } })}

                    style={{ transform: state.overUser && state.clicked || state.overMenu && state.clicked ? 'scale(1)' : 'scale(0)', top: state.children === 3 ? '-1.55rem' : '-.5rem' }}>

                    <button onClick={() => router.push(`/profile/${usersId}=${usersName}`)} className=" w-full h-[2rem] border-b-2 rounded-tr-md rounded-tl-md hover:bg-[#40C057]">View Profile</button>

                    {
                        blockable ? (
                            <button className={`w-full h-[2rem] hover:bg-[${action.color}]`} style={{ 
                                borderBottom: viewingUser === usersId ? '0px' : '2px solid lightgray',
                                borderBottomLeftRadius: viewingUser === usersId ? '.375rem' : '0', borderBottomRightRadius: viewingUser === usersId ? '.375rem' : '0'
                            }}
                            onClick={() => {
                                if (action.action === 'add' || action.action === 'remove') {
                                    updateFriendOrUser(viewingUser, action.action, usersId, usersName, messagingId, 'friend', null, null)
                                }
                            }}>
                            {action.message}</button>
                        ) : (
                            null
                        )
                    }

                    {
                        viewingUser !== usersId ? (
                            <button className="w-full h-[2rem] rounded-bl-md rounded-br-md hover:bg-[#FA5252]"
                            onClick={() => {
                                if (blockable) {
                                    updateFriendOrUser(viewingUser, 'block', null, null, null, 'user', null, usersId)
                                } else {
                                    updateFriendOrUser(viewingUser, 'unBlock', null, null, null, 'user', null, usersId)
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