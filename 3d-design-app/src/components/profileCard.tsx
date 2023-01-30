'use client';

import Image from "next/image";
import Link from "next/link";

import userProfile from '../images/userProfile.png'
import check from '../images/check.png'
import close from '../images/close.png'
import edit from '../images/edit.png'

import { signOut } from "firebase/auth";
import { auth } from "../datalayer/config";

import { cookieSetter } from "../datalayer/querys";
import { useState, useReducer } from "react";

import { db } from "../datalayer/config";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

function setReadonly(state: any, action: any) {
    if (action.payload.readOnly) {
        return {
            readOnly: true
        }
    } else {
        return {
            readOnly: false
        }
    }
}

function Profile({ userData }: any) {
    const { username, email, userId, method } = userData || {}

    const [name, setName] = useState(username)
    const [userEmail, setUserEmail] = useState(email)

    const [state, dispatch] = useReducer(setReadonly, { readOnly: true })

    async function userSignOut() {
        if (method !== 'email') {
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

    async function editProfile(event: any) {
        event.preventDefault()

        const userName = event.target.userName.value
        const userEmail = event.target.userEmail.value

        const que = query(collection(db, 'data'), where('userId', '==', userId))
        const querySnapshot = await getDocs(que)
        const docId = querySnapshot.docs.map((doc) => doc.id)

        const docRef = doc(db, 'data', docId[0])

        await updateDoc(docRef, {
            'username': userName,
            'email': userEmail
        })

        dispatch({ payload: { readOnly: true } })
    }
    
    return (
        <div className="h-[20rem] w-[40rem] flex mt-[6rem]">
            <div className="pl-10 pr-14 flex flex-col justify-evenly items-center relative">
                <div className="w-[10rem] h-[10rem] rounded-full bg-white flex justify-center items-center shadow-lg">
                    <Image src={userProfile} alt="userProfile" />
                </div>
            
                <div className="pl-2 text-[#737373] flex flex-col text-xl">
                    <form className="flex flex-col justify-center items-center" onSubmit={editProfile}>
                        <div className="flex justify-between">
                            <input type="text" value={name} name="userName" className="editUser w-[80%]" readOnly={state.readOnly}  required
                                onChange={(e) => setName(e.target.value)} />
                            <Image src={edit} alt="edit" width={26} style={{ display: state.readOnly ? 'none' : 'flex' }} />
                        </div>

                        <div className="flex justify-between">
                            <input type="text" value={userEmail} name="userEmail" className="editUser w-[80%]" readOnly={method === 'email' ? state.readOnly : true} required
                                onChange={(e) => setUserEmail(e.target.value)} />
                            <Image src={edit} alt="edit" width={26} style={{ display: state.readOnly ? 'none' : 'flex' }} />
                        </div>

                        <div className=" w-full flex justify-evenly" style={{ display: state.readOnly ? 'none' : 'flex' }}>
                            <button type="submit" id="editButton">
                                <Image src={check} alt="check" />
                            </button>
                            <Image src={close} alt="close" width={30} className="cursor-pointer" id="editButton" onClick={() => dispatch({ payload: { readOnly: true } })} />
                        </div>
                    </form>
                </div>
            </div>

            <hr className="bg-[#5D5D5D] opacity-40 w-[2px] h-[20rem] mr-14" />

            <div className="pt-10">
                <div className="flex flex-col h-[15rem] justify-evenly">
                    <button className="userButton bg-white">Show Profile</button>
                    <button className="userButton bg-white" onClick={() => dispatch({ payload: { readOnly: false } })}>Edit Profile</button>
                    <button className="userButton bg-white" onClick={userSignOut}>Sign Out</button>
                    <Link className="userButton bg-[#FA5252] flex justify-center items-center" href="/logIn/delete">Delete</Link>
                </div>
            </div>
        </div>
    )
}

export default Profile