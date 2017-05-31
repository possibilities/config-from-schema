const schema = {
  'x-config': [
    {
      name: 'port',
      description: 'Application port',
      default: 3000,
      schema: {
        type: 'integer'
      }
    },
    {
      name: 'secret',
      description: 'Secret used for signing session cookies',
      required: true,
      schema: {
        type: 'string'
      }
    }
  ]
}

module.exports = schema
