import winston from 'winston';

export default new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: 'all',
      timestamp: () => {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const s = now.getSeconds();
        return `[${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}]`;
      }
    })
  ]
});
