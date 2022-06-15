const User = require('../models/Users.js')
const StatusCodes = require('http-status-codes')
 const { UnAuthenticatedError } = require('../errors/index.js')
//  const createJWT = require('jsonwebtoken')
class CustomAPIError extends Error {
  constructor(message) {
    super(message)
  }
}
class BadRequestError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
  }

}

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.NOT_FOUND
  }

}
exports.register = async(req, res, next) => {
  const {name,email,password} = req.body
  if(!name || !email || !password) {
    throw new BadRequestError('Please provide all values')
  }

  const userAlreadyExists = await User.findOne({ email })
  if(userAlreadyExists){
    throw new BadRequestError('Email already exists')
  }
  const user = await User.create({name, email, password})
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name
    },
     token, 
     location: user.location})
  // try {
  //   const user = await User.create(req.body)
  //   // const user = resData.save()
  //   res.status(201).json({message:'Save succefully'})
  // } catch (error) {
  //    next(error)
      
  // }

}

exports.login = async(req, res) => {
  const { email, password } = req.body
  if(!email || !password) {
    throw new BadRequestError('Please provide all values')
  }

  const user = await User.findOne({ email }).select('+password')

  if(!user) {
    throw new UnAuthenticatedError('Invalid credential')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if(!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid credential')
  }

  const token = user.createJWT()
  user.password = undefined
  res.status(200).json({user,token,location:user.location})
}

exports.updateUser = async(req, res) => {
    res.send('update user')
    // User.findByIdAndUpdate
}