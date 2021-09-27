const express = require('express')
const app = express()
const port = 8081
const users = require('src/db/users.json')
const data = require('src/db/data.json')

function auth(req, res, next) {
  const apiKey = req.headers['x-api-key']
  if (!apiKey || !users.find(user => user.token === apiKey)) {
    res.status(401).end()
    return
  }
  next()
}

app.use(express.json())

app.post('/login', function (req, res) {
  const user = users.find(user => {
    return user.username === req.body.user && user.password === req.body.password
  })
  if (!user) {
    res.status(401).end()
    return
  }
  res.json({
    token: user.token
  })
})

app.get('/data', auth, function (req, res) {
  res.json(data)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})