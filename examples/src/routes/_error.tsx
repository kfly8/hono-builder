import builder from '../builder'

builder.onError((err, c) => {
  console.log(err)
  return c.text('Internal Server Error', 500)
})
