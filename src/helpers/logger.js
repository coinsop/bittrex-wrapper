import winston from 'winston';

export default new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: 'all',
      timestamp: () => {
        const now = new Date();
        return `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}]`;
      }
    })
  ]
});
