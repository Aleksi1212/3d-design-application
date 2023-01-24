'use client';

import Link from 'next/link'
import Image from 'next/image'

import back from '../images/back.png'
import show from '../images/show.png'
import hide from '../images/hide.png'

import { useState, useEffect } from 'react'

function VerifyUser() {
    const [helper, setHelper] = useState(false)
    const [type, setType] = useState('password')
    const [image, setImage] = useState(show)

    useEffect(() => {
        if (helper) {
            setType('text')
            setImage(hide)
        } else {
            setType('password')
            setImage(show)
        }
    }, [helper])

    return(
        <section className='w-full h-[100vh] bg-[#2D2D2D] flex justify-center'>
        <div className="goBack">
            <Link href="/" className="w-full flex" id='link'>
                <Image src={back} alt="back" />
                <span className='pl-2 pt-[1px]'>Start</span>
            </Link>
        </div>

        <div className='bg-[#3D3D3D] w-[25rem] h-[30rem] mt-52 rounded-xl shadow-lg relative'>
            <h1 className="formHeader">Verify Email</h1>

            <div className='formContainer'>
                <form action="http://localhost:300/api/deleteUser" method='POST' className='form'>
                    <input type="text" className='input' name='email' placeholder='Email Address' required />

                    <div className='flex relative'>
                        <input type={type} className="input" name='password' placeholder='password' required />
                        <div className='absolute h-full right-2 flex flex-col justify-center'>
                            <Image src={image} alt="image" onClick={() => setHelper(!helper)} className="cursor-pointer" />
                        </div>
                    </div>

                    <button type='submit' className='inputButton'>Delete</button>
                </form>
            </div>

            <div>

            </div>
        </div>
    </section>
    )
}

export default VerifyUser