const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const canonicalHost = env.CANONICAL_HOST?.trim();

    if (canonicalHost && url.hostname !== canonicalHost) {
      url.hostname = canonicalHost;
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
