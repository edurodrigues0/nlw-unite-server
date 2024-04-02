import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../services/prisma";
import z from "zod";
import events from "events";

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const listEventsParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = listEventsParamsSchema.parse(request.params)
  
  try {
    const event = await prisma.event.findUnique({
      where: {
        id
      }
    })
  
    if (!event) {
      throw new Error('Evento não encontrado.')
    }
  
    return reply.status(200).send({
      event
    })
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(400).send({
        message: error.message
      })
    }
  }
}