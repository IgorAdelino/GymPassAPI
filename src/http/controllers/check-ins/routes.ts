import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../../middlewares/verify-jwt'
import { create } from './create'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT) // mesma coisa que um middleware

  app.post('/gyms/:gymId/check-ins', create)
}
