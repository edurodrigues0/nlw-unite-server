import fastify from 'fastify'

import fastifySwagger from '@fastify/swagger'

import { ZodError } from 'zod'
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import { EventRoutes } from './http/routes/events/routes'
import { AttendeeRoutes } from './http/routes/attendees/routes'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { env } from './env'
import fastifyCors from '@fastify/cors'

export const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'pass.in',
      description:
        'Especificação da API para o back-end da aplicação pass.in constuída durante o NLW Unite da Rocketseat.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/documentation',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(EventRoutes)
app.register(AttendeeRoutes)

app.setErrorHandler((error, _ /* request */, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.flatten().fieldErrors,
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({
    message: 'Internal server error.',
  })
})
