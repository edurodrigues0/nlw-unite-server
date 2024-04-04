import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { prisma } from '../../../services/prisma'
import { AttendeeAlreadyCheckInError } from '../../errors/attendee-already-check-in'

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:attendeeId/check-in',
    {
      schema: {
        summary: 'Check-in an attendee',
        tags: ['check-ins', 'events'],
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response: {
          201: z.null(),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params

      try {
        const attendeeCheckIn = await prisma.checkIn.findUnique({
          where: {
            attendeeId,
          },
        })

        if (attendeeCheckIn !== null) {
          throw new AttendeeAlreadyCheckInError()
        }

        await prisma.checkIn.create({
          data: {
            attendeeId,
          },
        })

        return reply.status(201).send()
      } catch (error) {
        if (error instanceof AttendeeAlreadyCheckInError) {
          return reply.status(409).send({
            message: error.message,
          })
        }
      }
    },
  )
}
