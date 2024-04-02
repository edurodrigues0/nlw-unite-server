import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../../services/prisma";
import z from "zod";
import { generateSlug } from "../../../utils/generate-slug";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createEventSchema = z.object({
    title: z.string().min(4).max(56),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  })

  const { title, details, maximumAttendees} = createEventSchema.parse(request.body)

  const slug = generateSlug(title)

  const event = await prisma.event.create({
    data: {
      title,
      details,
      maximumAttendees,
      slug,
    }
  })

  return reply.status(201).send({
    event_id: event.id
  })
}