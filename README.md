# What's in this folder

Drop these into your repo at the matching paths (overwrite the old `index.html`
and `movs.html`, add the new `assets/css/style.css`):

```
index.html                  → repo root (replaces old one)
movs.html                    → repo root (replaces old one)
assets/css/style.css         → new file
cloudflare-worker.js         → NOT part of the site — this deploys to Cloudflare, not GitHub
```

## 1. Suggestion box — why it only worked on your own computer

`Coding/server.py` is a real backend, but it only runs on `localhost`. GitHub
Pages serves static files only — it can't run Python — so on the live site
every visitor was silently falling back to `localStorage`, which is private
to each browser. That's why nobody else could see what got submitted.

**Fix:** suggestions are now stored as GitHub Issues on your repo (since
that's what you picked). Two-step setup, both free:

1. **Create a label** called `suggestion` on your repo: Issues tab → Labels
   → New label.
2. **Deploy the Worker** (`cloudflare-worker.js`) so writes have somewhere to
   go — a static page can't hold a secret token, so the token lives in the
   Worker instead:
   - Sign up free at workers.cloudflare.com → Create Worker → paste the
     file's contents in.
   - On GitHub: Settings → Developer settings → Fine-grained tokens →
     generate one scoped to **only** this repo, permission **Issues:
     Read and write**, nothing else.
   - In the Worker: Settings → Variables → add a secret `GITHUB_TOKEN` with
     that token's value.
   - Deploy, copy the `*.workers.dev` URL it gives you.
   - Open `movs.html`, find `WORKER_URL` near the top of the `<script>`
     block, paste the URL in.

Reading suggestions back needs no setup — public repo issues are public, so
`movs.html` pulls them straight from the GitHub API on load, which works
from any device.

**To remove a submission**, close its issue on GitHub (the page only shows
open ones). The old "Clear log" button prompted for a password, but that
password was sitting in plain text in the page's own source — anyone could
view-source and read it, so it wasn't actually protecting anything. I
dropped it rather than leave fake security in place.

**Also fixed:** the log was rendering submitted text with `innerHTML`,
meaning someone could submit `<script>...</script>` as a "suggestion" and it
would run for every other visitor who viewed the log. It now renders as
plain text.

## 2. Code library — what I found

Excluded from the cleanup:
- **`Coding/examextract.py` + `prefixes.txt`** — this automates logging into
  your school's exam portal (`my20.awfatech.com`) and looping through a list
  of ~hundreds of student ID prefixes to pull grade data. That's accessing
  other students' private records without their authorization, which I'm
  not able to help with regardless of the reason. Worth pulling this out of
  the public repo too, since anyone can currently download it.

Real bugs found in what's left:
- **`Coding/idklayers.py`**, line 28: `Dense(4, input_dim=10, ...)` — your
  actual input data has 3 features, not 10. Keras ignores it here because
  `Input(shape=(3,))` already ran first, so it doesn't crash, but it's
  misleading dead code if you ever remove that line.
- **`Coding/mytoepicrecog.py`**, line 7: hardcoded absolute path
  (`/Users/<you>/Documents/Hacking/bookcode/...`). Works only on your exact
  machine — swap it for a path relative to the script (`Path(__file__).parent / "..."`)
  if you want it portable.
- **`Coding/server.py`**: the `/clear-suggestions` "password" is just your
  public YouTube URL, visible in the file itself — not a real password.
  Moot now since suggestions moved to GitHub Issues, but worth knowing for
  anything else you build this way.
- Unused import `from tensorflow.python.framework import ops` in
  `clothing_recog.py` and `singlepicrecog.py` — harmless, just dead weight.
- `car_racing_game.py` and `driftcargame.py` are large enough (1200+ and
  850+ lines) that I didn't do a line-by-line pass this round — happy to
  dig into either if something specific is breaking.

Everything else (`snake*.py`, `2layers.py`/`3layers.py`, `imageditor.py`,
`AttendanceSync/`, `um.py`, `secret.py`, `track_progress.py`) compiles clean
and looked fine on a read-through.

## 3. Front page

Restyled (`index.html` + `assets/css/style.css`), and set up for multiple
featured videos instead of just one. Two of the three video slots are
placeholders — send over the video links/IDs you want in there and I'll
fill them in, or swap `VIDEO_ID_HERE` yourself (it's the part of the
YouTube URL after `watch?v=`).

## 4. Not done yet

I held off on reorganizing the rest of the directory structure and
restyling every other page (`study.html`, `science.html`, `aindex*.html`,
etc.) in this pass — with 60+ MB of images/videos and a lot of cross-page
links, I'd rather do that carefully in a follow-up than risk breaking links
by rushing it. Let me know if you want to keep going and I'll pick the next
page.
