import express from 'express';
import fetch from 'node-fetch';
import RSSParser from 'rss-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const rssParser = new RSSParser();

app.get('/', async (req, res) => {
  const feedUrl = req.query.q;
  const callback = req.query.callback;

  if (!feedUrl) {
    return res.status(400).json({ error: 'Missing "q" query parameter with feed URL.' });
  }

  try {
    const feedResponse = await fetch(feedUrl);
    const feedText = await feedResponse.text();
    const parsedFeed = await rssParser.parseString(feedText);

    const responseData = {
      feed: {
        title: parsedFeed.title,
        description: parsedFeed.description,
        link: parsedFeed.link,
      },
      entries: parsedFeed.items.map((item) => ({
        title: item.title,
        link: item.link,
        author: item.creator || item.author,
        publishedDate: item.pubDate || item.isoDate,
        content: item.content || item['content:encoded'],
        contentSnippet: item.contentSnippet,
      })),
    };

    if (callback) {
      // JSONP response
      res.type('application/javascript');
      res.send(`${callback}(${JSON.stringify(responseData)})`);
    } else {
      // Standard JSON response
      res.json(responseData);
    }
  } catch (error) {
    console.error('Error fetching or parsing feed:', error);
    res.status(500).json({ error: 'Failed to fetch or parse RSS feed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

