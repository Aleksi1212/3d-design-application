'use client';

import { useState } from "react";
import useInputType from "../hooks/inputTypehook";

import Image from "next/image";
import Link from "next/link";
import back from '../images/back.png'

function SignUp() {
    const [helper, setHelper] = useState(false)
    const inputType = useInputType(helper)

    return (
        <>
            <section className="w-full h-[100vh] bg-[#2D2D2D] flex justify-center">
                <div className="goBack">
                    <Link href="/" className="w-full flex">
                        <Image src={back} alt="back" id="link" />
                        <span className="pl-2 pt-[1px]">Start</span>
                    </Link>
                </div>

                <div className="bg-[#3D3D3D] w-[25rem] h-[35rem] mt-52 rounded-xl shadow-lg relative">
                    <h1 className="formHeader">Sign Up</h1>

                    <div className="formContainer h-96">
                        <form className="form" action="http://localhost:3000/api/signUp" method="POST">
                            <input type="text" className="input" placeholder="Email Address" name="email" required />
                            <input type="text" className="input" placeholder="Username" name="username" required />

                            <div className="flex relative">
                                <input type={inputType.type} className="input" placeholder="Password" name="password" required />
                                <div className="absolute h-full right-2 flex flex-col justify-center">
                                    <Image src={inputType.image} alt="image" onClick={() => setHelper(!helper)} className="cursor-pointer" />
                                </div>
                            </div>

                            <button className="inputButton" type="submit">Sign Up</button>
                        </form>
                    </div>

                    <div className="w-full flex justify-start pl-10 bottom-2 absolute">
                        <Link href="/logIn" className="text-[#3D8ED9]" id="link">Already Have An Account</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignUp