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
    const { username, avatar } = req.body

    if(!username || !avatar) {
        return res.status(400).send("Todos os campos são obrigatórios!")
    }

    const inputsAreEmpty = !username || !avatar
    const inputsAreStrings = (typeof username === "string" && typeof avatar === "string")

    if (inputsAreEmpty || !inputsAreStrings) {
        return res.sendStatus(400)
    }

    serverUsers.push(user)
    res.send("OK")
})

app.post("/tweets", (req, res) => {
    const { tweet } = req.body
    const fullTweet = req.body

    const tweetIsEmpty = !tweet
    const tweetIsString = (typeof tweet === "string")

    if(tweetIsEmpty) {
        return res.status(400).send("Todos os campos são obrigatórios!")
    }

    if (!tweetIsString) {
        return res.sendStatus(400)
    }

    const userRegistered = serverUsers.find(item => item.username === fullTweet.username)

    if (userRegistered) {
        serverTweets.push(fullTweet)
        return res.send("OK")
    }

    res.send("UNAUTHORIZED")
})

app.get("/tweets", (_, res) => {
    let lastTweets = []
    let recentTweets = serverTweets.reverse()

    if (recentTweets) {
        if (recentTweets.length > 10) {
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
