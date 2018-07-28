// log yarn execution to the console

export const logger = (child, msg = 'DEBUG') =>
  child.stdout.on('data', data => {
    console.info(msg, data);
  });
