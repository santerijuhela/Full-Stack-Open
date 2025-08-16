require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('data', (request) => {
    return JSON.stringify(request.body)
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('dist'))
app.use(express.json())
/* app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data')) */

/* Only have the data of the request in POST requests */
app.use(morgan((tokens, req, res) => {
    const normal =
        [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ')
    
        if(req.method === 'POST') {
            return `${normal} ${tokens.data(req, res)}`
        } else {
            return normal
        }
}))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) =>{
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }  
        })
        .catch(e => next(e))
})

app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
        response.send(`
            <p>Phonebook has info for ${count} people</p>
            <p>${new Date()}</p>
        `)
    })     
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(e => next(e))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    else if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then(updatedPerson => {
                response.json(updatedPerson)
            })
        })
        .catch(e => next(e))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})