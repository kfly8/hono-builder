import builder from '../builder'

builder.setErrorHandler((err, c) => {
  console.log(err)
  return c.text('Internal Server Error', 500)
})
