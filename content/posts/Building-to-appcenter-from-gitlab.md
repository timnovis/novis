---
title: "Building to AppCenter from GitLab"
date: 2018-04-20T16:39:43+01:00
draft: false
---

When I initially found out about [AppCenter.ms](https://appcenter.ms/), I was really excited to start using it, until, to my disappointment, I found that there was no support for GitLab. I didn't stop there though!

I knew in order to get this working I'd have to use one of AppCenter's supported git integrations, GitHub, BitBucket or VSTS. I knew I could mirror the repository from GitLab to one of these providers, and the most cost effective option seemed to be BitBucket as they have a great free plan for teams which allows private repositories.

## Mirroring

First of all, I set up an empty repo on BitBucket called `native-mirror` where the code from GitLab would be mirrored to. Secondly, I read up on [GitLab's repository mirroring feature](https://docs.gitlab.com/ee/workflow/repository_mirroring.html) which sounded great at first, and I'm sure is great - but due to reasons unknown to me, and I suspect is due to Atlassian's SSO with BitBucket, I couldn't get it to work using the repo's username:password HTTPS URL. Which brings me on to:

## .gitlab-ci.yml

We're already using GitLab's [great CI features](https://about.gitlab.com/features/gitlab-ci-cd/) to run tests on our codebase, so I imagined it wouldn't be too hard to manually mirror the repo every time the pipeline was run. I found this [great guide](https://docs.gitlab.com/ee/ci/ssh_keys/) on how to use SSH keys with .gitlab-ci.yml.

- Run `ssh-keygen -t rsa -b 4096 -C "bitbucketuser@example.com"` with _no passphrase_ and copy it to your clipboard.

- Add it to the [Secret Variables](https://docs.gitlab.com/ee/ci/variables/#secret-variables) of your repository in GitLab under the key SSH_PRIVATE_KEY

- Copy the _public key_ you generated and add it to the SSH keys section in the settings of your BitBucket account

- If you haven't got one already, create the file `.gitlab-ci.yml` in the root of your project

- In that file, use this configuration:

```yaml
image: timbru31/node-alpine-git:latest

stages:
  - mirror

before_script:
  - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client git -y )'
  - eval $(ssh-agent -s)
  - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null
  - mkdir -p ~/.ssh
  - chmod 700 ~/.ssh
  - ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts
  - chmod 644 ~/.ssh/known_hosts
  - git config --global user.email "bitbucketuser@example.com"
  - git config --global user.name "BitBucket User"
  - ssh -T git@bitbucket.org

mirror:
  stage: mirror
  script:
    - git push --mirror git@bitbucket.org:yourorg/repo.git
```

Note: the docker image node-alpine-git might not be quite right for you if you're not working on a JavaScript/RN project. Make sure you replace the git config lines with your own. Make sure you swap out the git URL on the last line for your own

## AppCenter

Make a commit to your project, and make sure everything's working properly. If everything _has_ worked, your repo will be mirroring to BitBucket every time you push to GitLab.

Create an AppCenter account, and under the Build pane, connect to your BitBucket account and select the mirrored repo.

That's it!
