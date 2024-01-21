import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

import Hero from '~/entities/hero'

type tHeroRepositoryProps = {
  file : string
}


class HeroRepository {

  private file : string

  constructor ({ file } : tHeroRepositoryProps) {
    this.file = this._getFilePath(file)
  }


  private _getFilePath (file : string) {
    return join(__dirname, '/../', file)
  }


  private async _currentFileContent () : Promise<Hero[]> {
    return JSON.parse((await readFile(this.file)).toString())
  }


  public async find (heroId : number) {
    const fileContent = await this._currentFileContent()
    if (!heroId) {
      return fileContent
    }
    return fileContent.find(({ id }) => id == heroId)
  }


  public async create (hero : Hero) {
    const fileContent = await this._currentFileContent()
    fileContent.push(hero)
    await writeFile(this.file, JSON.stringify(fileContent))
    return hero.id
  }

}


export default HeroRepository