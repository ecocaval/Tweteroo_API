import express from "express"
import cors from "cors"
import chalk from "chalk"
import { v4 as uuidv4 } from 'uuid';

const PORT = 5000
const app = express()

const serverUsers = []
const serverTweets = []
const serverTokens = []

let allTweets = []
let pageTweets = []

app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    console.log(chalk.yellow(`Running on port ${PORT}\n`))
    console.log(chalk.blue(`Aulinha para `) + chalk.blue(`Faetec!!! Boa noite!`))
})

app.post("/sign-up", (req, res) => {
    const user = req.body

    if (!user.username || !user.avatar) {
        return res.status(400).send("Todos os campos são obrigatórios!")
    }

    if (!user.password || !user.passwordConfirmation) {
        return res.status(400).send("O campo de senha é obrigatório!")
    }

    if (user.password !== user.passwordConfirmation) {
        return res.status(400).send("As senhas enviadas não coincidem!")
    }

    const inputsAreStrings = (
        typeof user.username === "string" && 
        typeof user.avatar === "string" &&
        typeof user.password === "string" && 
        typeof user.passwordConfirmation === "string" 
    )

    const userAlreadyExists = serverUsers.filter(user_ => {
        return user_.username == user.username
    }).length !== 0

    if(!!userAlreadyExists) {
        return res.status(409).send("Usuário já cadastrado!")
    }

    if (!inputsAreStrings) {
        return res.sendStatus(400)
    }

    serverUsers.push(user)

    res.status(201).send("OK")
})

app.post("/sign-in", (req, res) => {
    const {username, password} = req.body

    const [user] = serverUsers.filter(user => {
        return user.username === username
    })

    if(user.length === 0) {
        return res.status(404).send("Usuário não encontrado!")
    }

    if(user.password !== password) {
        return res.status(401).send("Senha incorreta!")
    }

    const token = uuidv4()

    serverTokens.push(token);

    res.status(201).send({token})
})

app.post("/tweets", (req, res) => {

    const fullTweet = req.body
    const { user } = req.headers

    if (!fullTweet.tweet) return res.status(400).send("Todos os campos são obrigatórios!")

    if (!(typeof fullTweet.tweet === "string")) return res.sendStatus(400)

    if (user) {
        const userRegistered = serverUsers.find(item => item.username === user)

        if (userRegistered) {
            serverTweets.push({username: user, tweet: fullTweet.tweet})
            return res.status(201).send("OK")
        }
        return res.status(401).send("UNAUTHORIZED")
    }

    const userRegistered = serverUsers.find(item => item.username === fullTweet.username)

    if (userRegistered) {
        serverTweets.push(fullTweet)
        return res.status(201).send("OK")
    }

    return res.status(401).send("UNAUTHORIZED")
})

app.get("/tweets", (req, res) => {

    let dividedTweets = []

    const { query } = req
    const urlPage = Number(query.page)

    if (urlPage <= 0) return res.status(400).send("Informe uma página válida!")

    allTweets = [...serverTweets].reverse()

    if (allTweets) {

        if (!urlPage) {
            pageTweets = addAvatarToTweets(allTweets.slice(0, 10))
            return res.send(pageTweets)
        }

        if (allTweets.length > 10) {
            dividedTweets = divideTweets(allTweets, 10)

            if (dividedTweets) pageTweets = addAvatarToTweets(dividedTweets[urlPage])

            if (pageTweets) return res.send(pageTweets)
            else return res.send([])
        } else {
            pageTweets = addAvatarToTweets(allTweets)
            return res.send(pageTweets)
        }
    }
})

app.get("/users", (req, res) => {
    const {token} = req.headers;

    if(!serverTokens.includes(token)) {
        return res.status(401).send("Token inválido!")
    }
    
    return res.send(serverUsers);
})

app.get("/tweets/:username", (req, res) => {
    const { username } = req.params

    allTweets = addAvatarToTweets(serverTweets.reverse())

    const userTweets = allTweets.filter(item => (item.username === username))

    res.send(userTweets)
})

app.get("/faetec-2023", (req, res) => {
    res.send({text: "Obrigado por assistirem a aula!"})
})


function addAvatarToTweets(refTweets) {

    if (!refTweets) return

    const refTweetsWithAvatar = refTweets.map(item => {
        const nameAndAvatar = serverUsers.find(_item => _item.username === item.username)
        return {
            username: item.username,
            avatar: nameAndAvatar.avatar,
            tweet: item.tweet
        }
    })
    return refTweetsWithAvatar
}

function divideTweets(tweetsToDivide, arrSize) {
    const dividedTweets = []

    let mainCounter = 1 // starts with 1 to match urlPage when loading tweets
    let auxCounter = 0

    for (let i = 0; i < tweetsToDivide.length; i += arrSize) {
        dividedTweets[mainCounter] = []
        do {
            dividedTweets[mainCounter].push(tweetsToDivide[auxCounter])
            auxCounter++
        } while (dividedTweets[mainCounter].length < arrSize && tweetsToDivide[auxCounter])
        mainCounter++
    }
    return dividedTweets
}