const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
const logpath = path.resolve(__dirname, '../logs', `service-%DATE%.log`);
// set winston.transports.DailyRotateFile options
var transport = new (winston.transports.DailyRotateFile)({
    //filename: '/home/user/fabric-network/client/log/service-%DATE%.log',
    //filename: `${process.env.LOGGING_PATH}/service-%DATE%.log`,
    filename: logpath,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    //maxSize: '20m',
    maxFiles: '14d',
    colorize: true
});

function setConfig(category){
    return {
        transports: [
            new winston.transports.Console({
                colorize: true
            }),
            //new winston.transports.File({
            //    filename: '/home/user/fabric-network/client/log/service.log'
            //}),
            transport            
        ],
        format: winston.format.combine(
            // winston.format.label({
            //     label: `${path.basename(__filename)}`
            // }),
            winston.format.label({
                 label: category
            }),
            winston.format.colorize({
                level:true
            }),
            winston.format.timestamp(),
            winston.format.printf((info) => {
                return `${info.timestamp} ${info.level} [${info.label}] ${info.message}`;
            })
        )
    };
}

module.exports = setConfig;