
//import Fastify from 'fastify'
//NODE.js
const path = require('path')
const fastify = require('fastify')({
  logger: true
})

// Registrar el plugin para servir archivos estáticos desde la carpeta raíz
fastify.register(require('@fastify/static'), {
  root: __dirname,
  prefix: '/', // Servir archivos en la raíz
})

// Opcional: Redirigir '/' a 'index.html'
fastify.get('/', function (request, reply) {
  reply.sendFile('html/menu.html')
})


// Run the server!
fastify.listen({ port: 3004 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})


/* //import Fastify from 'fastify'
//NODE.js
const fastify = require('fastify')({
  logger: true
})

// Registrar plugin para archivos estáticos
fastify.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})


// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
*/