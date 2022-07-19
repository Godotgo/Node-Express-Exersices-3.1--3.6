const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const bodyParser = require('body-parser');
const { response } = require('express');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({extended: true}))



const date = new Date()
let persons = [{ 
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
  }]

app.use(cors);


const generateID = () =>{
    const maxId = persons.length>0
        ? Math.max(...persons.map(n =>n.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (req,res) =>{
    const body = req.body
    if(!body.content){
        return res.status(400).json({
            error: 'content missing'
        })
    }
    const person = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    persons = persons.concat(person)

    res.json(person)
})

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/index.html')
})

app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/api/info',(req,res)=>{
    res.json(`Phone book has ${persons.length} people <br> ${date} `)
})

app.get('/api/persons/:id',(req,res)=>{
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id )

    if(person){
        res.json(person)
    }else{
        res.json(404).end()
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const id = req.params.id
    console.log(id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

