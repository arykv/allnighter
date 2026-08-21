# dps-gandhinagar.in

The one-page placeholder served at **dps-gandhinagar.in** via GitHub Pages.

This branch is deliberately an orphan — it shares no history with `main` and
holds no part of the application there. GitHub Pages publishes it from the
branch root.

## Why this exists

The domain used to serve a full copy of the old notes site. That copy was a
stuck Pages deployment: it could never update, it 404'd on every route added
after it, and it competed for the same content as the site it had been copied
from. Duplicate content on a second domain splits your own search authority.

So the domain now serves one page saying who owns it, and nothing else.

## It deliberately points nowhere

**There is no outbound link on this page. That is the current intent, not an
omission to be helpfully fixed.** An earlier version carried a card linking to
the site the notes had moved to; Aryan removed it on 30 Jul 2026 and asked for
the domain to stand alone for now. If a link is ever wanted back, that is his
call to make explicitly.

Every page here stays `noindex, follow`, and `robots.txt` allows crawling. That
sounds backwards and isn't: a crawler blocked from fetching the page never sees
the `noindex`, so the old indexed URLs would sit in the index forever.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page. Self-contained: no build, no fonts, no requests. |
| `404.html` | The same page, so old deep links land somewhere human. |
| `CNAME` | Binds the custom domain. **Deleting this unbinds it.** |
| `robots.txt` | Allows crawling — required for `noindex` to be seen at all. |

## Changing it

Edit and push to this branch. **Pushing is not always enough** — the Pages API
does not reliably rebuild when this branch changes, and the old deployment keeps
being served. Follow up with:

```
gh api -X POST repos/arykv/allnighter/pages/builds
```

Then check the live page for text you just changed, not for a 200.

Don't merge `main` into this branch, and don't delete `CNAME`.
