const { LOGGING } = require('../config/app');
const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

// const myFormat = printf(info => {
//   return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
// });

export const winstonLogger = winston.createLogger({
  format: combine(winston.format.splat(), winston.format.simple()),
  // format: combine(label({ label: 'terminal' }), timestamp(), myFormat),
  transports: [new winston.transports.Console()],
  silent: !LOGGING || process.env.NODE_ENV === 'production', // logging off or production
});

// log yarn execution to the console
function decode_utf8(uint8array) {
  return new TextDecoder('utf-8').decode(uint8array);
}

export const logger = (child, label, level = 'info') =>
  child.stdout.on('data', data => {
    // data is an uint8 array --> decode to unicode string
    // console.info(msg, decode_utf8(data));
    winstonLogger.log(level, '[%s]: %s', label, decode_utf8(data));
  });
