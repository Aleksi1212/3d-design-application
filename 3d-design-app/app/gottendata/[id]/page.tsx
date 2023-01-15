import { FC, useState } from "react";
import Test from "../../../src/components/test";

interface pageProps {}

async function GetUserData(data: object) {
    const res = await fetch('http://localhost:3000/api/getUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return res.json()
} 

const TestPage: FC<pageProps> = ({ params }: any) => {
    GetUserData(params.id)
    .then((data) => console.log(data))

    return (
        <Test />
    )
}

export default TestPage