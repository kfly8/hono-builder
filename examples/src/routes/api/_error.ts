import builder from '../../builder'

builder.onError((err, c) => {
  return c.json(
    {
      error: 'Internal Server Error',
      message: err.message,
    },
    500
  )
})
