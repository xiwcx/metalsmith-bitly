// const Bitly = require('bitlyapi');
const Bitly = require('bitlyapi');

/**
 * Expose `plugin`.
 */
module.exports = plugin;

/**
 * Metalsmith plugin to hide drafts from the output.
 *
 * @return {Function}
 */

function plugin(options) {
  const bitly = new Bitly(options.token);

  return (files, metalsmith, done) => {
    for (const fileId in files) {
      const siteUrl = metalsmith.metadata().siteUrl;
      const file = files[fileId];

      if (file[options.metaDataKey] !== undefined && (file[options.metaDataKey] || file.path)) {
        const pageUrl = (options.metaDataKey) ? siteUrl + file[options.metaDataKey] : siteUrl + file.path;

        async function makeUrl(response) {
          return (options.shortUrl) ? options.shortUrl + response.data.hash : response.data.url;
        };

        (async () => {
          const response = await bitly.shorten(pageUrl);
          file.bitlyURL = await makeUrl(response);

          return done();
        })();
      };
    };
  };
};
