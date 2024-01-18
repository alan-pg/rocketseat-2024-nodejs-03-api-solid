import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(req: FastifyRequest, reply: FastifyReply) {
  await req.jwtVerify({ onlyCookie: true })

  const { role, sub: userId } = req.user

  const token = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: userId,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub: userId,
        expiresIn: '7d',
      },
    },
  )
  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({ token })
}
