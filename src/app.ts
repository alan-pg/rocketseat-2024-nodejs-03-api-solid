import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'

import { ZodError } from 'zod'
import { error } from 'console'
import { env } from './env'
import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'refreshToken', signed: false },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.setErrorHandler((err, _, replay) => {
  if (err instanceof ZodError) {
    return replay
      .status(400)
      .send({ message: 'Validation error.', issues: err.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // log to external tools
  }

  return replay.status(500).send({ message: 'Internal server error.' })
})
