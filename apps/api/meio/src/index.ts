import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { swaggerUI } from '@hono/swagger-ui'
import { meioRoutes, meioOpenApiConfig } from './routes'

const app = new OpenAPIHono()

app.use('*', cors())
app.use('*', etag())

app.get('/', (c) => {
	return c.redirect('/docs')
})

app.get('/docs', swaggerUI({ url: '/openapi.json' }))

app.doc('/openapi.json', meioOpenApiConfig)

app.route('/', meioRoutes)

export default app
export { meioRoutes, meioOpenApiConfig }
