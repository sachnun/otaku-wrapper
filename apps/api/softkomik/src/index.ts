import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { swaggerUI } from '@hono/swagger-ui'
import { softkomikRoutes } from './routes'
import { softkomikOpenApiSpec } from './openapi'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

app.onError((err, c) => {
  console.error('Error:', err.message)
  return c.json({
    success: false,
    error: err.message || 'Internal server error'
  }, 500)
})

app.get('/docs', swaggerUI({ url: '/openapi.json' }))

app.get('/openapi.json', (c) => c.json(softkomikOpenApiSpec))

app.get('/', (c) => c.redirect('/docs'))

app.route('/api', softkomikRoutes)

export default app
export { softkomikRoutes, softkomikOpenApiSpec }
