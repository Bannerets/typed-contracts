import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

import packageJson from './package.json'

const { dependencies } = packageJson

const deps = dependencies && Object.keys(dependencies).join('|')
const reg = deps && new RegExp(`^(${deps})($|/)`)

const banner = `
/**
 * ${packageJson.name} v${packageJson.version}
 * ${packageJson.description}
 */
`

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/bundle.js',
    format: 'cjs',
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      plugins: [
        'transform-class-properties',
      ],
      presets: [
        'flow',
        ['env', {
          targets: {
            node: 1,
            browsers: ['>= 1%'],
          },
          modules: false,
        }],
      ],
    }),
  ],
  external: id => !!reg && reg.test(id),
  banner,
}
