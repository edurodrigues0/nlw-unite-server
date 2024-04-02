import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../../../services/prisma'
import z from 'zod'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const removeEventParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = removeEventParamsSchema.parse(request.params)

  try {
    const event = await prisma.event.findFirst({
      where: {
        id,
      },
    })

    if (!event) {
      throw new Error('Evento não encontrado.')
    }

    await prisma.event.delete({
      where: {
        id,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      reply.status(400).send({
        message: error.message,
      })
    }
  }

  return reply.status(200).send()
}
