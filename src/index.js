import yargs from 'yargs'
import JsonSchema from 'ajv'
import invariant from 'invariant'
import pick from 'lodash.pick'
import { join as joinPath } from 'path'

const jsonSchema = new JsonSchema({ allErrors: true })

const coerce = (type, val) => {
  if (type === 'integer') {
    const parsedInteger = parseInt(val, 10)
    // Avoid some headaches by making sure that the parsed integer is the
    // same as the provided string value. If it stringifies back to the same
    // value otherwise someone could provide an octal number and parseInt
    // will incorrectly try to cast it as an int.
    if (typeof val === 'string' && val !== JSON.stringify(parsedInteger)) {
      return null
    }
    return parsedInteger
  }
  return val
}

const configFromSchema = (namespace, configParams) => {
  invariant(
    typeof namespace === 'string',
    `configFromSchema argument 'namespace' is required`
  )

  let args = yargs
    .help()
    .env(namespace.toUpperCase())
    .showHelpOnFail(true)
    .usage('Usage: $0 [options]')
    .options('config', {
      type: 'string',
      description: 'Path to config file',
      default: joinPath(process.env.HOME, `.${namespace}.json`)
    })
    .config('config')

  configParams.forEach(param => {
    const {
      name,
      required,
      description,
      default: defaultValue,
      schema
    } = param

    invariant(
      typeof schema === 'object',
      'A schema is required for every config parameter'
    )

    const { type } = schema

    invariant(
      ['boolean', 'integer', 'string'].includes(type),
      'Only the following types are currently supported: [boolean, integer, string]'
    )

    const demand = !!required
    args.options(name, {
      type,
      demand,
      description,
      default: defaultValue,
      coerce: val => {
        // Bail out if required but not present letting yargs display its
        // "native" error message.
        if (required && val === undefined) {
          return val
        }

        // Make sure we're validating against a correctly coerced type
        const coercedVal = coerce(type, val)

        // Validate json schema
        const isValid = jsonSchema.validate(schema, coercedVal)
        if (!isValid) {
          const [ { message } ] = jsonSchema.errors
          throw new Error(`Config value ${message}: ${name}`)
        }

        // If all goes well return the coerced value to yargs
        return coercedVal
      }
    })
  })

  const config = args.argv

  const configParamNames = configParams.map(param => param.name)
  return pick(config, configParamNames)
}

export default configFromSchema
