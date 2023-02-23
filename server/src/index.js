import express from 'express';
import cors from 'cors';

const app = express()

app.use(cors())

app.get('/',(req, res) => {
    res.send('hello world')
})

app.get('/test', (req, res) => {
    res.json({ message: 'hello world' })
})

app.listen(8000, () => {
    console.log('listening on port 8000')
})