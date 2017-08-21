'use strict'

const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const NunjucksHapi = require('nunjucks-hapi')
const Path = require('path')
const fs = require('fs')
const marked = require('marked')

const server = new Hapi.Server()

// Credit where credit's due for this function: https://gist.github.com/mathewbyrne/1280286
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

server.connection({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8080
})

// Register Vision (templates) and Inert (static file handling)
server.register([Vision, Inert], err => {
  if (err) {
    throw err
  }
})

// Use nunjucks as rendering engine
server.views({
  engines: {
    html: NunjucksHapi
  },
  path: Path.join(__dirname, 'views')
})

// Add static asset handling from public/ directory
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'public',
      listing: false,
      index: false
    }
  }
})

// Init empty posts array
let posts = []

// Get all files from posts directory
let files = fs.readdirSync(Path.join(__dirname, 'posts'))

// Sort files from newest -> oldest
files.sort((a, b) => {
  return fs.statSync(Path.join(__dirname, 'posts', b)).mtime.getTime() - fs.statSync(Path.join(__dirname, 'posts', a)).mtime.getTime()
})

files.forEach(post => {
  // Remove extension from file name for title
  let title = post.replace(/\.[^/.]+$/, '')

  // Generate slug from file name for route path
  let slug = `/post/${slugify(title)}`
  
  // Read each file
  fs.readFile(Path.join(__dirname, 'posts', post), 'utf8', (err, contents) => {

    // Get file info (date created)
    fs.stat(Path.join(__dirname, 'posts', post), (err, data) => {

      // Create postdata object
      let postData = {
        slug,
        title,
        post: marked(contents),
        date: new Date(data.birthtime).toISOString(),
        prettyDate: new Date(data.birthtime).toLocaleString('en-gb', { year: 'numeric', month: 'long', day: 'numeric' })
      }
      
      // Push each post into posts array for home route
      posts.push(postData)

      // Add a static route for each file
      server.route({
        method: 'GET',
        path: slug,
        handler: function(request, reply) {
          reply.view('post', postData)
        }
      })
    })

  })
})

// Home route
server.route({
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply.view('home', {
      postList: posts
    })
  }
})

server.start(err => {
  if (err) {
    throw err
  }

  console.log(`Server running at ${server.info.uri}`)
})