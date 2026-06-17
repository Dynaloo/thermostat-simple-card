import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/thermostat-simple-card.js',
  output: {
    file: 'dist/thermostat-simple-card.js',
    format: 'es',
    sourcemap: false
  },
  plugins: [
    nodeResolve(),
    // Ligne ci-dessous à décommenter pour minifier le fichier final pour HACS
    // terser() 
  ]
};
