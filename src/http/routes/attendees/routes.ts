import { FastifyInstance } from 'fastify'
import { list } from './list'
import { registerIn } from './register-in'
import { getAttendeeBadge } from './get-attendee-badge'

export async function AttendeeRoutes(app: FastifyInstance) {
  app.register(list)
  app.register(registerIn)
  app.register(getAttendeeBadge)
}
