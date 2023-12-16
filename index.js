require('dotenv').config()
const express = require('express')
//const mongoose = require('mongoose')
const Person = require('./models/person')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))


app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {


  Person.find({}).then(persons => {
    response.json(persons)
  })
  .catch(error => {
    console.log(error)
    response.status(400).end()
  })
 // response.json(persons)
})

app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})



app.post('/api/persons', (request, response, next) => {
  const body = request.body


//mongoose.set('strictQuery', false)
//mongoose.connect(url)

  if (!body.name || body.name == '') {
    return response.status(400).json({ 
      error: 'Name is missing' 
    })
  }

  if (!body.number || body.number == '') {
    return response.status(400).json({ 
      error: 'Number is missing' 
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(result => {
    
    Person.find({}).then(persons => {
      response.json(persons)
      //mongoose.connection.close()
    })
  })
  .catch(error => next(error))

})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response) => {

  const t = new Date()

  response.send("Phonebook has info for " + persons.length + " people. <br/>" + t.toDateString() + " " + t.toTimeString())
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

