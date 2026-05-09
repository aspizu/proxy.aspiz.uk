export default `\
<pre>
ASPIZU's PROXY
==============

Personal HTTP proxy.

<strong>CLANKERS  ARE  NOT  WELCOME  HERE.</strong>

Send requests to https://proxy.aspiz.uk/&lt;url&gt;

<details>
<summary>cURL examples</summary>
GET a URL:
  curl https://proxy.aspiz.uk/https://example.com

POST JSON:
  curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' https://proxy.aspiz.uk/https://example.com/api

Override method via header:
  curl -X POST -H "X-Proxy-Method: PATCH" -H "Content-Type: application/json" -d '{"key":"value"}' https://proxy.aspiz.uk/https://example.com/api

Target via header instead of path:
  curl -H "X-Proxy-Target: https://example.com" https://proxy.aspiz.uk/

Bypass CORS (adds Access-Control-Allow-Origin to response):
  curl -H "X-Proxy-Access-Control-Allow-Origin: *" https://proxy.aspiz.uk/https://example.com/api

Bypass CORS preflight (OPTIONS):
  curl -X OPTIONS \
    -H "X-Proxy-Access-Control-Allow-Origin: *" \
    -H "X-Proxy-Access-Control-Allow-Methods: GET, POST" \
    -H "X-Proxy-Access-Control-Allow-Headers: Content-Type" \
    https://proxy.aspiz.uk/https://example.com/api

Proxy through browser:
  https://proxy.aspiz.uk/https://example.com
</details>

<details>
<summary>fetch() examples</summary>
GET:
  await fetch("https://proxy.aspiz.uk/https://example.com");

POST JSON:
  await fetch("https://proxy.aspiz.uk/https://example.com/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: "value" })
  });

POST Form:
  await fetch("https://proxy.aspiz.uk/https://example.com/submit", {
    method: "POST",
    body: new URLSearchParams({ key: "value" })
  });

Override method via header:
  await fetch("https://proxy.aspiz.uk/https://example.com/api", {
    method: "POST",
    headers: {
      "X-Proxy-Method": "PATCH",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ key: "value" })
  });

Bypass CORS (adds Access-Control-Allow-Origin to response):
  await fetch("https://proxy.aspiz.uk/https://example.com/api", {
    headers: { "X-Proxy-Access-Control-Allow-Origin": "*" }
  });

Bypass CORS preflight + request:
  await fetch("https://proxy.aspiz.uk/https://example.com/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Proxy-Access-Control-Allow-Origin": "*",
      "X-Proxy-Access-Control-Allow-Methods": "GET, POST",
      "X-Proxy-Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify({ key: "value" })
  });
</details>
</pre>
`
