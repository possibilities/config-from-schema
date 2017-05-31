# Config from schema

A tool for building an application object from config files, command line arguments, or environment variables based on an OpenAPI compatible schema definition.

## Config schema

Config schema format is defined in the [OpenAPI Config Extension Specification](https://github.com/possibilities/oacxs).

## Features

* Type coercion
* Schema validation
* Command line interface

## Usage

1. Install

   ```
   yarn add config-from-schema
   ```

1. Create schema

   ```
   // schema.js
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

   export default schema
   ```

1. Build config

   ```
   // app.js
   import schema from './schema'
   import configFromSchema from 'config-from-schema'

   const config = configFromSchema('foo', schema)

   console.info(config.port, config.secret)
   ```

1. Run app

   Provide values via CLI args

   ```
   $ node app --secret foo
   3000 'foo'
   ```

   OR via environment variables

   ```
   FOO_SECRET=bar node app
   3000 'bar'
   ```

   OR via a config file

   cat ~/.versal/sso.json | jq .

   ```
   $ cat ~/.versal/foo.json
   {
     "secret": "baz"
   }
   $ node app
   3000 'baz'
   ```

1. View docs

   ```
   $ node app --help
   Usage: app [options]

   Options:
     --help    Show help                                                  [boolean]
     --config  Path to config file
                                 [string] [default: "~/.versal/foo.json"]
     --port    Application port                                     [default: 3000]
     --secret  Secret used for signing session cookies          [string] [required]
   ```
