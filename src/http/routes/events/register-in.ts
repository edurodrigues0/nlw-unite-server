import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { prisma } from '../../../services/prisma'
import { EmailAlreadyRegisteredInEventError } from '../../errors/email-already-registered-in-event'
import { LimitOfAttendeesExceededError } from '../../errors/limit-of-attendees-exceeded'

export async function registerIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/attendees',
    {
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendee_id: z.number(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { name, email } = request.body

      try {
        const attendeeFromEmail = await prisma.attendee.findUnique({
          where: {
            eventId_email: {
              email,
              eventId,
            },
          },
        })

        if (attendeeFromEmail !== null) {
          throw new EmailAlreadyRegisteredInEventError()
        }

        const [event, amountOfAttendeesForEvent] = await Promise.all([
          prisma.event.findUnique({
            where: {
              id: eventId,
            },
          }),
          await prisma.attendee.count({
            where: {
              eventId,
            },
          }),
        ])

        if (
          event?.maximumAttendees &&
          amountOfAttendeesForEvent >= event?.maximumAttendees
        ) {
          throw new LimitOfAttendeesExceededError()
        }

        const attendee = await prisma.attendee.create({
          data: {
            name,
            email,
            eventId,
          },
        })

        return reply.status(201).send({ attendee_id: attendee.id })
      } catch (error) {
        if (error instanceof EmailAlreadyRegisteredInEventError) {
          return reply.status(409).send({ message: error.message })
        }
        if (error instanceof LimitOfAttendeesExceededError) {
          return reply.status(409).send({ message: error.message })
        }
      }
    },
  )
}
