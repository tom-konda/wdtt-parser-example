// import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    external: ['react', 'react-dom', '@emotion/styled'],
    input: 'temp/js/react-component/app-root.js',
    output: {
      file: 'dist/js/react-app.js',
      format: 'iife',
      globals: {
        'react' : 'React',
        'react-dom': 'ReactDOM',
        '@emotion/styled': 'emotionStyled',
      }
    },
    // plugins: [ resolve() ]
  },
];