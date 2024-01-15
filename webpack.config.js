//webpack.config.js
require('dotenv').config();

const {
  or,
  string,
  object,
  StringRules,
  asEnum,
} = require('@srhenry/type-utils');

/** @type {() => import('@srhenry/type-utils').TypeGuard<string>} */
const NumberString = () => o =>
  string([StringRules.nonEmpty()])(o) && Number(o) !== NaN;

const isValidEnv = object({
  MEMORY_DATA_PATHS: string(),
  MODE: asEnum(['queued', 'normal']),

  INTERVAL: NumberString(),
  CONSUMER_SLEEP_INTERVAL: NumberString(),
  RATE_LIMIT: NumberString(),
  CONCURRENCY: NumberString(),
});

if (!isValidEnv(process.env)) throw new Error('Invalid environment variables');

const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const { parse: parseJSONC } = require('comment-json');

/** @type {string[]} */
const memoryDataPaths = JSON.parse(process.env.MEMORY_DATA_PATHS) ?? [];

/** @type {import('./src/diario-seduc/types/Memory.ts').Memory} */
const defaultMemory = memoryDataPaths
  .map(mempath => {
    return /.*\.jsonc$/.test(mempath)
      ? parseJSONC(
          fs.readFileSync(path.resolve(__dirname, mempath)).toString(),
          null,
          true,
        )
      : require(path.resolve(__dirname, mempath));
  })
  .reduce((memory, part) => {
    for (const key in part) {
      if (key in memory) {
        for (const subkey in part[key]) {
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
const mode = process.env.MODE;

const INTERVAL = Number(process.env.INTERVAL);
const CONSUMER_SLEEP_INTERVAL = Number(process.env.CONSUMER_SLEEP_INTERVAL);
const RATE_LIMIT = Number(process.env.RATE_LIMIT);
const CONCURRENCY = Number(process.env.CONCURRENCY);

const MACROS = {
  defaultMemory,
  mode,
  INTERVAL,
  CONSUMER_SLEEP_INTERVAL,
  RATE_LIMIT,
  CONCURRENCY,
};

for (const key in MACROS) MACROS[key] = JSON.stringify(MACROS[key]);

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    main: './src/main.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'script.js', // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
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
  plugins: [new webpack.DefinePlugin({ ...MACROS })],
};
