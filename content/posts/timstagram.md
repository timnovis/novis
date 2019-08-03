---
title: 'Timstagram'
date: 2019-08-03T17:04:25+01:00
draft: false
---

Today I built a thing to allow me to get photos from my phone to this website without much manual intervention. I've dubbed it Timstagram.

[Check out Timstagram](https://www.novis.co/photos/)

### Why?

There are photos on my iPhone I don't really want to upload to Instagram.

#### Part 1 - iOS Shortcut

I created an [iOS Shortcut](https://support.apple.com/en-gb/guide/shortcuts/welcome/ios) to take a photo from my camera roll, and send it through some wires and oceans finally reaching my website.

I hadn't really explored Shortcuts too much since their release but I'm suitably impressed and already I'm thinking of all the things I can do with them going forward. The shortcut is too large to screenshot in its entirety, but it does a few things:

- ✅ Prompts me for a photo from my camera roll
- ✅ Does a bunch of transformations on it, eventually ending up as base64
- ✅ Asks me for a caption
- ✅ Beams that juicy info up to my remote function
- ✅ Shows a local success or failure notification

_Not the whole configuration, but the good bits:_

<img style="max-width: 45%" src="/media/misc/shortcut-1.PNG" alt="iOS Shortcut Configuration 1">
<img style="max-width: 45%" src="/media/misc/shortcut-3.jpg" alt="iOS Shortcut Configuration 2">

#### Part 2 - Netlify Function

At this point in time, this website is built with [Hugo](https://gohugo.io/) - meaning it's basically a bunch of static HTML files. It's also hosted on Netlify, meaning I'm able to take advantage of Netlify Functions.

I built an endpoint (a lambda if we're being fancy) to process the information from the shortcut, and commit a blog post to my blog posts repo using GitHub's API.

What this means is: each time I want to upload a photo to this website, I essentially have to make a code change and add the image as a blob to the repo, and re-deploy the website on Netlify for it to appear.

[Check out the code for the function here](https://github.com/timnovis/novis/blob/master/functions/src/timstagram.js)

#### Part 3 - The Future?

I really like the idea of reclaiming ownership over my content, and I'm hoping to push forward with it and start using this website as a place to keep things as well as on the large centralised social networks. Perhaps I'll start looking at integrating some IndieWeb stuff here at some point too.

👋
