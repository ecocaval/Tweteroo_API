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
    res.send("OK")
})

app.post("/tweets", (req, res) => {
    const fullTweet = req.body
    const userRegistered = serverUsers.find(item => item.username === fullTweet.username)
    
    if(userRegistered) {
        serverTweets.push(fullTweet)
        return res.send("OK") 
    }

    res.send("UNAUTHORIZED")
})

app.get("/tweets", (_, res) => {
    let lastTweets = []
    let recentTweets = serverTweets.reverse()

    if(recentTweets) {
        if(recentTweets.length > 10) {
            recentTweets = recentTweets.slice(0, 10)
        }
    
        lastTweets = recentTweets.map(item => {
            const nameAndAvatar = serverUsers.find(_item => _item.username === item.username)
    
            return {
                username: item.username,
                avatar: nameAndAvatar.avatar,
                tweet: item.tweet
            }
        })
        res.send(lastTweets)
    }  
})
