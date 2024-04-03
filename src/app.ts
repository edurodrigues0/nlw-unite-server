import fastify from 'fastify'
import { env } from 'process'
import { ZodError } from 'zod'
import {
  validatorCompiler,
  serializerCompiler,
} from 'fastify-type-provider-zod'
import { EventRoutes } from './http/routes/events/routes'

export const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(EventRoutes)

app.setErrorHandler((error, _ /* request */, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
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
