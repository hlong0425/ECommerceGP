import app from './src/app.js';

const PORT = 3056;

const server = app.listen(PORT, () => {
  console.log(`listening port ${PORT}`);
});

// process.on('SIGINT', () => {
//   server.close(() => console.log('Exit Server Express'));
// });
