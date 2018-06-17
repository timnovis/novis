---
title: "Custom Aliases in React Native with Babel"
date: 2018-04-09T10:17:17+01:00
draft: false
---

Is there anything more infuriating than diving into a JavaScript project to find this?

```js
import Component from '../../../some/deeply/ambiguous/location';
```

Imagine if we could just `import Component from 'myAlias/component';` from anywhere in the codebase!

It's super easy to set up - and there are a few ways to achieve it too.

## 1. With .babelrc

If your project doesn't use Webpack - for example if you're working with React Native, you can use your `.babelrc` file and a babel plugin to get aliasing set up.

Firstly, you'll want to install `babel-plugin-module-resolver` with yarn or npm.

Once you've done that, open up your project's `.babelrc` file, and under the `plugins` key, add this:

```js
[
  'module-resolver',
  {
    root: ['./src'],
    alias: {
      myAlias: './src',
    },
  },
];
```

The `root` key here specifies a custom project root. For example, with a custom root of `src`, if you wanted to import something from `src/components/x`, you can simply `import x from 'components/x';`.

The `alias` key is self explanatory and you can add as many of these as you like. With an alias of `myAlias`, you can then `import x from 'myAlias/components/x';` from anywhere within your project. Nice!

Read more about this plugin and view the documentation [here](https://github.com/tleunen/babel-plugin-module-resolver)

## 2. With Webpack

If your project uses Webpack, it's super simple to jump into the config and set up aliasing.

Under the `resolve` key in your configuration, you can add a new key called `alias` like so:

```js
alias: {
  'myAlias': path.resolve('src'),
}
```

You can read more about this at Webpack's documentation site [here](https://webpack.js.org/configuration/resolve/#resolve-alias)

## 3. The package.json hack

I've used this workaround before, but didn't like all of the loose files floating around in my project. All you need to do is create a `package.json` file in the root of each folder you'd like to alias, containing this:

```json
{
  "name": "myAlias"
}
```

Now you can `import x from 'myAlias/components/x'` from anywhere in your codebase.
