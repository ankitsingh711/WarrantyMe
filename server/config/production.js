module.exports = {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  },
  session: {
    cookie: {
      secure: true,
      sameSite: 'none'
    },
    proxy: true
  },
  mongodb: {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  }
}; 