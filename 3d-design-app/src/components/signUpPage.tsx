'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import show from '../images/show.png'
import hide from '../images/hide.png'
import back from '../images/back.png'

function SignUp() {
    const router = useRouter()

    // async function newPage() {
    //     const testt = test()

    //     if (testt != null) {
    //         console.log(testt);
    //         router.push('/gottenData', testt)
    //     } else {
    //         console.log('no data');
    //     }
    // }

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
                <div className="bg-[#3D3D3D] w-[25rem] h-[35rem] mt-52 rounded-xl shadow-lg relative">
                    <h1 className="formHeader">Sign Up</h1>

                    <div className="formContainer h-96">
                        <form action="" className="form" >
                            <input type="text" className="input" placeholder="Email Address"  />
                            <input type="text" className="input" placeholder="Username" />

                            <div className="flex relative">
                                <input type={type} className="input" placeholder="Password" />
                                <div className="absolute h-full right-2 flex flex-col justify-center">
                                    <Image src={image} alt="image" onClick={() => setHelper(!helper)} className="cursor-pointer" />
                                </div>
                            </div>

                            <button className="inputButton" type="submit">Sign Up</button>
                        </form>
                    </div>
                    {/* <button onClick={() => Create(data)}>add</button> */}

                    <div className="w-full flex justify-start pl-10 bottom-2 absolute">
                        <Link href="/logIn" className="text-[#3D8ED9]" id="link">Already Have An Account</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SignUp