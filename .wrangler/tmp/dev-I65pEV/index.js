var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/index.ts
var api_default = {
  async fetch(req, env) {
    const url = new URL(req.url);
    console.log("Worker received request for:", url.pathname);
    if (url.pathname === "/api/songs" && req.method === "POST") {
      try {
        const songData = await req.json();
        const { title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status } = songData;
        const stmt = env.DB.prepare(
          `INSERT INTO songs (title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );
        const result = await stmt.bind(
          title,
          artist,
          youtube_link,
          lyrics,
          composer,
          language,
          region,
          category,
          tags,
          duration,
          is_featured,
          status
        ).run();
        return Response.json({ success: true, result }, { status: 201 });
      } catch (e) {
        let errorMessage = "An unknown error occurred";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        return Response.json({ success: false, error: errorMessage }, { status: 400 });
      }
    }
    if (url.pathname.startsWith("/api/songs/") && req.method === "PUT") {
      try {
        const id = url.pathname.split("/").pop();
        if (!id) {
          return new Response("Song ID missing", { status: 400 });
        }
        const songData = await req.json();
        const { title, artist, youtube_link, lyrics, composer, language, region, category, tags, duration, is_featured, status } = songData;
        const stmt = env.DB.prepare(
          `UPDATE songs SET title = ?, artist = ?, youtube_link = ?, lyrics = ?, composer = ?, language = ?, region = ?, category = ?, tags = ?, duration = ?, is_featured = ?, status = ? WHERE id = ?`
        );
        const result = await stmt.bind(
          title,
          artist,
          youtube_link,
          lyrics,
          composer,
          language,
          region,
          category,
          tags,
          duration,
          is_featured,
          status,
          id
        ).run();
        if (result.changes === 0) {
          return new Response("Song not found or no changes made", { status: 404 });
        }
        return Response.json({ success: true, result }, { status: 200 });
      } catch (e) {
        let errorMessage = "An unknown error occurred";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        return Response.json({ success: false, error: errorMessage }, { status: 400 });
      }
    }
    if (url.pathname.startsWith("/api/songs/") && req.method === "DELETE") {
      try {
        const id = url.pathname.split("/").pop();
        if (!id) {
          return new Response("Song ID missing", { status: 400 });
        }
        const stmt = env.DB.prepare(`DELETE FROM songs WHERE id = ?`);
        const result = await stmt.bind(id).run();
        if (result.changes === 0) {
          return new Response("Song not found", { status: 404 });
        }
        return Response.json({ success: true, message: "Song deleted successfully" }, { status: 200 });
      } catch (e) {
        let errorMessage = "An unknown error occurred";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        return Response.json({ success: false, error: errorMessage }, { status: 400 });
      }
    }
    if (url.pathname === "/api/songs" && req.method === "GET") {
      try {
        const { searchParams } = url;
        const search = searchParams.get("search");
        const language = searchParams.get("language");
        const category = searchParams.get("category");
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const offset = parseInt(searchParams.get("offset") || "0", 10);
        let query = "SELECT * FROM songs";
        const conditions = [];
        const bindings = [];
        if (search) {
          conditions.push(`(title LIKE ? OR artist LIKE ?)`);
          bindings.push(`%${search}%`, `%${search}%`);
        }
        if (language) {
          conditions.push("language = ?");
          bindings.push(language);
        }
        if (category) {
          conditions.push("category = ?");
          bindings.push(category);
        }
        if (conditions.length > 0) {
          query += ` WHERE ${conditions.join(" AND ")}`;
        }
        query += " ORDER BY title LIMIT ? OFFSET ?";
        bindings.push(limit, offset);
        const stmt = env.DB.prepare(query).bind(...bindings);
        const { results } = await stmt.all();
        return Response.json(results);
      } catch (e) {
        let errorMessage = "An unknown error occurred";
        if (e instanceof Error) {
          errorMessage = e.message;
        }
        return Response.json({ success: false, error: errorMessage }, { status: 500 });
      }
    }
    if (url.pathname.startsWith("/api/songs/")) {
      const id = url.pathname.split("/").pop();
      const result = await env.DB.prepare(`SELECT * FROM songs WHERE id = ?`).bind(id).first();
      return result ? Response.json(result) : new Response("Not Found", { status: 404 });
    }
    return new Response("Hello from Worker");
  }
};

// ../../Users/user/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../Users/user/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-XVzPMO/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = api_default;

// ../../Users/user/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-XVzPMO/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
