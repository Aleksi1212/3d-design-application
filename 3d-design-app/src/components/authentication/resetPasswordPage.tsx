'use client';

import Link from "next/link";
import Image from "next/image";
import images from "../../functions/importImages";


function ResetPage() {
    return (
        <>
            <nav className="absolute w-full flex justify-end pr-20 pt-12">
                <Link href="/">
                    <Image src={images.back} alt="back" />
                </Link>
            </nav>
            <section className="w-full h-[100vh] bg-[#2D2D2D] flex justify-center">
                <div className="bg-[#3D3D3D] w-[25rem] h-[20rem] mt-52 rounded-xl shadow-lg relative">
                    <h1 className="formHeader">Reset Password</h1>

                    <div className="formContainer h-48">
                        <form action="" className="form">
                            <input type="text" className="input" placeholder="Email Address" required />
                            <button className="inputButton" type="submit">Reset</button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ResetPage