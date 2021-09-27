const server = require('src/server')
const users = require('src/db/users.json')
const data = require('src/db/data.json')

server(8081, { users, data })