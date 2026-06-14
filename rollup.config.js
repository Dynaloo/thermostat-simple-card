import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/thermostat-simple-card.js',
  output: {
    file: 'dist/thermostat-simple-card.js',
    format: 'es',
  },
  plugins: [nodeResolve()],
};
