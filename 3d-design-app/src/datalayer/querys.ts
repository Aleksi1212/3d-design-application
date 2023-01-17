import { auth } from "./config"

async function getUserData(data: object) {
    const res = await fetch('http://localhost:3000/api/getUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    const userData = await res.json()
    const user = auth.currentUser
    console.log(user);

    return userData?.userData as any[]
}

export default getUserData