import builder from '../../builder'

builder.setErrorHandler((err, c) => {
  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message,
    },
    500
  )
})
