# Contributing to VAMP Script Hub

The catalog is only useful if an agent can trust what it finds: one task, declared inputs, an observable result, and no secrets. This page is the contract behind the **Submit a script** panel in the site.

## Two ways to submit

| Path | Use it when | What you produce |
| --- | --- | --- |
| Pull request | You have VAMP installed and a reviewed recording | `scripts/<your-id>/` with `source.py`, `rpa.json`, `README.md` |
| Issue | You have source and metadata but no local VAMP | A submission issue; a maintainer registers the folder |

Both paths end in the same folder layout:

```text
scripts/<your-id>/
├── source.py        # recorded PyAutoGUI actions, never executed on the host
├── rpa.json         # format: "vamp-saved-rpa"
├── README.md        # when to use, verification, limits
└── assets/          # optional template images
```

## Recording rules

1. **One task per script.** Split "log in and export a report" into two entries.
2. **Stop before secrets.** No password, PIN, token, one-time code or private-key passphrase may be typed, recorded or screenshotted. Hand those steps back to the user with `needs_user_verification`.
3. **Declare every input.** Each name must appear in the source as a `${name}` placeholder. VAMP rejects declared inputs that never appear in recorded text.
4. **State a result a machine can check.** "The dashboard looks fine" is not a criterion. "OCR finds the heading `Q4 Launch` and the export button is gone" is.
5. **Record at a stated resolution.** 1920×1080 at 100% is the default. Coordinates do not survive a different DPI; say so if your entry depends on it.
6. **Keep the source parseable.** Supported PyAutoGUI actions and ordinary Python control flow. The folder is parsed, not executed, on the host.

## `rpa.json` fields

VAMP writes these when a skill is saved. A pull request should contain the exported file, not a hand-edited one.

| Field | Meaning |
| --- | --- |
| `format` | Always `vamp-saved-rpa` |
| `id` | UUID of the skill folder; keep the exported one |
| `name`, `description` | Shown in `rpa_search` results |
| `when_to_use` | The strongest search signal; write it as a condition |
| `expected_result` | What verification must prove |
| `tags` | Up to 20 short tags |
| `inputs` | Declared `${name}` inputs, max 20 |
| `backend` | `virtualbox` or `kvm` |
| `resolution` | `[width, height]` of the guest screen |
| `reviewed` | Must be `true` for agent replay; repairs clear it |
| `version` | Incremented per save |
| `entrypoints` | `[{ "name": "run", "file": "source.py" }]` |
| `source_sha256`, `actions_sha256`, `action_count` | Written by VAMP on save |

## Review checklist

A maintainer checks, and may ask for a re-record if any of these fail:

- [ ] The source parses as supported PyAutoGUI actions.
- [ ] No credentials, tokens, personal names, addresses or account identifiers appear in the source, README or screenshots.
- [ ] Every declared input appears as `${name}`, and no unused input is declared.
- [ ] The expected result is observable in a screenshot, an OCR pass or a file check.
- [ ] The backend and guest resolution are stated and match the recording.
- [ ] The task does not submit a payment, transfer money, file a legal document, or change an account setting without a human approval step.
- [ ] The README explains the limits: what the script does not do, and what breaks after a UI change.

## Writing the entry in `scripts.json`

The site reads `scripts.json` only. When a script is merged, add an entry with:

- `id`, `version`, `author`, `updated`, `category`, `hypervisors`, `os`, `resolution`, `tags`, `verified`
- bilingual `name`, `summary`, `description`, `when_to_use`, `expected_result`, `verification`, `notes`, `data_handling`
- `inputs` with `name`, `type`, `required`, `example` and a bilingual `desc`
- the exact `code` that ships in `source.py`

Run the JSON through a validator before pushing:

```bash
python3 -m json.tool scripts.json > /dev/null
python3 -m http.server 8000   # then check both EN and KO
```

## Licensing

By submitting, you confirm you recorded the workflow yourself or have the right to share it, and you agree to publish it under the MIT license. VAMP and VAMP Vault remain under their own licenses.
