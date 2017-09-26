// const Bitly = require('bitlyapi');
const Bitly = require('bitlyapi');

const plugin = (options = {}, ...rest) => {
  const bitly = new Bitly(options.token);

  return (files, metalsmith, done) => {
    const siteUrl = metalsmith.metadata().siteUrl;

    if (rest.length > 0) {
      done(new Error('invalid options, this plugin expects a single options object.'))
    };

    async function makeUrl(response) {
      return (options.shortUrl) ? options.shortUrl + response.data.hash : response.data.url;
    };

    async function addBitlyMeta(filename) {
      const file = files[filename];
      const pageUrl = (options.metaDataKey) ? siteUrl + file[options.metaDataKey] : siteUrl + file.path;
      const response = await bitly.shorten(pageUrl);
      const bitlyUrl = await makeUrl(response);

      return file.bitlyURL = bitlyUrl;
    };

    function filterFiles(filename) {
      const file = files[filename];
      return (file[options.metaDataKey] !== undefined && (file[options.metaDataKey] || file.path));
    };

    // Map all files that should be processed to an array of promises
    const promises = Object.keys(files)
      .filter(filename => filterFiles(filename))
      .map(filename => addBitlyMeta(filename))

    // Call done callback when all promises are resolved
    Promise.all(promises).then(() => done()).catch(error => done(error))
  }
};

module.exports = plugin;
