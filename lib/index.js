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
    for (const file in files) {
      bitly.shorten(metalsmith.metadata().siteUrl + files[file].slug)
        .then(function(response) {
          files[file].bitlyURL = (options.shortUrl) ? options.shortUrl + response.data.hash : response.data.url;
          done();
        }, function(error) {
          throw error;
        });
    };
  };
};
