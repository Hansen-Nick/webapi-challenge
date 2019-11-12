express = require('express')
const morgan = require('morgan')
server = express();
const projectRoute = require('./data/routes/projectRoute')
const actionRoute = require('./data/routes/actionRoute')

server.use(express.json())
server.use(morgan('short'))

server.get('/', (req, res) => {
  res.send('Welcome to the back end!')
})

server.use('/projects', projectRoute)
server.use('/actions', actionRoute)







module.exports = server;