import HeroRepository from '~/repositories/heroRepository'
import HeroService from '~/services/heroService'


function heroFactory () {
  const heroRepository = new HeroRepository({
    file: 'database/data.json'
  })
  const heroService = new HeroService({
    heroRepository
  })
  return heroService
}


export default heroFactory