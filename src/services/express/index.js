import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { env } from '../../config'

export default (apiRoot, routes) => {
  const app = express()

  if (env === 'development') {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(apiRoot, routes)
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())

  app.use(function (err, req, res, next) {
    if (err.errors) {
      var firstProp
      for (var key in err.errors) {
        if (err.errors.hasOwnProperty(key)) {
          firstProp = err.errors[key]
          break
        }
      }
      const returnJson = {
        'name': firstProp.kind,
        'param': firstProp.path,
        'valid': false,
        'message': firstProp.message
      }
      res.status(400).send(returnJson)
    }
    next()
  })

  return app
}
