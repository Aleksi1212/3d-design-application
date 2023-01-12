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
            <nav className="absolute w-full flex justify-end pr-20 pt-12">
                <Link href="/">
                    <Image src={back} alt="back" />
                </Link>
            </nav>
            <section className="w-full h-[100vh] bg-[#2D2D2D] flex justify-center">
                <div className="bg-[#3D3D3D] w-[25rem] h-[30rem] mt-52 rounded-xl shadow-lg relative">
                    <h1 className="formHeader">Log In</h1>

                    <div className="formContainer">
                        <form action="" className="form">
                            <input type="text" className="input" placeholder="Username Or Email Address" required />

                            <div className="flex relative">
                                <input type={type} className="input" placeholder="Password" required />
                                <Image src={image} alt="image" onClick={() => setHelper(!helper)} className="absolute right-4 top-[.75rem] cursor-pointer" />
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