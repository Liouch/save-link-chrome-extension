import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

export default {
  input: 'scripts/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'iife', // Immediate function expression for browser use
    name: 'save_link_chrome_extension',
    sourcemap: false,
  },
  plugins: [
    typescript(),
    copy({
      targets: [
        { src: './*.html', dest: 'dist' },
        { src: './styles/*.css', dest: 'dist/styles' },
        { src: './images/*', dest: 'dist/images' },
        { src: './manifest.json', dest: 'dist' },
      ],
    }),
  ],
};
