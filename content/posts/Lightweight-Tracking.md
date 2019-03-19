---
title: 'Hello'
date: 2017-08-21T13:21:39Z
draft: true
---

# Lightweight Tracking with the Web Beacon API

Whilst [Trys](https://www.trysmudford.com/blog/announcing-journalbook/) was building [JournalBook](https://journalbook.co.uk), a privacy-centric product, he asked a good question: how can you conceivably collect metrics on how your app is being used, without relying one one of the notorious tracking providers like GA or MixPanel? There are open source equivelants to GA available but they still require hefty client-side libraries and a fair amount of server-side infrastructure to manage. Could we come up with a better, or more lightweight solution?

## Web Beacon API

[Beacons](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API) are a new-ish browser technology which allow developers to send async, responseless POST requests. The browser support is [pretty good](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon#Browser_compatibility), and the tracking can definitely be treated as a progressive enhancement.

## DNT (Do Not Track)

High on the list of priorities was making sure that the tracking requests never fired for users with [DNT](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/DNT) enabled in their web browser. This was actually fairly trivial to do with a few checks on the `navigator` and `window` object.

I wrapped these two up into a reuseable `Beacon` function:

```ts
const trackingUrl = 'https://my.tracking.service/';

function shouldBlockBeacon(): boolean {
  return (
    window.navigator.doNotTrack === '1' ||
    window.navigator.msDoNotTrack === '1' ||
    window.doNotTrack === '1' ||
    window.msDoNotTrack === '1'
  );
}

export const sendBeacon = (type: string): void => {
  if (!navigator.sendBeacon || !trackingUrl || shouldBlockBeacon()) {
    return;
  }

  navigator.sendBeacon(
    trackingUrl,
    JSON.stringify({
      type,
      url: window.location.pathname,
    }),
  );
};
```
