async function logIn(data: object) {
    const res = await fetch('http:/localhost:3000/api/logIn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return res.json()
}

async function signUp(data: object) {
    const res = await fetch('http://localhost:300/api/signUp', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return res.json()
}

export {
    logIn,
    signUp
}