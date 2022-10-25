const getFeed = (data) => {
  const title = data.querySelector('title').textContent;
  const description = data.querySelector('description').textContent;
  return { title, description };
};

const getPosts = (data) => {
  const items = data.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    return { title, description, link };
  });
  return posts;
};

export default (rss) => {
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(rss, 'text/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('noRSS');
  }
  const feed = getFeed(doc);
  const posts = getPosts(doc);
  return { feed, posts };
};
