const fetch = require('node-fetch')
const server = require('src/server')

const users = [
  {
    "username": "admin",
    "password": "Admin123",
    "token": "7a55204fb9d7076b6d73b3bc5d8ed2849d86a26e"
  }
]

const data = [
  {
    "id": 1,
    "text": "First"
  },
  {
    "id": 2,
    "text": "Second"
  }
]

const port = 3000
const getUrl = (path) => `http://localhost:${port}/${path}`

describe('test api calls', function (){
  let serverInstance

  beforeAll((done) => {
    serverInstance = server(port, { users, data })
    serverInstance.on('listening', () => done())
    serverInstance.on('error', done)
  });

  afterAll(() => {
    try {
      serverInstance.close()
    } catch (e) {}
  });

  test('test /login post', () => {
    return fetch(getUrl('login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: 'admin',
        password: 'Admin123'
      })
    }).then(function (response) {
      return response.json()
    }).then(function (json) {
      expect(json).toEqual({token: '7a55204fb9d7076b6d73b3bc5d8ed2849d86a26e'})
    })
  });

  test('test /login post 401 Unauthorized', () => {
    return fetch(getUrl('login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(function (response) {
      expect(response.status).toEqual(401)
    })
  });

  test('test /data get', () => {
    return fetch(getUrl('data'), {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '7a55204fb9d7076b6d73b3bc5d8ed2849d86a26e'
      }
    }).then(function (response) {
      return response.json()
    }).then(function (json) {
      expect(json).toEqual(data)
    })
  })

  test('test /data get 401 Unauthorized', () => {
    return fetch(getUrl('data'), {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ''
      }
    }).then(function (response) {
      expect(response.status).toEqual(401)
    })
  })
})

