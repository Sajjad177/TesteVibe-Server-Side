import express, { Request, Response } from "express"

const app = express()
const port = 3000 

app.get("/", (req : Request, res:Response) => {
    res.send("hello............. Banhgsgh")
})

app.listen(port, () => {
    console.log(`Example ${port}`)
})