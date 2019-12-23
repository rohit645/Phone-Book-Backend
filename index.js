require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.port
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const TOKEN = ":method :url :status :res[content-length] - :response-time ms :contact"
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

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

app.get('/persons', (req, res, next) => {
    console.log('Hey i am here')
    Person
    .find({})
    .then(persons => {
        res.json(persons.map(person => person.toJSON()))    
    })
    .catch(error => next(error))
})

app.get('/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(result => {
            res.json(result.toJSON())
        })
        .catch(error => next(error))
})

app.post('/persons', (req, res, next) => {
    const body = req.body
    morgan.token('contact', (req, res) => JSON.stringify(req.body))
    const person = new Person({
        name: body.name,
        phoneNumber: body.phoneNumber
    })
    person.save()
        .then(savedNote => {
            console.log('Note saved succesfully!!')
            res.json(savedNote.toJSON())
        }) 
        .catch(error)
})

app.delete('/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(response => {
            res.status(204).end()
        })
        .catch(error => {
            error => next(error)
        })
}) 

app.listen(port, () => {
    console.log(`server listening to port ${port}`)
})

const unknownEndPoint = (req, res) => {
    res.status(404).send({error: 'Unknown Endpoint'})
}

app.use(unknownEndPoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } 
    next(error)
}
app.use(errorHandler)