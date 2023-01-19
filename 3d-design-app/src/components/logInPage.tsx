'use client';

import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import show from '../images/show.png'
import hide from '../images/hide.png'
import back from '../images/back.png'

function LogIn() {
    const [helper, setHelper] = useState(true)
    const [type, setType] = useState(String)
    const [image, setImage] = useState(show)

    useEffect(() => {
        if (helper) {
            setType('password')
            setImage(show)
        } else {
            setType('text')
            setImage(hide)
        }
    }, [helper])
    

    return (
        <>
            <section className="w-full h-[100vh] bg-[#2D2D2D] flex justify-center">
                <div className="goBack">
                    <Link href="/" className="w-full flex" id="link">
                        <Image src={back} alt="back" />
                        <span className="pl-2 pt-[1px]">Start</span>
                    </Link>
                </div>

                <div className="bg-[#3D3D3D] w-[25rem] h-[30rem] mt-52 rounded-xl shadow-lg relative">
                    <h1 className="formHeader">Log In</h1>

                    <div className="formContainer">
                        <form className="form" method="POST" action="http://localhost:3000/api/logIn">
                            <input type="text" className="input" placeholder="Email Address" name="email" required />

                            <div className="flex relative">
                                <input type={type} className="input" placeholder="Password" name="password" required />
                                <div className="absolute h-full right-2 flex flex-col justify-center">
                                    <Image src={image} alt="image" onClick={() => setHelper(!helper)} className="cursor-pointer" />
                                </div>
                            </div>

                            <button className="inputButton" type="submit">Log In</button>
                        </form>
                    </div>

                    <div className="w-full absolute bottom-2 flex justify-evenly">
                        <Link href="/logIn/reset-password" className="text-[#3D8ED9]" id="link">Forgot Password</Link>
                        <Link href="/signUp" className="text-[#3D8ED9]" id="link">Create Account</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LogIn