import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'
import { get } from './get'
import { getAttendeeBadge } from './get-attendee-badge'
import { edit } from './edit'
import { remove } from './remove'

export async function EventRoutes(app: FastifyInstance) {
  app.register(create)
  app.register(list)
  app.register(get)
  app.register(getAttendeeBadge)
  app.register(edit)
  app.register(remove)
}
