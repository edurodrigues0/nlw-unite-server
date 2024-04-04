import { FastifyInstance } from 'fastify'
import { prisma } from '../../../services/prisma'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { EventNotFoundError } from '../../errors/event-not-found'

export async function edit(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/events/:eventId',
    {
      schema: {
        summary: 'Edit an event',
        tags: ['events'],
        params: z.object({
          eventId: z.string(),
        }),
        body: z.object({
          title: z.string().min(4).max(56).optional(),
          details: z.string().optional(),
          maximumAttendees: z.number().int().optional(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximum_attendees: z.number().int().nullable(),
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
      const { title, details, maximumAttendees } = request.body

      try {
        const event = await prisma.event.findUnique({
          where: {
            id: eventId,
          },
        })

        if (!event) {
          throw new EventNotFoundError()
        }

        const updatedEvent = await prisma.event.update({
          where: {
            id: eventId,
          },
          data: {
            title,
            details,
            maximumAttendees,
          },
        })

        return reply.status(200).send({
          event: {
            id: updatedEvent.id,
            title: updatedEvent.title,
            details: updatedEvent.details,
            slug: updatedEvent.slug,
            maximum_attendees: updatedEvent.maximumAttendees,
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
