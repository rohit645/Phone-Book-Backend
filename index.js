const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

const TOKEN = ":method :url :status :res[content-length] - :response-time ms :contact"

var phoneBook = [
    {
        "name": "Rohit ",
        "number": "1235",
        "id": 1
      },
      {
        "name": "tohit ",
        "number": "236",
        "id": 2
      },
      {
        "name": "Lohit ",
        "number": "23347",
        "id": 3
      },
]


const requestLogger = (req, res, next) => {
    console.log('Method: ', req.method)
    console.log('Path: ', req.path)
    console.log('Body: ', req.body)
    console.log('---');
    next()
}
app.use(requestLogger)

// reset morgan to defaulat after post request
const resetMorgan = (req, res, next) => {
    morgan.token("contact", (req, res) => "")
    next()
}
app.use(resetMorgan)


// temperory morgan token
morgan.token("contact", (req, res) => "")
app.use(morgan(TOKEN))

app.get('/info', (req, res) => {
    console.log('some asking for info')
    const s1 = `There are total ${phoneBook.length} contacts`
    console.log(s1)
    const date = new Date()
    res.send(`${s1} <br> ${date}`)
})

app.get('/persons', (req, res) => {
    console.log('some asking for persons')
    res.json(phoneBook)
})

app.get('/persons/:id', (req, res) => {
    console.log('some asking for particular info')
    const id = Number(req.params.id)
    console.log('id', id);
    const person = phoneBook.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end('not found')
    }
})

app.post('/persons', (req, res) => {
    console.log('someone made  a post request')
    const body = req.body
    morgan.token('contact', (req, res) => JSON.stringify(req.body))
    var exists = false
    phoneBook.forEach(ele => {
        if(ele.name === body.name) {
          exists = true  
        }
    });
    if (exists) {
        res.status(303).end('entry arleady found')
    } else {
        const id = Math.floor(Math.random() * 1000)
        body.id = id
        phoneBook.push(body)
        console.log(phoneBook);
        res.json(body)
    }    
})

app.delete('/persons/:id', (req, res) => {
    console.log('someone is delter a person')
    const id = Number(req.params.id)
    const note = phoneBook.find(person => person.id === id)
    if(note) {
        phoneBook = phoneBook.filter(person => person.id !== id)
        console.log('phoneBook', phoneBook)
        res.status(204).end('deleted successfully')
    } else {
        res.status(404).end('not found')
    }
}) 

app.listen(port, () => {
    console.log(`server listening to port ${port}`)
})

const unknownEndPoint = (req, res) => {
    res.status(404).send({error: 'Unknown Endpoint'})
}

app.use(unknownEndPoint)    