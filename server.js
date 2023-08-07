import app from './src/app.js';

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`listening port 3055 ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'));
});
