const db = require('../database/dbConfig')

module.exports = {
    add,
    findBy
}

function add(user){
    const [id] = db('users').insert(user, "id")
    return findBy({id})
}

function findBy(filter){
    return db('users').where(filter).first()
}