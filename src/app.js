import express from "express"
import cors from "cors"

const PORT = 5000
const serverUsers = []
const app = express()
app.use(cors())
app.use(express.json())
app.listen(PORT, () => console.log(`Running on port ${PORT}`))

app.post("/sign-up", (req, res) => {
    const user = req.body 
    serverUsers.push(user)
    res.send("OK")
})
