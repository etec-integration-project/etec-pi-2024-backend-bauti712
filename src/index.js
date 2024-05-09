import express from "express";
import  {createPool} from 'mysql2/promise'
const app = express()
import { config } from 'dotenv'

config()

const pool = createPool({
    host: process.env.HOST,
    user: 'root',
    password: process.env.PASSWORD,
    port: 3306,
    database: process.env.DBNAME
})

app.get ('/',(req, res) =>{
    res.send('hello world')

})

app.get ('/ping', async (req, res) =>{
    const result = await pool.query('SELECT NOW()')
    res.json(result[0])

})

app.listen(3000)
console.log('server on port', 3000)