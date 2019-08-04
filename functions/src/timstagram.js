const Octokit = require('@octokit/rest');

const github = Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = 'timnovis';
const repo = 'novis';

const postTemplate = (caption, date, id) => `---
title: '${caption}'
date: ${date}
draft: false
tags: 'photo'
---

![${caption}](/media/timstagram/${id}.jpg "${caption}")`;

exports.handler = async function(event, context) {
  const { httpMethod: method, headers, body, path } = event;

  if (method === 'GET') {
    return { statusCode: 501, body: 'Nothing to see here' };
  }

  try {
    const { image, caption, filename, secret } = JSON.parse(body);

    if (secret !== process.env.SECRET) {
      throw new Error('Unauthorized');
    }

    const id = `${filename}-${Date.now()}`;

    const [blob, branch] = await Promise.all([
      github.git.createBlob({
        owner,
        repo,
        content: image,
        encoding: 'base64',
      }),
      github.gitdata.getRef({
        owner,
        repo,
        ref: 'heads/master',
      }),
    ]);

    const tree = await github.git.createTree({
      owner,
      repo,
      tree: [
        {
          path: `static/media/timstagram/${id}.jpg`,
          mode: '100644',
          type: 'blob',
          sha: blob.data.sha,
        },
        {
          path: `content/posts/image-${id}.md`,
          mode: '100644',
          type: 'blob',
          content: postTemplate(caption, new Date().toISOString(), id),
        },
      ],
      base_tree: branch.data.object.sha,
    });

    const commit = await github.git.createCommit({
      owner,
      repo,
      message: `New photo from Tim's iPhone`,
      tree: tree.data.sha,
      parents: [branch.data.object.sha],
    });

    await github.git.updateRef({
      owner,
      repo,
      ref: 'heads/master',
      sha: commit.data.sha,
      force: true,
    });

    return {
      statusCode: 200,
      body: 'success',
    };
  } catch (e) {
    console.log('========================');
    console.log(e);
    console.log('========================');
    return {
      statusCode: 400,
      body: e.toString(),
    };
  }
};
