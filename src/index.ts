import {Hono} from "hono"
import {HTTPException} from "hono/http-exception"

function _parseURL(url?: string | null): URL {
  if (!url) {
    throw new HTTPException(400, {
      message: "URL is required",
    })
  }

  try {
    return new URL(url)
  } catch {
    throw new HTTPException(400, {
      message: "Invalid URL",
    })
  }
}

const app = new Hono()

app.all("/*", async (c) => {
  const target = _parseURL(c.req.header("X-Proxy-Target"))
  const incoming = new URL(c.req.url)
  const resolved = new URL(target)
  resolved.pathname = incoming.pathname
  resolved.search = incoming.search
  const headers = new Headers(c.req.raw.headers)
  headers.delete("X-Proxy-Target")
  headers.delete("Host")
  headers.delete("CF-Connecting-IP")
  headers.delete("X-Forwarded-For")
  headers.delete("X-Real-IP")
  return fetch(resolved.toString(), {
    method: c.req.method,
    headers,
    body:
      c.req.method === "GET" || c.req.method === "HEAD" ? undefined : c.req.raw.body,
    redirect: "follow",
  })
})

export default app
