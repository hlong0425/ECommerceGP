import pkg from 'pg';
const { Client } = pkg;

const connectDb = async () => {
  console.log('start');
  try {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'report_service',
      password: 'password',
      port: 5432,
      ssl: false,
    });

    client.connect().then(() => {
      console.log('Ok');
      client.query('SELECT * from clients', (err, res) => {
        console.log(res.rows);
        client.end();
      });
    });
  } catch (error) {
    console.log(error);
  }
};

connectDb();
