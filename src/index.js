const Promise    = require('bluebird'),
      cloneDeep  = require('clone-deep'),
      fsNative   = require('fs'),
      path       = require('path'),
      BaseReader = require('@resource-sentry/utils/lib/base-reader'),
      Categories = require('@resource-sentry/utils/lib/categories'),
      Logger     = require('@resource-sentry/utils/lib/logger');

const Constants = require('./model/constants');

const fs = Promise.promisifyAll(fsNative);

class PropertiesReader extends BaseReader {
    constructor(config) {
        super();
        this.logger = Logger(this.constructor.name);
        this.config = config;
    }

    getEntry() {
        return this.config['entry'];
    }

    scan() {
        let keyValue = cloneDeep(Constants.REG_EXP_KEY_VALUE);

        return Promise
            .resolve()
            .then(() => {
                let propertiesFile = path.resolve(process.cwd(), this.getEntry());
                this.logger.verbose(`Loading "${propertiesFile}" properties.`);
                return fs.readFileAsync(propertiesFile, 'utf8');
            })
            .then(content => {
                let result, name, value, category, numericValue;

                keyValue.lastIndex = 0;

                while ((result = keyValue.exec(content)) !== null) {
                    name = result[1];
                    value = result[2];

                    // Sanitize value
                    value = value
                        .replace(Constants.REG_EXP_NEW_LINE, '')
                        .replace(Constants.REG_EXP_EXTRA_SPACES, '')
                        .replace(Constants.REG_EXP_EXTRA_LINES, '')
                        .trim();

                    numericValue = parseFloat(value);
                    category = isNaN(numericValue) === true ? Categories.TEXT : Categories.VALUE;
                    this.addValue(category, name, numericValue || value);
                }

                this.dispatch(Constants.DATA_DID_CHANGE);
            });
    }
}

module.exports = PropertiesReader;
