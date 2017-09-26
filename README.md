# metalsmith-bitly

[![npm version][version-badge]][version-url]

> A Metalsmith plugin that adds [bitly](http://bitly.com) links to the metadata of each file.

This plugin allows you to retrieve bit.ly short links and use them in your templates. For support questions please use
[stack overflow][stackoverflow-url] or our [slack channel][slack-url].

## Installation

```
$ npm i metalsmith-bitly
```

## Usage

You can use `metalsmith-bitly` with the with Metalsmith's [Javascript API][metalsmith-api-url] or [CLI][metalsmith-cli-url]. You must also set the `siteURL` value on your site's metadata configuration.

### Options

* `accessToken`: your personal bitly access token (**required**)
* `baseURL`: your production base URL (_semi-required_, either this or `baseURLGlobalMetadataKey` is needed)
* `baseURLGlobalMetadataKey`: the global metaday key of your production base URL (_semi-required_, either this or `baseURL` is needed)
* `brandedShortDomain`: an override for the default domain (optional, defaults to `bit.ly`)
* `pathMetadataKey`: an override for the default file path (optional, defaults to `path`)

#### `accessToken`
In order to utilize this plugin you must request an access token from bitly at [their developer site](bitly.com/a/oauth_apps). Please remember to exclude your bitly authorization key if your repository is public. You can use the below example and include your private configuration file in your repository's `.gitignore` file.

```javascript
const bitly = require('metalsmith-bitly');
const configPrivate = require('../configPrivate');
const Metalsmith = require('metalsmith');

return Metalsmith(__dirname)
  .use(bitly({
    accessToken: configPrivate.bitlyToken,
    baseURL: 'http://welchcanavan.com/'
  }))
  .build(function(err) {
    if (err) throw err;
});
```

#### `baseURL`

A semi-required value, you must specify either this or [`baseURLGlobalMetadataKey`](#baseURLGlobalMetadataKey). This is the base URL that will be combined with your file's path to sent to bit.ly.

```javascript
const bitly = require('metalsmith-bitly');
const configPrivate = require('../configPrivate');
const Metalsmith = require('metalsmith');

return Metalsmith(__dirname)
  .use(bitly({
    accessToken: configPrivate.bitlyToken,
    baseURL: 'http://welchcanavan.com/'
  }))
  .build(function(err) {
    if (err) throw err;
});
```

#### `baseURLGlobalMetadataKey`

A semi-required value, you must specify either this or [`baseURL`](#baseURL). Use this if you'd like to make sure this plugin stays in sync with a globally used or required metadate value for your site's production base URL.

```javascript
const bitly = require('metalsmith-bitly');
const configPrivate = require('../configPrivate');
const Metalsmith = require('metalsmith');

return Metalsmith(__dirname)
  .metadata({
    siteURL: 'http://welchcanavan.com/',
  })
  .use(bitly({
    accessToken: configPrivate.bitlyToken,
    baseURLGlobalMetadataKey: siteURL
  }))
  .build(function(err) {
    if (err) throw err;
});
```

#### `brandedShortDomain`

Specify this value if you have set up a [Branded Short Domain][bitly-bsd-url] with bit.ly.

```javascript
const bitly = require('metalsmith-bitly');
const configPrivate = require('../configPrivate');
const Metalsmith = require('metalsmith');

return Metalsmith(__dirname)
  .use(bitly({
    accessToken: configPrivate.bitlyToken,
    baseURL: 'http://welchcanavan.com/',
    brandedShortDomain: 'http://xiw.cx/'
  }))
  .build(function(err) {
    if (err) throw err;
});
```

#### `pathMetadataKey`

To be used in concert with the [metalsmith-permalinks][permalinks-url] plugin. You can specify a file metadata key to match a pattern used in the permalinks plugin. Order is important here, you have to run `metalsmith-bitly` after `metalsmith-permalinks` or the paths won't match.

```markdown
---
title: A Post About A Thing
slug: post-thing
---
```

```javascript
const bitly = require('metalsmith-bitly');
const collections = require('metalsmith-collections');
const configPrivate = require('../configPrivate');
const Metalsmith = require('metalsmith');
const permalinks  = require('metalsmith-permalinks');

return Metalsmith(__dirname)
  .use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(permalinks({
    linksets: [
      {
        match: { collection: 'posts' },
        pattern: ':slug'
      }
    ]})
  )
  .use(bitly({
    accessToken: configPrivate.bitlyToken,
    pathMetadataKey: 'slug'
  }))
  .build(function(err) {
    if (err) throw err;
});
```

**Note:** I've thought about including an option to focus this plugin on a collection or list of collections. If that would be of interest to you, feel free to leave a note or a pull request.

## License

MIT

[bitly-bsd-url]: https://support.bitly.com/hc/en-us/articles/230898888-How-do-I-set-up-a-Branded-Short-Domain-BSD-
[metalsmith-api-url]: https://github.com/segmentio/metalsmith#api
[metalsmith-cli-url]: https://github.com/segmentio/metalsmith#cli
[permalinks-url]: https://github.com/segmentio/metalsmith-permalinks
[stackoverflow-url]: http://stackoverflow.com/questions/tagged/metalsmith
[slack-url]: http://metalsmith-slack.herokuapp.com/
[version-badge]: https://img.shields.io/npm/v/metalsmith-bitly.svg
[version-url]: https://www.npmjs.com/package/metalsmith-bitly
