const express = require('express')
const app = express()

function auth(req, res, next) {
  const {users} = req.app.locals
  const apiKey = req.headers['x-api-key']
  if (!apiKey || !users.find(user => user.token === apiKey)) {
    res.status(401).end()
    return
  }
  next()
}

app.use(express.json())

app.post('/login', function (req, res) {
  const {users} = req.app.locals
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
  res.json(req.app.locals.data)
})

module.exports = function (port, locals = {}, host = 'localhost') {
  app.locals = {...app.locals, ...locals}
  return app.listen(port, host, (err) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`Api listening at http://localhost:${port}`)
  })
}
