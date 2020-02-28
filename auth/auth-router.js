const router = require('express').Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Users = require('./model')
const {JWT_SECRET} = require('../config/secrets')

router.post('/register', (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 8)
  req.body.password = hash;

  Users.add(req.body)
  .then(user =>{
    res.status(201).json({
      message: "Successfully created user.",
      id: user.id,
      username: user.username
      })
    })
    .catch(({name, message, stack, code}) => {
      res.status(500).json({name, message, stack, code})
  })
});

router.post('/login', (req, res) => {
  Users.findBy({username: req.body.username})
  .then(user => {
      if (user && bcrypt.compareSync(req.body.password, user.password)){
          const token = generateToken(user)
          res.status(200).json({
              message:`Welcome back, ${user.username}!`,
              token
          })
      } else {
          res.status(401).json({ message: 'Invalid Credentials' });
  }
  })
});

function generateToken(user){
  const payload = {
      subject: user.username
  }

  options = {
      expiresIn: '1h'
  }

  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;
