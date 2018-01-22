const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const io = require('./lib/sockets')
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// use socket.io

const port = 8000
io.listen(port)
console.log('listening on port ', port)
