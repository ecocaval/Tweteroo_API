import express from "express"
import cors from "cors"

const serverUsers = []
const serverTweets = []

const PORT = 5000
const app = express()
app.use(cors())
app.use(express.json())
app.listen(PORT, () => console.log(`Running on port ${PORT}`))

app.post("/sign-up", (req, res) => {
    const user = req.body
    serverUsers.push(user)
    console.log(serverUsers);
    res.send("OK")
})

app.post("/tweets", (req, res) => {
    const fullTweet = req.body
    const userRegistered = serverUsers.find(item => item.userName === fullTweet.userName)
    
    if(userRegistered) {
        serverTweets.push(fullTweet.tweet)
        console.log(serverTweets);
        return res.send("OK") 
    }
    res.send("UNAUTHORIZED")
})

app.get("/tweets", (req, res) => {

})
