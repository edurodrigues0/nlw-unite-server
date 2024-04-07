import { FastifyInstance } from 'fastify'
import { prisma } from '../../../services/prisma'
import z from 'zod'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

export async function list(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:eventId',
    {
      schema: {
        summary: 'List attendees',
        tags: ['attendees'],
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          query: z.string().nullish(),
          page: z.string().nullable().default('1').transform(Number),
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number().int(),
                name: z.string(),
                email: z.string().email(),
                created_at: z.date(),
                check_in_at: z.date().nullable(),
              }),
            ),
            pagination: z.object({
              pageIndex: z.number(),
              totalItems: z.number(),
              pageItems: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { page, query } = request.query

      const attendees = await prisma.attendee.findMany({
        where: query
          ? {
              eventId,
              name: {
                contains: query,
                mode: 'insensitive',
              },
            }
          : {
              eventId,
            },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          checkIn: {
            select: {
              createdAt: true,
            },
          },
        },
        take: 10,
        skip: (page - 1) * 10,
        orderBy: {
          createdAt: 'desc',
        },
      })

      const totalItems = await prisma.attendee.count({
        where: query
          ? {
              eventId,
              name: {
                contains: query,
                mode: 'insensitive',
              },
            }
          : {
              eventId,
            },
      })

      return reply.status(200).send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            name: attendee.name,
            email: attendee.email,
            created_at: attendee.createdAt,
            check_in_at: attendee.checkIn?.createdAt ?? null,
          }
        }),
        pagination: {
          totalItems,
          pageIndex: page,
          pageItems: 10,
        },
      })
    },
  )
}
