import { FastifyInstance } from 'fastify'
import { prisma } from '../../../services/prisma'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function list(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events',
    {
      schema: {
        summary: 'List events',
        tags: ['events'],
        querystring: z.object({
          query: z.string().optional(),
          page: z.string().nullable().default('1').transform(Number),
        }),
        response: {
          200: z.object({
            events: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                details: z.string().nullish(),
                slug: z.string(),
                maximum_attendee: z.number().int().nullish(),
                attendee_registered: z.number().int().nullish(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, query } = request.query

      const events = await prisma.event.findMany({
        where: {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
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
        take: 20,
        skip: (page - 1) * 20,
      })

      return reply.status(200).send({
        events: events.map((event) => {
          return {
            id: event.id,
            title: event.title,
            details: event.details,
            slug: event.slug,
            maximum_attendee: event.maximumAttendees,
            attendee_registered: event._count.attendees,
          }
        }),
      })
    },
  )
}
