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
          page: z.string().nullable().default('1').transform(Number),
        }),
        response: {
          200: z.object({
            events: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                slug: z.string(),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page } = request.query

      const events = await prisma.event.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
        },
        take: 20,
        skip: (page - 1) * 20,
      })

      return reply.status(200).send({
        events,
      })
    },
  )
}
