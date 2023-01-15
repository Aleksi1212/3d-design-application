'use client';

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import Image from "next/image";

import show from '../images/show.png'
import hide from '../images/hide.png'
import back from '../images/back.png'

import { logIn } from "../datalayer/requests";

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

    const [nameOrEmail, setNameOrEmail] = useState(String)
    const [password, setPassword] = useState(String)

    let data = {
        email: nameOrEmail,
        password: password
    }
    
    // const request = async () => {
    //     const res = await fetch('http://localhost:3000/api/hello', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(data)
    //     })

    //     return res.json()
    // }

    // request().then(data => console.log(data.data)
    // )

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
                        <form /*action="/gottenData"*/ className="form" /*onSubmit={() => logIn(data)}*/>
                            <input type="text" className="input" placeholder="Username Or Email Address" onChange={(e) => setNameOrEmail(e.target.value)} required />

                            <div className="flex relative">
                                <input type={type} className="input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                                <div className="absolute h-full right-2 flex flex-col justify-center">
                                    <Image src={image} alt="image" onClick={() => setHelper(!helper)} className="cursor-pointer" />
                                </div>
                            </div>

                            <button className="inputButton" type="submit">Log In</button>
                        </form>
                    </div>
                    <button onClick={() => logIn(data)}>test</button>

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