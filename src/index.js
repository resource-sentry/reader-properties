const Promise    = require('bluebird'),
      fsNative   = require('fs'),
      path       = require('path'),
      BaseReader = require('@resource-sentry/utils/lib/base-reader'),
      Categories = require('@resource-sentry/utils/lib/categories'),
      Logger     = require('@resource-sentry/utils/lib/logger');

const fs = Promise.promisifyAll(fsNative);

class PropertiesReader extends BaseReader {
    constructor(config) {
        super();
        this.logger = Logger(this.constructor.name);
        this.config = config;
        this.keyValue = /^(\w+)[=:\s]+([\S\s]+?[^\\])(?=$)/gm;
        this.newLine = /\r?\n|\r/g;
        this.extraSpaces = /\s{2,}/g;
        this.extraLines = /\\/g;
    }

    getEntry() {
        return this.config.entry;
    }

    scan() {
        return Promise
            .resolve()
            .then(() => {
                let propertiesFile = path.resolve(process.cwd(), this.getEntry());
                this.logger.verbose(`Loading "${propertiesFile}" properties.`);
                return fs.readFileAsync(propertiesFile, 'utf8');
            })
            .then(content => {
                let result, name, value, category, numericValue;

                this.keyValue.lastIndex = 0;

                while ((result = this.keyValue.exec(content)) !== null) {
                    name = result[1];
                    value = result[2];

                    // Sanitize value
                    value = value
                        .replace(this.newLine, '')
                        .replace(this.extraSpaces, '')
                        .replace(this.extraLines, '')
                        .trim();

                    numericValue = parseFloat(value);
                    category = isNaN(numericValue) === true ? Categories.TEXT : Categories.VALUE;
                    this.addValue(category, name, numericValue || value);
                }

                this.dispatch('dataDidChange');
            });
    }
}

module.exports = PropertiesReader;
