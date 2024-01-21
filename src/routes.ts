import http from 'http'

import Hero from '~/entities/hero'
import heroFactory from '~/factories/heroFactory'

type tStartRoutesProps = {
  port : number
}

type tRequest = http.IncomingMessage & {
  query : { id : number }
}

type tRoutes = {
  [key:string] : (request : tRequest, response : http.ServerResponse) => Promise<http.ServerResponse | undefined>
}

const DEFAULT_HEADER = {
  'Content-Type': 'application/json'
}

const heroService = heroFactory()

const routes : tRoutes = {
  default: async (request, response) => {
    response.writeHead(404, DEFAULT_HEADER)
    return response.end()
  },
  '/heroes:get': async (request, response) => {
    const heroes = await heroService.find(request.query.id)
    response.write(JSON.stringify({ heroes }))
    return response.end()
  },
  '/heroes:post': async (request, response) => {
    try {
      for await (const data of request) {
        const hero = new Hero(JSON.parse(data))
        const { isValid, error } = hero.isValid()
        if (isValid) {
          const id = await heroService.create(hero)
          response.writeHead(201, DEFAULT_HEADER)
          response.write(JSON.stringify({ id }))
        }
        else {
          response.writeHead(400, DEFAULT_HEADER)
          response.write(JSON.stringify({ error }))
        }
        return response.end()
      }
    }
    catch (error) {
      return errorHandler(response)(error)
    }
  }
}


function serverRunningLog ({ port } : tStartRoutesProps) {
  console.log('server running at', port)
}


function errorHandler (response : http.ServerResponse) {
  return function (error : unknown) {
    console.error(error)
    response.writeHead(500, DEFAULT_HEADER)
    return response.end()
  }
}


function startRoutes ({ port } : tStartRoutesProps) {
  // @ts-ignore
  const requestListener : http.RequestListener = function (request : tRequest, response) {
    const { url, method } = request
    const [root, route, id] = (url as string).split('/')
    response.writeHead(200, DEFAULT_HEADER)
    request.query = { id: Number(id) }
    const key = '/'.concat(route, ':', (method as string).toLowerCase())
    const handler = routes[key] || routes.default
    return handler(request, response).catch(errorHandler(response))
  }
  http.createServer(requestListener).listen(port, () => serverRunningLog({ port }))
}


export default startRoutes