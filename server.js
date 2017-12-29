'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const NunjucksHapi = require('nunjucks-hapi');
const Path = require('path');
const fs = require('fs');
const util = require('util');
const marked = require('marked');
const readFile = util.promisify(fs.readFile);
const DATE_DELIM = '_~_';

const server = new Hapi.Server();

// https://gist.github.com/mathewbyrne/1280286
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Get post date from beginning of filename
function getPostDate(filename) {
  console.log(filename, filename.substring(0, filename.indexOf(DATE_DELIM)));
  return filename.substring(0, filename.indexOf(DATE_DELIM));
}

server.connection({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8080,
});

// Register Vision (templates) and Inert (static file handling)
server.register([Vision, Inert], err => {
  if (err) {
    throw err;
  }
});

// Use nunjucks as rendering engine
server.views({
  engines: {
    html: NunjucksHapi,
  },
  path: Path.join(__dirname, 'views'),
});

// Add static asset handling from public/ directory
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'public',
      listing: false,
      index: false,
    },
  },
});

// Init empty posts array
let posts = [];

// Get all files from posts directory
let files = fs.readdirSync(Path.join(__dirname, 'posts'));

// Sort files from newest -> oldest
files
  .sort((x, y) => {
    console.log(new Date(getPostDate(y)), new Date(getPostDate(x)));
    return new Date(getPostDate(y)) - new Date(getPostDate(x));
  })
  .forEach(post => {
    // Remove extension and date from file name for title
    let title = post
      .replace(/\.[^/.]+$/, '')
      .substring(post.indexOf(DATE_DELIM) + DATE_DELIM.length);

    // Generate slug from file name for route path
    let slug = `/post/${slugify(title)}`;

    // Read the file
    readFile(Path.join(__dirname, 'posts', post), 'utf8')
      .then(contents => {
        let publishDate = getPostDate(post);

        // Create postdata object
        let postData = {
          slug,
          title,
          post: marked(contents),
          date: new Date(publishDate).toISOString(),
          prettyDate: new Date(publishDate).toLocaleString('en-gb', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };

        // Push each post into posts array for home route
        posts.push(postData);

        // Add a static route for each file
        server.route({
          method: 'GET',
          path: slug,
          handler: function(request, reply) {
            reply.view('post', postData);
          },
        });
      })
      .catch(err => {
        console.log(err);
      });
  });

// Home route
server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply({
      result: posts,
    });
  },
});

server.start(err => {
  if (err) {
    throw err;
  }

  console.log(`Server running at ${server.info.uri}`);
});
