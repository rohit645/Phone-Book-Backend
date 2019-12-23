const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url, {useNewUrlParser: true})
    .then(response => {
        console.log('Database connection made!!')
    })
    .catch(error => {
        console.log('Unable to connect to database!!', error.message)
    })

const phoneBookSchema = new mongoose.Schema({
    name: String,
    phoneNumber: Number
})

phoneBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', phoneBookSchema)