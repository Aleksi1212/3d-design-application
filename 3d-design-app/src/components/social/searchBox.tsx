'use client';

import Image from "next/image";

import { db } from "../../datalayer/config";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useState, useReducer, useEffect, useRef } from "react";
import images from "../../functions/importImages";

import UserCard from "./userCardProfile";

interface searchBoxTypes {
    message: string
    hidden: boolean
}

function reducer(state: any, action: any) {
    if (action.payload.hidden) {
        return {
            message: 'Show Searchbox',
            hidden: true
        }
    } else {
        return {
            message: 'Hide Searchbox',
            hidden: false
        }
    }
}

function SearchUsers({ viewer }: any) {
    const { userId, messagingId, userName } = viewer || {}

    const [state, dispatch] = useReducer(reducer, { message: 'Hide Searchbox', hidden: false } as searchBoxTypes)
    const [userData, setUserData] = useState([]) as any
    const [error, setError] = useState<string>('')

    const inputRef = useRef<HTMLInputElement | any>(null)
    
    async function searchUsers(userName: string) {
        if (userName.length > 0) {
            const que = query(collection(db, 'data'), where('username', '>=', userName), where('username', '<=', userName + '\uf8ff'))
            const querySnapshot = await getDocs(que)
            const users = querySnapshot.docs.map((doc) => doc.data())
    
            if (users.length === 0) {
                setError('No Users Found')
                setUserData([])
            } else {
                setError('')
                setUserData(users as any[])
            }
        } else {
            setUserData([])
        }
    }

    useEffect(() => {
        if (state.hidden) {
            inputRef.current.value = ''
            setUserData([])
        } else {
            inputRef.current.value = inputRef.current.value
            setUserData(userData)
        }
    }, [state])


    return (
        <div className="h-[50rem] shadow-lg bg-white rounded-xl p-6 transition-all" style={{ width: state.hidden ? '5rem' : '30rem' }}>

            <button className="hideSearchBox" style={{ left: state.hidden ? '84rem' : '96.5rem' }} onClick={() => dispatch({ payload: { message: '', hidden: !state.hidden } })}>
                <h1 className="absolute w-[8rem] h-[1.5rem] flex justify-center items-center pointer-events-none text-[#F6F7F9]">{state.message}</h1>
            </button>

            <div className="w-full h-[3rem] rounded-lg shadow-md flex items-center relative">
                <input ref={inputRef} type="text" className="w-full h-[3rem] rounded-lg pl-11 text-xl" onChange={(e) => searchUsers(e.target.value)} placeholder="Search Users" style={{ pointerEvents: state.hidden ? 'none' : 'auto' }} />
                <Image src={images.search} alt="search" className="absolute left-3" width={25} height={25} style={{ pointerEvents: state.hidden ? 'auto' : 'none' }} />
            </div>

            <hr className="w-full bg-[#5D5D5D] h-[2px] opacity-50 mt-6" />

            <div className="w-[137%] h-[90%] max-h-[90%] overflow-auto flex flex-col pt-6" id="userContainer">
                {
                    error !== '' ? <h1 className="w-[73.5%] flex justify-center">{error}</h1> : null
                }

                {
                    userData.map((userCard: any) => {
                        return <UserCard key={userCard.userId} 
                        user={{
                            viewingUser: userId,
                            viewingUserMessagingId: messagingId,
                            viewingUserName: userName,
                            usersId: userCard.userId,
                            usersName: userCard.username,
                            messagingId: userCard.messagingId,
                            initialAction: { message: 'Message', action: 'message', image: images.message },
                            secondaryAction: userCard.userId === userId ? { message: 'Settings', color: '#40C057', action: '' } : { message: 'Add Friend', color: '#40C057', action: 'add' },
                        }} />
                    })
                }
            </div>
        </div>
    )
}

export default SearchUsers