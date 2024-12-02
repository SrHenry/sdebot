//webpack.config.js
require('dotenv').config();

const { string, object, StringRules, asEnum } = require('@srhenry/type-utils');

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

const { DefinePlugin } = require('webpack');
const { readFileSync } = require('fs');
const { resolve: __1 } = require('path');
const { parse: __2 } = require('comment-json');

/** @param {string} path */
const resolvePath = path => __1(__dirname, path);
/** @param {string} file */
const parseJSONC = file => __2(file, null, true);
/** @param {string} path */
const isJSONC = path => /.*\.jsonc$/.test(path);

/**
 * @param {string} path
 * @returns {Record<string, string>}
 */
function handleMemData(path) {
  if (isJSONC(path)) {
    const file = readFileSync(path).toString();
    return parseJSONC(file);
  } else return require(path);
}

/** @type {string[]} */
const memoryDataPaths = JSON.parse(process.env.MEMORY_DATA_PATHS) ?? [];

/** @type {import('./src/diario-seduc/types/Memory.ts').Memory} */
const defaultMemory = memoryDataPaths
  .map(resolvePath)
  .map(handleMemData)
  .reduce((memory, part) => {
    for (const key in part) {
      if (key in memory) {
        for (const subkey in part[key]) {
          memory[key][subkey] =
            subkey in memory[key]
              ? {
                  ...memory[key][subkey],
                  ...part[key][subkey],
                }
              : part[key][subkey];
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
