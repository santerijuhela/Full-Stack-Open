const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json())

morgan.token('data', (request) => {
    return JSON.stringify(request.body)
})

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

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `)
        
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
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
    else if(persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    
    const person = {
        id: String(Math.floor(Math.random() * 1000000 + 1)),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})