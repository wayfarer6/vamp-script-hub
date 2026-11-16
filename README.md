<p align="center">
  <img src="assets/img/bat.svg" width="112" height="112" alt="VAMP bat mascot">
</p>

<h1 align="center">VAMP Script Hub</h1>

<p align="center"><strong>Community RPA Script Catalog &amp; Sharing Hub for VAMP AI Agents</strong></p>

<p align="center">
  <a href="https://wayfarer6.github.io/vamp-script-hub/">Live catalog</a> ·
  <a href="https://github.com/wayfarer6/vamp-mcp">VAMP core</a> ·
  <a href="CONTRIBUTING.md">Contribute</a> ·
  <a href="LICENSE">MIT</a>
</p>

A static catalog of reviewed, input-driven GUI workflows for [VAMP](https://github.com/wayfarer6/vamp-mcp). Each entry ships the recorded PyAutoGUI source, its input contract, the verification criteria and the exact `rpa_search` / `rpa_run_saved` calls an agent can use.

The point is to stop paying for the same screen twice. A multimodal agent that reads a login form on every run spends tokens on work a reviewed recording already encodes. The hub makes those recordings findable, comparable and reusable across VirtualBox and KVM guests.

## What is inside

- **Search and filters** across keywords, hypervisor, guest OS and category, in English and Korean.
- **Six seed scripts**: NAVER login form verification, Google SERP extraction, GitHub repo star and release check, Slack desktop status, Notion PDF export, enterprise certificate picker helper.
- **Detail view** with the input table, verification checklist, syntax-highlighted `source.py`, copy and download buttons, the `rpa_run_saved` payload and VS Code import steps.
- **Submission guide and generator** that drafts a `vamp-saved-rpa` metadata file, validates it against the same rules VAMP applies, and opens a pre-filled GitHub issue.

No build step, no dependencies, no tracking. Plain HTML, CSS and JavaScript served by GitHub Pages.

## Repository layout

```text
index.html                     single-page catalog
scripts.json                   the catalog (single source of truth)
assets/css/style.css           theme, layout, components
assets/js/i18n.js              EN/KO strings
assets/js/app.js               render, filter, modal, generator
assets/img/                    bat mascot and favicon
.github/workflows/deploy.yml   GitHub Pages deployment
.github/ISSUE_TEMPLATE/        script submission form
```

Add or edit a script by changing `scripts.json`; the page renders whatever the file contains. Keep both languages filled in: `name`, `summary`, `description`, `when_to_use`, `expected_result`, `verification` and `inputs[].desc` are objects with `en` and `ko`.

## Running locally

```bash
python3 -m http.server 8000
# http://localhost:8000
```

`scripts.json` is fetched at runtime, so open the folder over HTTP rather than by double-clicking `index.html`.

## Submitting a script

1. Record **one** task in a VAMP guest and stop before any password, PIN or token field.
2. In **RPA Library → Create**, add the name, description, when-to-use, input names and expected result, then review and **Export ZIP**.
3. Add `scripts/<your-id>/` with `source.py`, `rpa.json` and `README.md`, and open a pull request.
4. No VAMP install at hand? Open a submission issue; the store's generator can draft the metadata for you.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the review rules.

## 한국어 안내

VAMP AI 에이전트가 같은 GUI 작업을 매번 화면으로 다시 읽지 않도록, 검토를 마친 RPA 기록을 모아 둔 정적 카탈로그입니다. 각 항목에는 PyAutoGUI 소스, 입력 계약, 검증 기준, `rpa_search`·`rpa_run_saved` 호출 예시가 함께 들어 있습니다.

- 상단의 **EN / KO** 버튼으로 언어를 바꿀 수 있고, 선택은 브라우저에 기억됩니다.
- 왼쪽 위 검색창과 하이퍼바이저·게스트 OS·카테고리 필터로 스크립트를 좁혀 볼 수 있습니다.
- 카드를 누르면 입력 파라미터 표, 검증 기준, 강조된 소스, 복사 버튼, VS Code 가져오기 절차가 열립니다.
- **Submit a script**에서 기여 가이드와 생성기를 볼 수 있습니다. 생성기는 VAMP와 같은 규칙으로 메타데이터를 검사하고, 이슈를 미리 채워 엽니다.

`scripts.json`만 고치면 페이지에 바로 반영됩니다. 두 언어(`en`, `ko`)를 모두 채워 주세요.

## License

MIT. The scripts are recordings of GUI work; review them before reuse and never store credentials in a recording.
