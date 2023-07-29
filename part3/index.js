const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

morgan.token('content', function (request) { return JSON.stringify(request.body) })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

const errorHandler = (error, request, response, next) => {
    console.log(error)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
        "id": 5,
        "name": "Balls Mcgee",
        "number": "1-4"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(result => {
        console.log(result)
        if (result) {
            response.json(result)
        } else {
            response.status(404).end()
        }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(err =>next(err))
})

app.get('/info', (request, response) => {
    const today = new Date()
    Person.find({}).then(result => {
        response.send(`<p>Phonebook has info for ${result.length} people </p> <p>${today}</p>`)
    })
})

// const generateID = () => {
//     const maxId = persons.length > 0 
//     ? Math.max(...persons.map(person => person.id)) 
//     : 0
//     return maxId + 1
// }

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log(body)

    // if (!body.name) {
    //     return response.status(400).json({
    //         error: 'name missing'
    //     })
    // } else if (!body.number) {
    //     return response.status(400).json({
    //         error: 'number missing'
    //     })
    // }
    //  else if (persons.find(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: 'person already exists'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
    .then(savedPerson => {
        console.log(savedPerson)
        response.json(savedPerson)
    })
    .catch(err => next(err))
    
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query'})
    .then(updated => {
        response.json(updated)
    })
    .catch(err => next(err))
})

// 
const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
