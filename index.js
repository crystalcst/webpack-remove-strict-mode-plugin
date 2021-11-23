/* eslint-disable no-param-reassign */
class WebpackRemoveStrictModePlugin {
    /**
     * @constructor
     * @param {RegExp} exclude exclude files
     * @param {Array} extension file extension, '.js' by default
     */
    constructor({ exclude = '', extension = ['.js'] }) {
      this.exclude = exclude;
      this.extension = extension;
      if (extension && Array.isArray(extension) && extension.length) {
        this.extension.concat(extension);
      }
      this.strictReg = /(\'|\")use\s+strict(\'|\")\;?/gm;
    }
  
    apply(compiler) {
      const emit = (compilation, cb) => {
        const errors = [];
  
        try {
          removeStrict(compilation);
        } catch (err) {
          errors.push(err);
        }
  
        if (errors.length) {
          compilation.errors = compilation.errors.concat(errors);
        }
        cb();
      };
  
      const removeStrict = (compilation) => {
        Object.keys(compilation.assets).map((filename) => {
          if (
            this.isMatchExtension(filename)
                    && !this.isExclude(filename)
          ) {
            const file = compilation.assets[filename];
            const origin = file.source().toString();
            const len = file.size();
  
            const removed = origin.replace(this.strictReg, '');
            // need replace when origin content changed
            if (removed.length !== len) {
              console.log('buffer.from', removed);
              const buff = Buffer.from(removed);
              compilation.assets[filename] = {
                source: () => buff,
                size: () => buff.length,
              };
            }
          }
        });
      };
  
      compiler.hooks.emit.tapAsync('emit', emit);
    }
  
    isMatchExtension(filename) {
      return (
        this.extension.find(ext => new RegExp(`\\${ext}$`).test(filename)) != null
      );
    }
  
    isExclude(filename) {
      if (!this.exclude) {
        return false;
      }
      return this.exclude.test(filename);
    }
  }
  
  module.exports = WebpackRemoveStrictModePlugin;
  