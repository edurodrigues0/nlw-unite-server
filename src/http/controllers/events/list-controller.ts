import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../services/prisma'
import z from 'zod'

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listEventsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = listEventsQuerySchema.parse(request.query)

  const events = await prisma.event.findMany({
    take: 20,
    skip: (page - 1) * 20,
  })

  return reply.status(200).send({
    events,
  })
}
