//webpack.config.ts

const { DefinePlugin } = require('webpack');

const {
  handleMemData,
} = require('./dist/build/node/functions/mappers/handleMemData');
const {
  resolvePath,
} = require('./dist/build/node/functions/mappers/resolvePath');
const {
  EnvironmentValidator,
} = require('./dist/build/validators/EnvironmentValidator');
const {
  ensureMemoryIntegrity,
} = require('./dist/build/functions/mappers/ensureMemoryIntegrity');

require('dotenv').config({ quiet: true });

const Env = EnvironmentValidator.validateEnv(process.env);

/** @type {string[]} */
const memoryDataPaths = JSON.parse(Env.MEMORY_DATA_PATHS) ?? [];

/** @type {import('./src/diario-seduc/types/MemoryFile').MemoryFile} */
const defaultMemory = memoryDataPaths
  .map(resolvePath)
  .map(handleMemData)
  .map(ensureMemoryIntegrity)
  .reduce((memory, part) => {
    for (const key of Object.keys(part)) {
      if (key in memory) {
        for (const subkey of Object.keys(part[key])) {
          if (subkey in memory[key]) {
            memory[key][subkey] = {
              ...memory[key][subkey],
              ...part[key][subkey],
            };
          } else {
            memory[key][subkey] = part[key][subkey];
          }
        }
      } else {
        memory[key] = part[key];
      }
    }

    return memory;
  }, {});

const { MODE: mode } = Env;

const INTERVAL = Number(Env.INTERVAL);
const CONSUMER_SLEEP_INTERVAL = Number(Env.CONSUMER_SLEEP_INTERVAL);
const RATE_LIMIT = Number(Env.RATE_LIMIT);
const CONCURRENCY = Number(Env.CONCURRENCY);

const MACROS = {
  defaultMemory,
  mode,
  INTERVAL,
  CONSUMER_SLEEP_INTERVAL,
  RATE_LIMIT,
  CONCURRENCY,
};

for (const key of Object.keys(MACROS))
  MACROS[key] = JSON.stringify(MACROS[key]);

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './src/main.ts',
  },
  output: {
    path: resolvePath('./dist'),
    filename: 'script.js', // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': resolvePath('src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [new DefinePlugin({ ...MACROS })],
};
