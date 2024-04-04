import { FastifyInstance } from 'fastify'
import { prisma } from '../../../services/prisma'
import { generateSlug } from '../../../utils/generate-slug'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { AnotherEventWithSameTitleAlreadyExistsError } from '../../errors/another-event-with-same-title-already-exists-error'

export async function create(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events',
    {
      schema: {
        summary: 'Create an event',
        tags: ['events'],
        body: z.object({
          title: z.string().min(4).max(56),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            event_id: z.string().uuid(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body

      try {
        const slug = generateSlug(title)

        const eventWithSameSlug = await prisma.event.findUnique({
          where: {
            slug,
          },
        })

        if (eventWithSameSlug) {
          throw new AnotherEventWithSameTitleAlreadyExistsError()
        }

        const event = await prisma.event.create({
          data: {
            title,
            details,
            maximumAttendees,
            slug,
          },
        })

        return reply.status(201).send({
          event_id: event.id,
        })
      } catch (error) {
        if (error instanceof AnotherEventWithSameTitleAlreadyExistsError) {
          reply.status(409).send({
            message: error.message,
          })
        }
      }
    },
  )
}
