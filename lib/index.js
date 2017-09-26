// const Bitly = require('bitlyapi');
const Bitly = require('bitlyapi');

const plugin = (options = {}, ...rest) => {
  const accessToken = options.accessToken;
  const bitly = new Bitly(accessToken);
  const pathMetadataKey = options.pathMetadataKey;
  const brandedShortDomain = options.brandedShortDomain;

  return (files, metalsmith, done) => {
    const baseURL = options.baseURL || metalsmith.metadata()[options.baseURLGlobalMetadataKey];

    // Errors
    // ======

    if (rest.length > 0) {
      done(new Error('invalid options, this plugin expects a single options object.'))
    };

    if (!accessToken) {
      done(new Error('you must provide a value for accessToken'))
    };

    if (!baseURL) {
      done(new Error('you must provide a metadate value for siteUrl or the baseURL option on the plugin'))
    };

    // Functions
    // =========

    const addBitlyMeta = async (filename) => {
      const file = files[filename];
      const pageURL = (pathMetadataKey) ? baseURL + file[pathMetadataKey] : baseURL + file.path;
      const response = await bitly.shorten(pageURL);
      const bitlyURL = await makeUrl(response);

      return file.bitlyURL = bitlyURL;
    };

    const makeUrl = async (response) => {
      // check to see if a Branded Short Domain is provided. if it is concatenate it with the hash, otherwise use
      // the default URL response
      return (brandedShortDomain) ? brandedShortDomain + response.data.hash : response.data.url;
    };

    const filterFiles = (filename) => {
      const file = files[filename];

      // filter out files that are undefined and lack a metaDataKey or path
      return (file[pathMetadataKey] !== undefined && (file[pathMetadataKey] || file.path));
    };

    // The Business
    // ============

    // Map all files that should be processed to an array of promises
    const promises = Object.keys(files)
      .filter(filterFiles)
      .map(addBitlyMeta)

    // Call done callback when all promises are resolved
    Promise.all(promises)
      .then(() => done())
      .catch(error => done(error));
  }
};

module.exports = plugin;
