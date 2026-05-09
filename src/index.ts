import {Hono} from "hono"
import {HTTPException} from "hono/http-exception"
import {fromThrowable} from "neverthrow"
import homepage from "./homepage"

const tryParseURL = fromThrowable((url: string) => new URL(url))

export default new Hono()
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.text(err.message, err.status)
    }
    throw err
  })
  .all("/*", async (c) => {
    const incoming = new URL(c.req.url)
    let target: URL | null = null
    if (
      incoming.pathname.startsWith("/https://") ||
      incoming.pathname.startsWith("/http://")
    ) {
      target = tryParseURL(incoming.pathname.slice(1)).unwrapOr(null)
      if (target) {
        target.search = incoming.search
      }
    }
    const targetHeader = c.req.header("X-Proxy-Target")
    if (targetHeader) {
      target = tryParseURL(targetHeader).unwrapOr(null)
    }
    if (target === null) {
      if (incoming.pathname === "/") {
        return c.html(homepage)
      }
      throw new HTTPException(400, {
        message: "Path or X-Proxy-Target must be valid URL.",
      })
    }
    const headers = new Headers(c.req.raw.headers)
    headers.delete("X-Proxy-Method")
    headers.delete("X-Proxy-Target")
    headers.delete("X-Proxy-Access-Control-Allow-Origin")
    headers.delete("X-Proxy-Access-Control-Allow-Methods")
    headers.delete("X-Proxy-Access-Control-Allow-Headers")
    headers.delete("Host")
    headers.delete("CF-Connecting-IP")
    headers.delete("X-Forwarded-For")
    headers.delete("X-Real-IP")
    const allowOrigin = c.req.header("X-Proxy-Access-Control-Allow-Origin")
    const allowMethods = c.req.header("X-Proxy-Access-Control-Allow-Methods")
    const allowHeaders = c.req.header("X-Proxy-Access-Control-Allow-Headers")
    const maxAge = c.req.header("X-Proxy-Access-Control-Max-Age")
    const method = c.req.header("X-Proxy-Method") || c.req.method
    if (method === "OPTIONS" && (allowOrigin || allowMethods || allowHeaders)) {
      const res = new Response(null)
      if (allowOrigin) {
        res.headers.set("Access-Control-Allow-Origin", allowOrigin)
      }
      if (allowMethods) {
        res.headers.set("Access-Control-Allow-Methods", allowMethods)
      }
      if (allowHeaders) {
        res.headers.set("Access-Control-Allow-Headers", allowHeaders)
      }
      if (maxAge) {
        res.headers.set("Access-Control-Max-Age", maxAge)
      }
      return res
    }
    const res = await fetch(target, {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : c.req.raw.body,
      redirect: "follow",
      credentials: "include",
    })
    if (allowOrigin) {
      res.headers.set("Access-Control-Allow-Origin", allowOrigin)
    }
    if (allowMethods) {
      res.headers.set("Access-Control-Allow-Methods", allowMethods)
    }
    if (allowHeaders) {
      res.headers.set("Access-Control-Allow-Headers", allowHeaders)
    }
    if (maxAge) {
      res.headers.set("Access-Control-Max-Age", maxAge)
    }
    return res
  })
