'use client';

import Link from 'next/link'
import Image from 'next/image'

import back from '../images/back.png'

import useInputType from '../hooks/inputTypehook';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { cookieSetter } from '../datalayer/querys';

function VerifyUser() {
    const [helper, setHelper] = useState(false)
    const inputType = useInputType(helper)

    const router = useRouter()

    async function deleteUser(event: any) {
        event.preventDefault()

        const email = event.target.email.value
        const password = event.target.password.value

        const res = await fetch('http://localhost:3000/api/deleteUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })

        const responseMessage = await res.json()
        const message = responseMessage as any

        if (message.message === 'deleted succesfully') {
            await cookieSetter(false, null)
            router.push('/')
        }
    }

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
                <form method='POST' className='form' onSubmit={deleteUser}>
                    <input type="text" className='input' placeholder='Email Address' name='email' required />

                    <div className='flex relative'>
                        <input type={inputType.type} className="input" placeholder='password' name='password' required />
                        <div className='absolute h-full right-2 flex flex-col justify-center'>
                            <Image src={inputType.image} alt="image" onClick={() => setHelper(!helper)} className="cursor-pointer" />
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