import Hero from '~/entities/hero'
import HeroRepository from '~/repositories/heroRepository'

type tHeroServiceProps = {
  heroRepository : HeroRepository
}

class HeroService {

  private heroRepository

  constructor ({ heroRepository } : tHeroServiceProps) {
    this.heroRepository = heroRepository
  }


  public async find (heroId : number) {
    return this.heroRepository.find(heroId)
  }


  public async create (hero : Hero) {
    return this.heroRepository.create(hero)
  }

}


export default HeroService