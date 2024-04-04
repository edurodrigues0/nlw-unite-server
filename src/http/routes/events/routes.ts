import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'
import { get } from './get'
import { edit } from './edit'
import { remove } from './remove'
import { checkIn } from './check-in'

export async function EventRoutes(app: FastifyInstance) {
  app.register(create)
  app.register(list)
  app.register(get)
  app.register(edit)
  app.register(remove)

  app.register(checkIn)
}
