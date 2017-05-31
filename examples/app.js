const schema = require('./schema')
const configFromSchema = require('../lib/index')

const config = configFromSchema('foo', schema['x-config'])

console.info(config.port, config.secret)
