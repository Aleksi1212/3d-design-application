'use client';

import Image from "next/image";

import { db } from "../datalayer/config";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useState, useReducer, useEffect, useRef } from "react";
import images from "../functions/importImages";

import UserCard from "./userCard";

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
    const { userId } = viewer || {}

    const [state, dispatch] = useReducer(reducer, { message: 'Hide Searchbox', hidden: false })
    const [userData, setUserData] = useState([]) as any

    const inputRef = useRef<HTMLInputElement | any>(null)
    
    async function searchUsers(userName: string) {
        if (userName.length > 0) {
            const que = query(collection(db, 'data'), where('username', '>=', userName), where('username', '<=', userName + '\uf8ff'))
            const querySnapshot = await getDocs(que)
            const users = querySnapshot.docs.map((doc) => doc.data())
    
            setUserData(users as any[])
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
            <div className="absolute transition-all flex items-center gap-x-2 w-[12rem] h-[2.5rem]" style={{ right: state.hidden ? '23.5rem' : '11rem' }}>

                <button className="h-full w-[35%]" id="showSearch" onClick={() => dispatch({ payload: { message: '', hidden: !state.hidden } })}>
                    <Image src={images.showSearch} alt="showSearch" className="transitiom-all duration-200" width={40} height={40} style={{ WebkitTransform: state.hidden ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                <div className="bg-[#5D5D5D] rounded-md text-white text-sm h-[1.5rem] flex items-center justify-center transition-all duration-200 origin-left scale-0" id="messageBox" style={{ width: 'calc(100% + 20px)' }}>{state.message}</div>
            </div>

            <div className="w-full h-[3rem] rounded-lg shadow-md flex items-center relative">
                <input ref={inputRef} type="text" className="w-full h-[3rem] rounded-lg pl-11 text-xl" onChange={(e) => searchUsers(e.target.value)} placeholder="Search Users" style={{ pointerEvents: state.hidden ? 'none' : 'auto' }} />
                <Image src={images.search} alt="search" className="absolute left-3" width={25} height={25} style={{ pointerEvents: state.hidden ? 'auto' : 'none' }} />
            </div>

            <hr className="w-full bg-[#5D5D5D] h-[2px] opacity-50 mt-6" />

            <div className="w-[137%] h-[90%] max-h-[90%] overflow-auto flex flex-col pt-6" id="userContainer">
                {
                    userData.map((userCard: any) => {
                        return <UserCard key={userCard.userId} 
                        user={{
                            viewingUser: userId,
                            usersId: userCard.userId,
                            usersName: userCard.username,
                            messagingId: userCard.messagingId,
                            action: userCard.userId === userId ? { message: 'Edit Profile', color: '#40C057', action: '' } : { message: 'Add Friend', color: '#40C057', action: 'add' }
                        }} />
                    })
                }
            </div>
        </div>
    )
}

export default SearchUsers