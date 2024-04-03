import { FastifyInstance } from 'fastify'
import { prisma } from '../../../services/prisma'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { EventNotFoundError } from '../../errors/event-not-found'

export async function get(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId',
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximum_attendees: z.number().int().nullable(),
              attendees_amount: z.number().int(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params

      try {
        const event = await prisma.event.findUnique({
          select: {
            id: true,
            title: true,
            slug: true,
            details: true,
            maximumAttendees: true,
            _count: {
              select: {
                attendees: true,
              },
            },
          },
          where: {
            id: eventId,
          },
        })

        if (event === null) {
          throw new EventNotFoundError()
        }

        return reply.send({
          event: {
            id: event.id,
            title: event.title,
            slug: event.slug,
            details: event.details,
            maximum_attendees: event.maximumAttendees,
            attendees_amount: event._count.attendees,
          },
        })
      } catch (error) {
        if (error instanceof EventNotFoundError) {
          return reply.status(404).send({
            message: error.message,
          })
        }
      }
    },
  )
}
