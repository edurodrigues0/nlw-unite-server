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
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          200: z.object({
            attendee: z.object({
              name: z.string(),
              email: z.string(),
              event: z.object({
                title: z.string(),
              }),
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

        return reply.status(200).send({
          attendee,
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
