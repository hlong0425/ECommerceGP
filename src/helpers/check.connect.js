import mongoose from 'mongoose';
import process from 'process';
import os from 'os';

const SECOND = 5000;

//count Connect
const countConnect = () => {
  console.log(`Number of connections::${mongoose.connections.length}`);
};

// check over load
const checkOverLoad = () => {
  const numConnection = mongoose.connections.length;

  setInterval(() => {
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on number osf cores.
    const maxConnections = numCores * 5;

    console.log('Active connections::', numConnection);
    console.log('Memory usage::', `${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected`);
    }
  }, SECOND);
};

export { countConnect, checkOverLoad };
