import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../services/prisma'
import z from 'zod'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const editEventParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const editEventBodySchema = z.object({
    title: z.string().min(4).max(56).optional(),
    details: z.string().nullable().optional(),
    maximumAttendees: z.number().int().positive().nullable().optional(),
  })

  const { id } = editEventParamsSchema.parse(request.params)
  const { title, details, maximumAttendees } = editEventBodySchema.parse(
    request.body,
  )

  const event = await prisma.event.findUnique({
    where: {
      id,
    },
  })

  if (!event) {
    throw new Error('Evento não encontrado.')
  }

  const updatedEvent = await prisma.event.update({
    where: {
      id,
    },
    data: {
      title,
      details,
      maximumAttendees,
    },
  })

  return reply.status(200).send({
    event: updatedEvent,
  })
}
