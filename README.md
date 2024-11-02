# afpy

simple RSS feed parsing server in node

```npm install```

### Run the Server

Run npm start to start the server.

```npm start```

Test by accessing http://localhost:3000/?q=https://example.com/feed (replace with an actual feed URL).

If you need JSONP, add &callback=someCallback to the request URL.
This setup should now handle requests as expected by the older app, with the root URL endpoint and support for JSONP output.

Once you've got your server running, you can use a feed reader, something like this and employ some style templates. 
```fetch(`${host}/?q=${encodeURIComponent(feedUrl)}`);```
