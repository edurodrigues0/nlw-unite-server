import { FastifyInstance } from 'fastify'
import { prisma } from '../../../services/prisma'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { EventNotFoundError } from '../../errors/event-not-found'

export async function remove(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/events/:eventId',
    {
      schema: {
        summary: 'Delete an event',
        tags: ['events'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.null(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },

    async (request, reply) => {
      const { eventId } = request.params

      try {
        const event = await prisma.event.findFirst({
          where: {
            id: eventId,
          },
        })

        if (!event) {
          throw new EventNotFoundError()
        }

        await prisma.event.delete({
          where: {
            id: eventId,
          },
        })

        return reply.status(200).send()
      } catch (error) {
        if (error instanceof EventNotFoundError) {
          reply.status(404).send({
            message: error.message,
          })
        }
      }
    },
  )
}
