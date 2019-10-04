/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'

const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    mongo: {
      options: {
        db: {
          safe: true
        }
      }
    }
  },
  test: { },
  development: {
    mongo: {
      uri: 'mongodb://192.168.99.100:27018/yapmt-api-dev', //docker machine windows ip
      options: {
        debug: true
      }
    }
  },

}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
