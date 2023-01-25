'use client';

import Image from "next/image";
import userProfile from '../images/userProfile.png'
import check from '../images/check.png'
import close from '../images/close.png'

import { useEffect, useState } from "react";
import Link from "next/link";

import { signOut } from "firebase/auth";
import { auth } from "../datalayer/config";

import { cookieSetter } from "../datalayer/querys";

function Profile(props: any) {
    const [userName, setUserName] = useState(props.userName)
    const [userEmail, setUserEmail] = useState(props.userEmail)

    const [readonly, setReadonly] = useState(true)
    const [cursor, setCursor] = useState('default')
    const [showicon, setShowicon] = useState('none')

    useEffect(() => {
        if (readonly) {
            setCursor('default')
            setShowicon('none')
        } else {
            setCursor('text')
            setShowicon('flex')
        }
    }, [readonly])

    async function userSignOut() {
        if (props.method === 'google') {
            signOut(auth)
            .then(() => {
                console.log('signed out');
            })
            .catch((err) => {
                console.log(err);
            })
    
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    await cookieSetter(true, user.uid)    
                } else {
                    await cookieSetter(false, null)
                    window.location.reload()
                }
            })
        } else {
            const res = await fetch('http://localhost:3000/api/signOut', {
                method: 'GET'
            })

            const responseMessage = await res.json()

            if (responseMessage.message === 'ok') {
                await cookieSetter(false, null)
                window.location.reload()
            }
        }    
    }

    
    return (
        <div className="h-[20rem] w-[40rem] flex mt-[6rem]">
            <div className="pl-10 pr-14 flex flex-col justify-evenly items-center relative">
                <div className="w-[10rem] h-[10rem] rounded-full bg-white flex justify-center items-center shadow-lg">
                    <Image src={userProfile} alt="userProfile" />
                </div>
            
                <div className="pl-2 text-[#737373] flex flex-col text-xl">
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} readOnly={readonly} 
                            className="editUser" 
                            style={{'cursor': cursor}} />

                    <input type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} readOnly={readonly} 
                            className="editUser" 
                            style={{'cursor': cursor}} />
                    
                </div>

                <div className="flex absolute bottom-0 left-12 w-[5rem] justify-between">
                    <Image src={check} alt="check" className="cursor-pointer" style={{'display': showicon}} />
                    <Image src={close} alt="close" className="cursor-pointer" style={{'display': showicon}} width={30}
                            onClick={() => {setReadonly(true); setUserName(props.userName); setUserEmail(props.userEmail)}} />
                </div>
            </div>

            <hr className="bg-[#5D5D5D] opacity-40 w-[2px] h-[20rem] mr-14" />

            <div className="pt-10">
                <div className="flex flex-col h-[11rem] justify-evenly">
                    <button className="userButton bg-white" onClick={() => setReadonly(false)}>Edit</button>
                    <button className="userButton bg-white" onClick={userSignOut}>Sign Out</button>
                    <Link className="userButton bg-[#FA5252] flex justify-center items-center" href="/logIn/delete">Delete</Link>
                </div>
            </div>
        </div>
    )
}

export default Profile