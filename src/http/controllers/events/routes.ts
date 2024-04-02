import { FastifyInstance } from 'fastify'
import { create } from './create-controller'
import { remove } from './remove-controller'
import { list } from './list-controller'
import { get } from './get-controller'
import { edit } from './edit-controller'

export async function eventsRoutes(app: FastifyInstance) {
  app.post('/events', create)

  app.get('/events', list)
  app.get('/events/:id', get)

  app.put('/events/:id', edit)

  app.delete('/events/:id', remove)
}
