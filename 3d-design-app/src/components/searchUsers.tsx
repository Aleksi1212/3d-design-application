'use client';

import Image from "next/image";

import { db } from "../datalayer/config";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useState, useReducer } from "react";
import useImages from "../hooks/importImages";

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
    const images = useImages(require.context('../images', false, /\.(png|jpe?g|svg)$/))

    const { userId } = viewer || {}

    const [userData, setUserData] = useState([]) as any
    const [state, dispatch] = useReducer(reducer, { message: 'Hide Searchbox', hidden: false })
    
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

    return (
        <div className="h-[50rem] shadow-lg bg-white rounded-xl p-6 transition-all" style={{ width: state.hidden ? '5rem' : '30rem' }}>
            <button className="absolute cursor-pointer transition-all flex items-center gap-x-2 w-[12rem]" style={{ right: state.hidden ? '23.5rem' : '11rem' }} 
                onClick={() => dispatch({ payload: { message: '', hidden: !state.hidden } })}>

                <Image src={images['showSearch.png']} alt="showSearch" className="transition-all duration-300" width={40} height={40} style={{ rotate: state.hidden ? '180deg' : '0deg' }} id="showSearch" />
                <div className="bg-[#5D5D5D] rounded-md text-white text-sm h-[1.5rem] flex items-center justify-center transition-all duration-200 origin-left scale-0" id="messageBox" style={{ width: 'calc(100% + 20px)' }}>{state.message}</div>
            </button>

            <div className="w-full h-[3rem] rounded-lg shadow-md flex items-center relative">
                <input type="text" className="w-full h-[3rem] rounded-lg pl-11 text-xl" onChange={(e) => searchUsers(e.target.value)} placeholder="Search Users" />
                <Image src={images['search.png']} alt="search" className="absolute left-3" width={25} height={25} />
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