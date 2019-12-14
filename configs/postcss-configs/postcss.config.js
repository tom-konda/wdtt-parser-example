module.exports = ctx => (
  {
  map: ctx.env === 'development' ? ctx.map : console.log(ctx),
  plugins: {
    'postcss-easy-import': {prefix: '_'},
    'postcss-nested': {},
  },
});