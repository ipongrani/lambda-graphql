


class member {

  constructor(param){
    let keys = Object.keys(param);
    keys.map((d) => this[`${d}`] = param[`${d}`])
  }

  async encryptPassword (param) {
      let genSalt = param['config'].Promise['promisify'](param['config'].bcrypt['genSalt']);
      let hash = param['config'].Promise['promisify'](param['config'].bcrypt['hash']);
      let salt = await genSalt(param['saltInt']);
      let hashed = await hash(this['password'], salt, null).catch(err => console.log("Something went wrong"));
      return hashed;
  }

}

export default member
