/* VAMP Script Hub — UI strings (EN / KO).
   All copy lives here so both languages stay complete. Script content is
   bilingual inside scripts.json. Authored strings may contain small inline
   HTML (<code>, <strong>); all runtime data is escaped separately. */
(function () {
  "use strict";

  const en = {
    "meta.title": "VAMP Script Hub — Community RPA Script Catalog",
    "meta.description":
      "Community RPA script catalog and sharing hub for VAMP AI agents. Reviewed, input-driven PyAutoGUI workflows for VM-isolated guest desktops.",

    "a11y.skip": "Skip to the catalog",
    "a11y.lang": "Language",
    "a11y.close": "Close",
    "a11y.clearSearch": "Clear search",
    "a11y.cardOpen": "Open details for {name}",

    "nav.catalog": "Scripts",
    "nav.how": "How it works",
    "nav.submit": "Submit",

    "hero.eyebrow": "VAMP RPA Library · community catalog",
    "hero.slogan": "Community RPA Script Catalog & Sharing Hub for VAMP AI Agents",
    "hero.lede":
      "Reviewed, input-driven PyAutoGUI workflows for VM-isolated guest desktops. Find the recording once, reuse it with declared inputs, and stop paying tokens to re-read the same screen on every run.",
    "hero.browse": "Browse scripts",
    "hero.submit": "Submit a script",
    "hero.fact1": "6 verified scripts",
    "hero.fact2": "VirtualBox · KVM",
    "hero.fact3": "No secrets in inputs",
    "hero.fact4": "MIT licensed",
    "hero.chip": "verified · 1920×1080",

    "stats.scripts": "Scripts",
    "stats.scriptsSub": "in the shared catalog",
    "stats.verified": "Verified",
    "stats.verifiedSub": "reviewed and marked",
    "stats.hyper": "Hypervisors",
    "stats.hyperSub": "VirtualBox · KVM",
    "stats.os": "Guest OS",
    "stats.osSub": "Windows 11 · Debian/Ubuntu",

    "how.title": "Record once. Search before the next CUA loop.",
    "how.lede":
      "VAMP exists to stop re-deriving the same GUI work. The hub is where those recordings are found, compared and reused.",
    "how.a.title": "Record in a guest",
    "how.a.body":
      "A human or CUA performs the task inside a VAMP VM. The guest recorder writes PyAutoGUI source; the host parses it without ever executing it.",
    "how.b.title": "Save an input contract",
    "how.b.body":
      "Declare <code>${placeholders}</code>, the expected result and the review state. The skill is versioned per folder, with its own Git history.",
    "how.c.title": "Reuse, then verify",
    "how.c.body":
      "An agent runs <code>rpa_search</code> first, replays a match with <code>rpa_run_saved</code>, and checks the expected result before reporting success.",

    "catalog.title": "Script catalog",
    "catalog.lede":
      "Every entry ships its source, input contract and verification criteria. Filter by hypervisor, guest OS or category.",
    "catalog.updated": "Updated",
    "catalog.search": "Search scripts, tags, inputs…",
    "catalog.reset": "Clear filters",
    "catalog.count": "{n} scripts",
    "catalog.countOne": "1 script",
    "catalog.noMatch": "No scripts match these filters.",
    "catalog.loadError":
      "Could not load scripts.json. Serve this folder over HTTP (GitHub Pages does that automatically) and reload.",

    "filter.hyper": "Hypervisor",
    "filter.os": "Guest OS",
    "filter.cat": "Category",
    "filter.all": "All",
    "filter.backend.any": "Any backend",
    "filter.os.any": "Any guest",
    "filter.cat.any": "Every category",

    "card.inputs": "{n} inputs",
    "card.inputOne": "1 input",
    "card.verified": "Verified",
    "card.updated": "Updated {date}",
    "card.open": "Open",
    "card.noCode": "No source attached",

    "empty.title": "No scripts match these filters",
    "empty.body": "Try a different keyword, or clear the filters to see the whole catalog.",

    "cta.title": "Your recording is someone's shortcut",
    "cta.body":
      "Export the reviewed skill from VS Code, drop the folder into this repository, and open a pull request. No build step, no secrets, no private recordings.",
    "cta.submit": "Submit a script",
    "cta.guide": "Contribution guide",

    "footer.tag": "Community catalog for VAMP AI agents",
    "footer.core": "VAMP core",
    "footer.guide": "User guide",
    "footer.spec": "RPA package spec",
    "footer.issues": "Issues",
    "footer.note": "Automation runs in a local VM under your authorization. Review every recording before sharing it.",

    "detail.version": "Version",
    "detail.overview": "Overview",
    "detail.updated": "Updated",
    "detail.author": "Author",
    "detail.license": "License",
    "detail.backend": "Backend",
    "detail.resolution": "Recorded resolution",
    "detail.when": "When to use",
    "detail.expected": "Expected result",
    "detail.inputs": "Input contract",
    "detail.verify": "Verification criteria",
    "detail.source": "Source (PyAutoGUI)",
    "detail.run": "Run from an agent",
    "detail.import": "Import into VS Code",
    "detail.data": "Data handling",
    "detail.deps": "Dependencies",
    "detail.notes": "Recorded notes",
    "detail.copy": "Copy",
    "detail.copied": "Copied",
    "detail.download": "Download source.py",
    "detail.inputName": "Name",
    "detail.inputType": "Type",
    "detail.inputReq": "Required",
    "detail.inputExample": "Example",
    "detail.inputDesc": "Description",
    "detail.required": "Required",
    "detail.optional": "Optional",
    "detail.runNote":
      "<code>id</code> is the UUID of the skill folder in your own RPA Library, not this catalog slug. Resolve it with <code>rpa_search</code>, then pass the exact VM UUID and every declared input. <code>confirmed:true</code> is the authorization step; nothing runs without it.",
    "detail.resultNote":
      "<code>completed_unverified</code> means the actions ran, not that the task succeeded. Check the expected result with the cheapest reliable observation before reporting success.",
    "detail.importSteps":
      "<li>Open <strong>RPA Library</strong> in the VS Code VAMP sidebar and click <strong>Add RPA Folder</strong>.</li><li>Point it at the exported skill folder (<code>source.py</code>, <code>rpa.json</code>, <code>actions.json</code>), or record the same steps in a guest and use <strong>Create</strong>.</li><li>Declare the inputs above under <strong>Input names</strong> so the <code>${name}</code> placeholders resolve; unused names are rejected.</li><li>Review the recording and check <strong>I reviewed this recording and allow agent reuse</strong> before saving.</li><li>Start <strong>VAMP RPA Library</strong> MCP and enable its tools so agents can call <code>rpa_search</code> and <code>rpa_run_saved</code>.</li>",
    "detail.openRepo": "View on GitHub",
    "detail.copyToast": "Copied to clipboard",
    "detail.downloadToast": "source.py downloaded",
    "detail.noDeps": "None beyond the VAMP guest runtime",
    "detail.sourceFile": "source.py",
    "detail.callFile": "rpa_run_saved call",
    "detail.searchFile": "rpa_search call",
    "detail.verifiedTag": "Verified",

    "submit.kicker": "Contribution",
    "submit.title": "Submit a script",
    "submit.tab.guide": "Guide",
    "submit.tab.gen": "Generator",
    "submit.intro":
      "Good entries are boring on purpose: one task, declared inputs, an observable result, and no secrets anywhere in the recording. Pick the path that fits you.",
    "submit.step1.title": "Record, then stop before secrets",
    "submit.step1.body":
      "Run the guest recorder (<code>Start-Recorder.cmd</code> on Windows, <code>start-recorder.sh</code> on Debian/X11) for exactly one task. Stop before any password, PIN, token or passphrase field. Delete the private recording afterwards.",
    "submit.step2.title": "Review and export the skill",
    "submit.step2.body":
      "In <strong>RPA Library → Create</strong>, fill in name, description, when-to-use, input names and expected result. Review it, then use <strong>Export ZIP</strong>. The ZIP carries <code>VAMP_EXPORT.json</code> with per-file SHA-256 checksums and never contains <code>.git</code> history.",
    "submit.step3.title": "Publish the folder",
    "submit.step3.body":
      "Fork <code>wayfarer6/vamp-script-hub</code>, add <code>scripts/&lt;your-id&gt;/</code> with <code>source.py</code>, <code>rpa.json</code> and <code>README.md</code>, then open a pull request. No VAMP install handy? Open a submission issue with the source and metadata and a maintainer will register it.",
    "submit.step4.title": "What reviewers check",
    "submit.step4.body":
      "Source parses as supported PyAutoGUI actions, every input appears as a <code>${name}</code> placeholder, the expected result is observable from a screenshot, OCR or a file check, the guest resolution is stated, and the entry contains no personal data.",
    "submit.treeTitle": "Package layout",
    "submit.tree":
      "scripts/<span class=\"hot\">your-script-id</span>/\n├── <span class=\"hot\">source.py</span>        # recorded PyAutoGUI actions\n├── <span class=\"hot\">rpa.json</span>         # id, inputs, backend, expected result\n├── <span class=\"hot\">README.md</span>        # when to use, verification, limits\n└── assets/          <span class=\"dim\"># optional template images</span>",
    "submit.openIssue": "Open submission issue",
    "submit.readGuide": "Read CONTRIBUTING",
    "submit.openGen": "Open the generator",
    "submit.guideNote":
      "By submitting you agree to publish the recording under the MIT license and confirm it contains no credentials, tokens or personal text. Maintainers may ask for a re-record at a different resolution.",

    "gen.intro":
      "No recorder at hand? Draft the metadata here, copy the result into your fork, or open an issue with the draft. Hashes and action counts are written by VAMP when the skill is saved, so they are left out of this draft.",
    "gen.id": "Script ID",
    "gen.idHint": "lowercase, digits, dashes",
    "gen.title": "Title",
    "gen.backend": "Backend",
    "gen.resolution": "Recorded resolution",
    "gen.inputs": "Input names",
    "gen.inputsHint": "comma separated",
    "gen.tags": "Tags",
    "gen.tagsHint": "comma separated",
    "gen.description": "Description",
    "gen.when": "When should an agent use it?",
    "gen.expected": "Expected result",
    "gen.verify": "Verification checklist",
    "gen.verifyHint": "one per line",
    "gen.code": "source.py (PyAutoGUI)",
    "gen.codeHint": "declare inputs as ${name}",
    "gen.generate": "Generate draft",
    "gen.copyManifest": "Copy rpa.json",
    "gen.copyReadme": "Copy README.md",
    "gen.issue": "Open issue with draft",
    "gen.reset": "Reset",
    "gen.preview": "Draft preview",
    "gen.msg.id": "Script ID must start with a letter and use only lowercase letters, digits, dashes or underscores.",
    "gen.msg.title": "Title is required (up to 120 characters).",
    "gen.msg.description": "Description must be 10–4000 characters so agents can match on it.",
    "gen.msg.when": "Add when the agent should use it; this is the strongest search signal.",
    "gen.msg.expected": "Describe an observable expected result.",
    "gen.msg.code": "Paste the recorded PyAutoGUI source.",
    "gen.msg.input": "Input names must match [A-Za-z_][A-Za-z0-9_] and at most 20 are allowed.",
    "gen.msg.placeholder": "Input “{input}” has no ${…} placeholder in the source. VAMP rejects unused input names.",
    "gen.msg.ready": "Draft ready. Copy it into scripts/{id}/ or open an issue.",
    "gen.msg.draft": "Draft only — VAMP fills source_sha256, actions_sha256 and action_count when the skill is saved.",
    "gen.msg.tooLong":
      "The source is too long for a pre-filled issue URL, so the issue will open without it. Paste source.py into the issue text field afterwards.",
    "gen.empty": "Fill in the fields and press “Generate draft”.",
    "gen.treeTitle": "Folder to add",
    "gen.issueTitle": "[Script] {name}",
    "gen.backendVirtualbox": "VirtualBox",
    "gen.backendKvm": "KVM",
    "gen.copyToast": "Draft copied",

    "toast.lang": "Language changed"
  };

  const ko = {
    "meta.title": "VAMP Script Hub — 커뮤니티 RPA 스크립트 카탈로그",
    "meta.description":
      "VAMP AI 에이전트를 위한 커뮤니티 RPA 스크립트 카탈로그이자 공유 허브입니다. VM으로 격리된 게스트 데스크톱용으로 검토된 입력 기반 PyAutoGUI 워크플로를 모았습니다.",

    "a11y.skip": "카탈로그로 건너뛰기",
    "a11y.lang": "언어",
    "a11y.close": "닫기",
    "a11y.clearSearch": "검색어 지우기",
    "a11y.cardOpen": "{name} 상세 열기",

    "nav.catalog": "스크립트",
    "nav.how": "동작 방식",
    "nav.submit": "제출",

    "hero.eyebrow": "VAMP RPA Library · 커뮤니티 카탈로그",
    "hero.slogan": "VAMP AI 에이전트를 위한 커뮤니티 RPA 스크립트 카탈로그 · 공유 허브",
    "hero.lede":
      "VM으로 격리된 게스트 데스크톱을 위한, 검토를 마친 입력 기반 PyAutoGUI 워크플로입니다. 기록을 한 번 찾아 두고 선언된 입력값으로 재사용하면, 매 실행마다 같은 화면을 토큰으로 다시 읽지 않아도 됩니다.",
    "hero.browse": "스크립트 둘러보기",
    "hero.submit": "스크립트 제출하기",
    "hero.fact1": "검증된 스크립트 6개",
    "hero.fact2": "VirtualBox · KVM",
    "hero.fact3": "입력값에 비밀 정보 없음",
    "hero.fact4": "MIT 라이선스",
    "hero.chip": "검증 완료 · 1920×1080",

    "stats.scripts": "스크립트",
    "stats.scriptsSub": "공유 카탈로그 기준",
    "stats.verified": "검증 완료",
    "stats.verifiedSub": "검토 후 표시됨",
    "stats.hyper": "하이퍼바이저",
    "stats.hyperSub": "VirtualBox · KVM",
    "stats.os": "게스트 OS",
    "stats.osSub": "Windows 11 · Debian/Ubuntu",

    "how.title": "한 번 기록하고, 다음 CUA 루프 전에 먼저 검색하세요.",
    "how.lede":
      "VAMP는 같은 GUI 작업을 매번 다시 만들어 내지 않기 위해 존재합니다. 이 허브는 그 기록을 찾고, 비교하고, 다시 쓰는 곳입니다.",
    "how.a.title": "게스트에서 기록",
    "how.a.body":
      "사람 또는 CUA가 VAMP VM 안에서 작업을 수행합니다. 게스트 레코더가 PyAutoGUI 소스를 남기고, 호스트는 이를 실행하지 않은 채 해석만 합니다.",
    "how.b.title": "입력 계약으로 저장",
    "how.b.body":
      "<code>${placeholders}</code>와 기대 결과, 검토 상태를 선언합니다. 스킬은 폴더 단위로 자체 Git 이력을 가지며 버전이 올라갑니다.",
    "how.c.title": "재사용하고, 검증하기",
    "how.c.body":
      "에이전트는 먼저 <code>rpa_search</code>를 호출하고, 맞는 항목을 <code>rpa_run_saved</code>로 재생한 뒤, 성공을 보고하기 전에 기대 결과를 확인합니다.",

    "catalog.title": "스크립트 카탈로그",
    "catalog.lede":
      "모든 항목이 소스, 입력 계약, 검증 기준을 함께 제공합니다. 하이퍼바이저, 게스트 OS, 카테고리로 걸러 보세요.",
    "catalog.updated": "업데이트",
    "catalog.search": "스크립트, 태그, 입력값 검색…",
    "catalog.reset": "필터 초기화",
    "catalog.count": "스크립트 {n}개",
    "catalog.countOne": "스크립트 1개",
    "catalog.noMatch": "조건에 맞는 스크립트가 없습니다.",
    "catalog.loadError":
      "scripts.json을 불러오지 못했습니다. 이 폴더를 HTTP로 제공한 뒤 다시 열어 주세요(GitHub Pages는 자동으로 제공합니다).",

    "filter.hyper": "하이퍼바이저",
    "filter.os": "게스트 OS",
    "filter.cat": "카테고리",
    "filter.all": "전체",
    "filter.backend.any": "모든 백엔드",
    "filter.os.any": "모든 게스트",
    "filter.cat.any": "모든 카테고리",

    "card.inputs": "입력 {n}개",
    "card.inputOne": "입력 1개",
    "card.verified": "검증됨",
    "card.updated": "수정 {date}",
    "card.open": "열기",
    "card.noCode": "소스 없음",

    "empty.title": "조건에 맞는 스크립트가 없습니다",
    "empty.body": "다른 검색어를 입력하거나 필터를 초기화해 전체 카탈로그를 확인하세요.",

    "cta.title": "당신의 기록은 누군가의 지름길입니다",
    "cta.body":
      "VS Code에서 검토한 스킬을 내보내 이 저장소에 폴더로 넣고 풀 리퀘스트를 열면 됩니다. 빌드 단계도, 비밀 정보도, 개인 녹화 원본도 필요 없습니다.",
    "cta.submit": "스크립트 제출하기",
    "cta.guide": "기여 가이드",

    "footer.tag": "VAMP AI 에이전트를 위한 커뮤니티 카탈로그",
    "footer.core": "VAMP 본체",
    "footer.guide": "사용 안내",
    "footer.spec": "RPA 패키지 규격",
    "footer.issues": "이슈",
    "footer.note": "자동화는 사용자가 승인한 범위에서 로컬 VM으로 실행됩니다. 공유 전에 모든 기록을 검토하세요.",

    "detail.version": "버전",
    "detail.overview": "개요",
    "detail.updated": "수정",
    "detail.author": "작성",
    "detail.license": "라이선스",
    "detail.backend": "백엔드",
    "detail.resolution": "기록 해상도",
    "detail.when": "사용 시점",
    "detail.expected": "기대 결과",
    "detail.inputs": "입력 계약",
    "detail.verify": "검증 기준",
    "detail.source": "소스 (PyAutoGUI)",
    "detail.run": "에이전트에서 실행",
    "detail.import": "VS Code로 가져오기",
    "detail.data": "데이터 취급",
    "detail.deps": "의존성",
    "detail.notes": "기록 시 유의사항",
    "detail.copy": "복사",
    "detail.copied": "복사됨",
    "detail.download": "source.py 내려받기",
    "detail.inputName": "이름",
    "detail.inputType": "형식",
    "detail.inputReq": "필수",
    "detail.inputExample": "예시",
    "detail.inputDesc": "설명",
    "detail.required": "필수",
    "detail.optional": "선택",
    "detail.runNote":
      "<code>id</code>는 이 카탈로그의 슬러그가 아니라, 사용자의 RPA Library에 저장된 스킬 폴더의 UUID입니다. <code>rpa_search</code>로 먼저 찾은 뒤 정확한 VM UUID와 선언된 모든 입력값을 전달하세요. <code>confirmed:true</code>가 승인 단계이며, 이것이 없으면 아무것도 실행되지 않습니다.",
    "detail.resultNote":
      "<code>completed_unverified</code>는 동작이 끝났다는 뜻이지 업무가 성공했다는 뜻이 아닙니다. 성공을 보고하기 전에 가장 저렴하고 신뢰할 수 있는 관찰로 기대 결과를 확인하세요.",
    "detail.importSteps":
      "<li>VS Code VAMP 사이드바의 <strong>RPA Library</strong>를 열고 <strong>Add RPA Folder</strong>를 누릅니다.</li><li>내보낸 스킬 폴더(<code>source.py</code>, <code>rpa.json</code>, <code>actions.json</code>)를 지정하거나, 게스트에서 같은 단계를 기록하고 <strong>Create</strong>를 사용합니다.</li><li>아래 입력값을 <strong>Input names</strong>에 선언해 <code>${name}</code> 자리표시자가 풀리게 합니다. 쓰지 않은 이름은 거절됩니다.</li><li>기록을 검토하고 <strong>I reviewed this recording and allow agent reuse</strong>를 선택한 뒤 저장합니다.</li><li><strong>VAMP RPA Library</strong> MCP를 시작하고 도구를 켜서 에이전트가 <code>rpa_search</code>와 <code>rpa_run_saved</code>를 호출할 수 있게 합니다.</li>",
    "detail.openRepo": "GitHub에서 보기",
    "detail.copyToast": "클립보드에 복사했습니다",
    "detail.downloadToast": "source.py를 내려받았습니다",
    "detail.noDeps": "VAMP 게스트 런타임 외 추가 의존성 없음",
    "detail.sourceFile": "source.py",
    "detail.callFile": "rpa_run_saved 호출",
    "detail.searchFile": "rpa_search 호출",
    "detail.verifiedTag": "검증됨",

    "submit.kicker": "기여",
    "submit.title": "스크립트 제출하기",
    "submit.tab.guide": "가이드",
    "submit.tab.gen": "생성기",
    "submit.intro":
      "좋은 항목은 의도적으로 지루합니다. 작업 하나, 선언된 입력값, 관찰 가능한 결과, 그리고 기록 어디에도 남지 않은 비밀 정보입니다. 편한 경로를 고르세요.",
    "submit.step1.title": "기록하고, 비밀 정보 앞에서 멈추기",
    "submit.step1.body":
      "게스트 레코더(Windows는 <code>Start-Recorder.cmd</code>, Debian/X11은 <code>start-recorder.sh</code>)로 작업 하나만 기록합니다. 비밀번호·PIN·토큰·암호 입력란 앞에서 멈추고, 개인 녹화 원본은 이후 삭제하세요.",
    "submit.step2.title": "검토하고 스킬 내보내기",
    "submit.step2.body":
      "<strong>RPA Library → Create</strong>에서 이름, 설명, 사용 시점, 입력 이름, 기대 결과를 채웁니다. 검토한 뒤 <strong>Export ZIP</strong>을 사용하세요. ZIP에는 파일별 SHA-256 체크섬이 담긴 <code>VAMP_EXPORT.json</code>이 들어가며 <code>.git</code> 이력은 포함되지 않습니다.",
    "submit.step3.title": "폴더로 공개하기",
    "submit.step3.body":
      "<code>wayfarer6/vamp-script-hub</code>를 포크하고 <code>scripts/&lt;your-id&gt;/</code>에 <code>source.py</code>, <code>rpa.json</code>, <code>README.md</code>를 넣어 풀 리퀘스트를 엽니다. VAMP 설치가 없다면 소스와 메타데이터를 담아 제출 이슈를 열면 관리자가 등록합니다.",
    "submit.step4.title": "검토자가 확인하는 것",
    "submit.step4.body":
      "소스가 지원되는 PyAutoGUI 동작으로 해석되는지, 모든 입력이 <code>${name}</code> 자리표시자로 등장하는지, 기대 결과를 스크린샷·OCR·파일 확인으로 관찰할 수 있는지, 게스트 해상도를 밝혔는지, 개인 정보가 없는지 확인합니다.",
    "submit.treeTitle": "패키지 구성",
    "submit.tree":
      "scripts/<span class=\"hot\">your-script-id</span>/\n├── <span class=\"hot\">source.py</span>        # 기록된 PyAutoGUI 동작\n├── <span class=\"hot\">rpa.json</span>         # id, 입력, 백엔드, 기대 결과\n├── <span class=\"hot\">README.md</span>        # 사용 시점, 검증, 한계\n└── assets/          <span class=\"dim\"># 선택: 템플릿 이미지</span>",
    "submit.openIssue": "제출 이슈 열기",
    "submit.readGuide": "CONTRIBUTING 읽기",
    "submit.openGen": "생성기 열기",
    "submit.guideNote":
      "제출하면 해당 기록을 MIT 라이선스로 공개하는 데 동의하고, 자격 증명·토큰·개인 텍스트가 없음을 확인하는 것입니다. 관리자가 다른 해상도에서의 재기록을 요청할 수 있습니다.",

    "gen.intro":
      "레코더가 없어도 됩니다. 여기서 메타데이터 초안을 만들고 포크에 넣거나, 초안을 담아 이슈를 여세요. 해시와 동작 수는 VAMP가 스킬을 저장할 때 기록하므로 이 초안에는 넣지 않습니다.",
    "gen.id": "스크립트 ID",
    "gen.idHint": "소문자·숫자·하이픈",
    "gen.title": "제목",
    "gen.backend": "백엔드",
    "gen.resolution": "기록 해상도",
    "gen.inputs": "입력 이름",
    "gen.inputsHint": "쉼표로 구분",
    "gen.tags": "태그",
    "gen.tagsHint": "쉼표로 구분",
    "gen.description": "설명",
    "gen.when": "에이전트가 언제 사용해야 하나요?",
    "gen.expected": "기대 결과",
    "gen.verify": "검증 체크리스트",
    "gen.verifyHint": "한 줄에 하나씩",
    "gen.code": "source.py (PyAutoGUI)",
    "gen.codeHint": "입력은 ${name}으로 선언",
    "gen.generate": "초안 생성",
    "gen.copyManifest": "rpa.json 복사",
    "gen.copyReadme": "README.md 복사",
    "gen.issue": "초안으로 이슈 열기",
    "gen.reset": "초기화",
    "gen.preview": "초안 미리보기",
    "gen.msg.id": "스크립트 ID는 영문 소문자로 시작하고 소문자·숫자·하이픈·밑줄만 쓸 수 있습니다.",
    "gen.msg.title": "제목이 필요합니다(최대 120자).",
    "gen.msg.description": "설명은 10~4000자여야 에이전트가 검색으로 찾을 수 있습니다.",
    "gen.msg.when": "에이전트가 사용할 시점을 적으세요. 검색에서 가장 강한 신호입니다.",
    "gen.msg.expected": "관찰 가능한 기대 결과를 적으세요.",
    "gen.msg.code": "기록한 PyAutoGUI 소스를 붙여 넣으세요.",
    "gen.msg.input": "입력 이름은 [A-Za-z_][A-Za-z0-9_] 형식이며 최대 20개까지 가능합니다.",
    "gen.msg.placeholder": "입력 “{input}”에 해당하는 ${…} 자리표시자가 소스에 없습니다. VAMP는 쓰지 않은 입력 이름을 거절합니다.",
    "gen.msg.ready": "초안이 준비되었습니다. scripts/{id}/에 넣거나 이슈로 여세요.",
    "gen.msg.draft": "초안입니다. source_sha256, actions_sha256, action_count는 VAMP가 저장할 때 채웁니다.",
    "gen.msg.tooLong":
      "소스가 미리 채운 이슈 URL에 담기기에는 너무 깁니다. 이슈가 소스 없이 열리므로, 이후 본문 입력란에 source.py를 붙여 넣으세요.",
    "gen.empty": "필드를 채우고 “초안 생성”을 누르세요.",
    "gen.treeTitle": "추가할 폴더",
    "gen.issueTitle": "[Script] {name}",
    "gen.backendVirtualbox": "VirtualBox",
    "gen.backendKvm": "KVM",
    "gen.copyToast": "초안을 복사했습니다",

    "toast.lang": "언어를 전환했습니다"
  };

  window.VAMP_I18N = { en: en, ko: ko };
})();
