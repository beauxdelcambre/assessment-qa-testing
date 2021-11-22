const express = require('express')
const path = require('path')
const app = express()
const {bots, playerRecord} = require('./data')
const {shuffleArray} = require('./utils')

app.use(express.static("public"));

app.get("/styles", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.css"));
});
app.get("/js", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.js"));
});

app.use(express.json())

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        res.status(200).send({choices, compDuo})
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        res.sendStatus(400)
    }
})


var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '07ec9afc67a04a33881e03fa5973f3ad',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

app.get("/", (req, res) => {
    rollbar.info("Someone tapped the API");
    res.send("API hit");
})

app.put("/put", (req, res) => {
    rollbar.info("Put request attempted");
    res.send("update");
});

app.post("/post", (req, res) => {
    console.log(req.body)
    
    rollbar.info("Post request attempted");
    db('BOTS')
    .insert(bots)
    .then(id => res.status(200).json(id))
    .catch(err => {
        console.log(err);
        rollbar.error(err);
        res.status(500).send(err);
    })
    res.send("post data");
});

app.delete("/delete", (req, res) => {
    rollbar.info("Delete request attempted");
    res.send("delete data");
});

rollbar.log('Hello world!')

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})