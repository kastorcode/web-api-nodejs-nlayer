type tHeroProps = {
  name : string,
  age : number,
  power : string
}


class Hero {

  public id
  private name
  private age
  private power

  constructor ({ name, age, power } : tHeroProps) {
    this.id = Math.floor(Math.random() * 100) + Date.now()
    this.name = name
    this.age = age
    this.power = power
  }


  public isValid () {
    const properties = Object.getOwnPropertyNames(this)
    const invalid = properties
      // @ts-ignore
      .map(property => !!this[property] ? null : `${property} is missing`)
      .filter(message => !!message)
    return {
      isValid: invalid.length === 0,
      error: invalid
    }
  }

}


export default Hero