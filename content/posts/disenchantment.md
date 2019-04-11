---
title: 'Disenchantment'
date: 2019-04-11T12:07:33+01:00
draft: false
---

I mentioned in my [weeknotes](/post/weeknotes-3/) that I've been feeling rather conflicted recently regarding the state of modern front-end tooling, and common practices that seem to have become the status quo. Before I get into it, I'll preface by saying this: I'm not anti-JS (I am primarily a JavaScript developer), and I'm not anti-web. You could say I'm that a bit of a [centrist](https://en.wikipedia.org/wiki/Centrism) when it comes to this debate. I love React, Vue, TypeScript and all of the goodness that the last few years of web innovation has produced, but (imo) there's a large subset of developers who are getting an extreme case of tunnel vision when it comes to discussing what it means to build for the web platform.

My disenchantment began when I was tasked with building an admin panel for our support team at work. When I was choosing the tech stack (I'm thankful to have this level of autonomy), I came up with a loose set of requirements:

- ✅ Quick to build
- ✅ Fast loading and functional
- ✅ Easy to iterate and onboard new developers
- ✅ Minimal time spent setting up tooling, build processes and dependencies
- ✅ Technologies the team and I already know
- ✅ No database interaction, it'll proxy our existing APIs

I found it unnecessary to reinvent the wheel by setting up a React app from scratch, dealing with bloaty client-side authentication logic, setting up a router, spending hours choosing a way to write CSS (and panicking forever more that you've chosen the "wrong" approach) and contemplating if I need state management or not. It's a whole load of cognitive overhead that I've deemed a waste of time. This admin panel essentially does two things - [renders a list, and a single item](https://www.trysmudford.com/blog/city-life/#products-apps-not-websites). I landed on using Node.js, Express & [Nunjucks](https://mozilla.github.io/nunjucks/). A lovely, simple, server-rendered website with sessions, out-of-the-box routing, and all of the amazing features we seem to have forgotten come as standard when building "traditional" server applications.

After years of working in SPA-land, rarely touching a server-rendered website, I was amazed at how quick it was to get up and running and start feeling productive right away. Developers are quick to extoll the virtues of tools like Create React App, and whilst I agree - they're great! It really takes a while to start _feeling_ productive when setting up a new SPA from the ground up. So much non-work has to be done before the real work, what you're likely being _paid to do_, can begin.

I had an admin panel with authentication, pages, routes, templates and CSS, flash messaging, The Works™️ set up in an afternoon. I hadn't felt this productive in years. But best of all, it was _fun_. Of course I still enjoy working with our modern, flashy tech stack - but this felt so different. No waiting for recompilation. No React devtools. No props and state flying around. No convoluted centralised state management. No worrying about loading states. Complete bliss. It was functional, it was fast, and it felt solid. The only thing I legitimately missed from a "developer experience" perspective was TypeScript. TypeScript is great, and gives me much more confidence when shipping code.

I would urge front-end developers to take a step back, breathe, and reassess. Let's stop over engineering for the sake of it. Let's think what we can do with the basic tools, progressive enhancement and a simpler approach to building websites. There are absolutely valid usecases for SPAs, React, et al. and I'll continue to use these tools reguarly and when it's necessary, I'm just not sure that's 100% of the time.
