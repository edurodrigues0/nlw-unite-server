import { FastifyInstance } from 'fastify'
import { prisma } from '../../../services/prisma'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { AttendeesNotFoundError } from '../../errors/attendees-not-found'

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:attendeeId/badge',
    {
      schema: {
        summary: 'Get an attendee badge',
        tags: ['attendees'],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              event_title: z.string(),
              check_in_url: z.string().url(),
            }),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params

      try {
        const attendee = await prisma.attendee.findUnique({
          select: {
            name: true,
            email: true,
            event: {
              select: {
                title: true,
              },
            },
          },
          where: {
            id: attendeeId,
          },
        })

        if (attendee === null) {
          throw new AttendeesNotFoundError()
        }

        const baseURL = `${request.protocol}://${request.hostname}`

        const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

        return reply.status(200).send({
          badge: {
            name: attendee.name,
            email: attendee.email,
            event_title: attendee.event.title,
            check_in_url: checkInURL.toString(),
          },
        })
      } catch (error) {
        if (error instanceof AttendeesNotFoundError) {
          return reply.status(404).send({
            message: error.message,
          })
        }
      }
    },
  )
}
