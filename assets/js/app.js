/* VAMP Script Hub — catalog, filters, detail modal, submission generator.
   No dependencies, no build step. All data comes from scripts.json. */
(function () {
  "use strict";

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const STORE_KEY = "vamp-script-hub:lang";
  const REPO = "wayfarer6/vamp-script-hub";
  const CORE_REPO = "wayfarer6/vamp-mcp";

  const state = {
    lang: "en",
    data: null,
    query: "",
    hyper: "all",
    os: "all",
    cat: "all",
    modal: null,
    generation: null,
    codes: new Map()
  };

  /* ---------------- basics ---------------- */

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function t(key, vars) {
    const dict = window.VAMP_I18N || { en: {} };
    const table = dict[state.lang] || dict.en;
    let text = table[key];
    if (text == null) text = (dict.en || {})[key];
    if (text == null) return key;
    if (vars) {
      Object.keys(vars).forEach((name) => {
        text = text.split("{" + name + "}").join(String(vars[name]));
      });
    }
    return text;
  }

  function pick(obj) {
    if (obj == null) return "";
    if (typeof obj === "string") return obj;
    return obj[state.lang] || obj.en || "";
  }

  function mdInline(value) {
    return esc(value).replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function resolutionLabel(value) {
    return String(value || "").replace(/\s*[x×]\s*/i, "×");
  }

  function readLang() {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored === "en" || stored === "ko") return stored;
    } catch (err) { /* storage can be blocked; default English wins */ }
    return "en";
  }

  function writeLang(lang) {
    try { localStorage.setItem(STORE_KEY, lang); } catch (err) { /* ignore */ }
  }

  let toastTimer = null;
  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.top = "-1000px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  function download(filename, text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  /* ---------------- syntax highlighting ---------------- */

  const PY_RE = new RegExp(
    "(#[^\\n]*)" +
    "|(\"\"\"[\\s\\S]*?\"\"\"|'''(?:[\\s\\S]*?)'''|\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')" +
    "|(\\b(?:import|from|as|def|class|return|if|elif|else|for|while|try|except|finally|raise|with|pass|break|continue|and|or|not|in|is|None|True|False|lambda|global|yield|assert|del|async|await)\\b)" +
    "|(\\b(?:print|len|range|open|str|int|float|dict|list|set|tuple|enumerate|zip|isinstance|RuntimeError|ValueError|Exception|super|property)\\b)" +
    "|(\\b\\d+(?:\\.\\d+)?\\b)" +
    "|(\\b[A-Za-z_]\\w*(?=\\())",
    "g"
  );
  const PY_CLASSES = ["tok-com", "tok-str", "tok-kw", "tok-bi", "tok-num", "tok-fn"];

  const JSON_RE = new RegExp(
    "(\"(?:[^\"\\\\]|\\\\.)*\"(?=\\s*:))" +
    "|(\"(?:[^\"\\\\]|\\\\.)*\")" +
    "|(\\b(?:true|false|null)\\b)" +
    "|(-?\\b\\d+(?:\\.\\d+)?\\b)",
    "g"
  );
  const JSON_CLASSES = ["tok-key", "tok-str", "tok-bool", "tok-num"];

  function tokenizeLine(line, re, classes) {
    let out = "";
    let last = 0;
    let match;
    re.lastIndex = 0;
    while ((match = re.exec(line)) !== null) {
      if (!match[0].length) { re.lastIndex += 1; continue; }
      if (match.index > last) out += esc(line.slice(last, match.index));
      let cls = null;
      for (let i = 1; i < match.length; i += 1) {
        if (match[i] !== undefined) { cls = classes[i - 1]; break; }
      }
      out += cls ? '<span class="' + cls + '">' + esc(match[0]) + "</span>" : esc(match[0]);
      last = match.index + match[0].length;
    }
    if (last < line.length) out += esc(line.slice(last));
    return out;
  }

  function codeLines(code, re, classes) {
    return String(code).split("\n").map((line) =>
      '<li><span class="ln">' + tokenizeLine(line, re, classes) + "</span></li>"
    ).join("");
  }

  function codeBlock(key, fileLabel, code, opts) {
    const options = opts || {};
    state.codes.set(key, code);
    const plain = options.lang === "text";
    const re = options.lang === "json" ? JSON_RE : PY_RE;
    const classes = options.lang === "json" ? JSON_CLASSES : PY_CLASSES;
    const lines = plain
      ? String(code).split("\n").map((line) => '<li><span class="ln">' + esc(line) + "</span></li>").join("")
      : codeLines(code, re, classes);
    const downloadBtn = options.download
      ? '<button class="mini-btn" type="button" data-download="' + key + '" data-filename="' + esc(options.download) + '">' +
        '<svg class="icon"><use href="#i-download"/></svg><span>' + esc(t("detail.download")) + "</span></button>"
      : "";
    return (
      '<div class="code-block">' +
        '<div class="code-top">' +
          '<span class="code-file">' + fileLabel + "</span>" +
          '<span class="code-actions">' +
            downloadBtn +
            '<button class="mini-btn" type="button" data-copy="' + key + '">' +
              '<svg class="icon"><use href="#i-copy"/></svg><span>' + esc(t("detail.copy")) + "</span>" +
            "</button>" +
          "</span>" +
        "</div>" +
        '<div class="code-scroll"><ol class="code-list">' + lines + "</ol></div>" +
      "</div>"
    );
  }

  /* ---------------- catalog data ---------------- */

  const HYPERVISORS = [
    { id: "virtualbox", label: "VirtualBox" },
    { id: "kvm", label: "KVM" }
  ];
  const GUESTS = [
    { id: "windows11", label: "Windows 11" },
    { id: "debian", label: "Debian / Ubuntu" }
  ];

  function osLabel(id) {
    const found = GUESTS.find((item) => item.id === id);
    return found ? found.label : id;
  }
  function hyperLabel(id) {
    const found = HYPERVISORS.find((item) => item.id === id);
    return found ? found.label : id;
  }
  function categoryLabel(id) {
    const list = (state.data && state.data.categories) || [];
    const found = list.find((item) => item.id === id);
    return found ? pick(found) : id;
  }

  function haystack(script) {
    return [
      script.id,
      script.name && script.name.en, script.name && script.name.ko,
      script.summary && script.summary.en, script.summary && script.summary.ko,
      script.description && script.description.en, script.description && script.description.ko,
      script.when_to_use && script.when_to_use.en, script.when_to_use && script.when_to_use.ko,
      script.expected_result && script.expected_result.en, script.expected_result && script.expected_result.ko,
      (script.tags || []).join(" "),
      (script.inputs || []).map((input) => input.name + " " + pick(input.desc)).join(" "),
      script.category, script.category ? categoryLabel(script.category) : ""
    ].join(" ").toLowerCase();
  }

  function matches(script, filters) {
    const f = filters || state;
    if (f.query) {
      const terms = f.query.toLowerCase().split(/\s+/).filter(Boolean);
      const hay = haystack(script);
      if (!terms.every((term) => hay.indexOf(term) !== -1)) return false;
    }
    if (f.hyper !== "all" && (script.hypervisors || []).indexOf(f.hyper) === -1) return false;
    if (f.os !== "all" && (script.os || []).indexOf(f.os) === -1) return false;
    if (f.cat !== "all" && script.category !== f.cat) return false;
    return true;
  }

  function visibleScripts() {
    const list = (state.data && state.data.scripts) || [];
    return list.filter((script) => matches(script));
  }

  function facetCount(key, value) {
    const filters = { query: state.query, hyper: state.hyper, os: state.os, cat: state.cat };
    if (key === "hyper") filters.hyper = "all";
    if (key === "os") filters.os = "all";
    if (key === "cat") filters.cat = "all";
    const list = (state.data && state.data.scripts) || [];
    return list.filter((script) => {
      if (!matches(script, filters)) return false;
      if (key === "hyper") return (script.hypervisors || []).indexOf(value) !== -1;
      if (key === "os") return (script.os || []).indexOf(value) !== -1;
      return script.category === value;
    }).length;
  }

  /* ---------------- rendering: shell ---------------- */

  function applyStaticI18n() {
    document.documentElement.lang = state.lang;
    document.title = t("meta.title");
    const desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.description"));
    $$("[data-i18n]").forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    $$("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    $$("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
    $$(".lang-btn").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === state.lang));
    });
    const search = $("#search");
    if (search) search.setAttribute("aria-label", t("catalog.search"));
  }

  function renderStats() {
    const list = (state.data && state.data.scripts) || [];
    const hyper = new Set();
    const os = new Set();
    list.forEach((script) => {
      (script.hypervisors || []).forEach((id) => hyper.add(id));
      (script.os || []).forEach((id) => os.add(id));
    });
    $("#stat-scripts").textContent = String(list.length);
    $("#stat-verified").textContent = String(list.filter((s) => s.verified).length);
    $("#stat-hyper").textContent = String(hyper.size);
    $("#stat-os").textContent = String(os.size);
    const date = $("#catalog-date");
    if (date && state.data && state.data.updated) date.textContent = state.data.updated;
  }

  function chipHtml(key, value, label, count) {
    const active = state[key] === value;
    return '<button type="button" class="chip" data-facet="' + key + '" data-value="' + esc(value) + '" aria-pressed="' + active + '">' +
      esc(label) + '<span class="chip-count">' + count + "</span></button>";
  }

  function renderFilters() {
    const list = (state.data && state.data.scripts) || [];
    const all = list.length;

    $("#filter-hyper").innerHTML =
      chipHtml("hyper", "all", t("filter.all"), all) +
      HYPERVISORS.map((item) => chipHtml("hyper", item.id, item.label, facetCount("hyper", item.id))).join("");

    $("#filter-os").innerHTML =
      chipHtml("os", "all", t("filter.all"), all) +
      GUESTS.map((item) => chipHtml("os", item.id, item.label, facetCount("os", item.id))).join("");

    const categories = (state.data && state.data.categories) || [];
    $("#filter-cat").innerHTML =
      chipHtml("cat", "all", t("filter.all"), all) +
      categories.map((item) => chipHtml("cat", item.id, pick(item), facetCount("cat", item.id))).join("");
  }

  function cardHtml(script) {
    const badges = []
      .concat((script.hypervisors || []).map((id) => hyperLabel(id)))
      .concat((script.os || []).map((id) => osLabel(id)))
      .concat(script.resolution ? [resolutionLabel(script.resolution)] : [])
      .map((label) => '<span class="badge">' + esc(label) + "</span>")
      .join("");
    const inputCount = (script.inputs || []).length;
    const inputsBadge = inputCount
      ? '<span class="badge">' + esc(inputCount === 1 ? t("card.inputOne") : t("card.inputs", { n: inputCount })) + "</span>"
      : "";
    const verified = script.verified
      ? '<span class="verified-badge"><svg class="icon"><use href="#i-check"/></svg>' + esc(t("card.verified")) + "</span>"
      : "";
    return (
      '<article class="card" tabindex="0" role="button" data-id="' + esc(script.id) + '" data-cat="' + esc(script.category) +
        '" aria-label="' + esc(t("a11y.cardOpen", { name: pick(script.name) })) + '">' +
        '<div class="card-top"><span class="card-cat">' + esc(categoryLabel(script.category)) + "</span>" + verified + "</div>" +
        "<h3>" + esc(pick(script.name)) + "</h3>" +
        "<p>" + esc(pick(script.summary)) + "</p>" +
        '<div class="card-meta">' + badges + inputsBadge + "</div>" +
        '<div class="card-foot"><span class="card-id">' + esc(script.id) + "</span>" +
          '<span class="open">' + esc(t("card.open")) + '<svg class="icon"><use href="#i-arrow"/></svg></span>' +
        "</div>" +
      "</article>"
    );
  }

  function renderCards() {
    const list = visibleScripts();
    const grid = $("#script-grid");
    const empty = $("#empty");
    const summary = $("#result-summary");

    grid.innerHTML = list.map(cardHtml).join("");
    empty.hidden = list.length > 0;
    grid.hidden = list.length === 0;

    if (summary) {
      if (state.lang === "ko") {
        summary.innerHTML = esc(t("catalog.count", { n: list.length }));
      } else {
        summary.innerHTML = "<strong>" + list.length + "</strong> " + (list.length === 1 ? "script" : "scripts");
      }
    }

    const filtered = state.query || state.hyper !== "all" || state.os !== "all" || state.cat !== "all";
    $("#reset-filters").hidden = !filtered;
    $("#search-clear").hidden = !state.query;
  }

  function renderAll() {
    applyStaticI18n();
    renderStats();
    renderFilters();
    renderCards();
  }

  /* ---------------- detail modal ---------------- */

  function metaBadges(script) {
    const rows = []
      .concat((script.hypervisors || []).map((id) => hyperLabel(id)))
      .concat((script.os || []).map((id) => osLabel(id)));
    return rows.map((label) => '<span class="badge">' + esc(label) + "</span>").join("");
  }

  function detailHtml(script) {
    const inputs = script.inputs || [];
    const inputRows = inputs.map((input) => (
      "<tr>" +
        "<td><code>" + esc(input.name) + "</code></td>" +
        '<td class="input-type">' + esc(input.type || "string") + "</td>" +
        '<td class="' + (input.required ? "req-yes" : "req-no") + '">' + esc(input.required ? t("detail.required") : t("detail.optional")) + "</td>" +
        "<td><code>" + esc(input.example || "—") + "</code></td>" +
        '<td class="input-desc">' + mdInline(pick(input.desc)) + "</td>" +
      "</tr>"
    )).join("");

    const verification = (pick(script.verification) || []);
    const verifyList = verification.map((item) =>
      '<li><svg class="icon"><use href="#i-check"/></svg><span>' + mdInline(item) + "</span></li>"
    ).join("");

    const deps = (script.dependencies || []);
    const depsHtml = deps.length
      ? deps.map((dep) => "<code>" + esc(dep) + "</code>").join(" ")
      : esc(t("detail.noDeps"));

    const runInputs = {};
    inputs.forEach((input) => { runInputs[input.name] = input.example || ""; });
    const runCall = {
      id: "<skill-uuid>",
      vm_id: "<vm-uuid>",
      inputs: runInputs,
      confirmed: true
    };
    const searchCall = {
      query: (script.tags || []).slice(0, 3).join(" "),
      backend: (script.hypervisors || ["virtualbox"])[0],
      limit: 5
    };

    const runCode = codeBlock("run:" + script.id, "rpa_run_saved · arguments", JSON.stringify(runCall, null, 2), { lang: "json" });
    const searchCode = codeBlock("search:" + script.id, "rpa_search · arguments", JSON.stringify(searchCall, null, 2), { lang: "json" });

    return (
      '<div class="detail-meta">' +
        (script.verified ? '<span class="verified-badge"><svg class="icon"><use href="#i-check"/></svg>' + esc(t("detail.verifiedTag")) + "</span>" : "") +
        metaBadges(script) +
        '<span class="badge">' + esc(resolutionLabel(script.resolution || "1920x1080")) + "</span>" +
        '<span class="badge">v' + esc(script.version || "1.0.0") + "</span>" +
      "</div>" +
      '<p class="detail-summary">' + mdInline(pick(script.summary)) + "</p>" +
      '<div class="panel-grid">' +
        '<div class="panel"><h4>' + esc(t("detail.when")) + "</h4><p>" + mdInline(pick(script.when_to_use)) + "</p></div>" +
        '<div class="panel"><h4>' + esc(t("detail.expected")) + "</h4><p>" + mdInline(pick(script.expected_result)) + "</p></div>" +
        '<div class="panel wide"><h4>' + esc(t("detail.overview")) + "</h4><p>" + mdInline(pick(script.description)) + "</p></div>" +
      "</div>" +

      '<div class="block">' +
        '<div class="block-head"><h3><svg class="icon"><use href="#i-code"/></svg>' + esc(t("detail.inputs")) + "</h3></div>" +
        '<div class="table-wrap"><table class="inputs"><thead><tr>' +
          "<th>" + esc(t("detail.inputName")) + "</th>" +
          "<th>" + esc(t("detail.inputType")) + "</th>" +
          "<th>" + esc(t("detail.inputReq")) + "</th>" +
          "<th>" + esc(t("detail.inputExample")) + "</th>" +
          "<th>" + esc(t("detail.inputDesc")) + "</th>" +
        "</tr></thead><tbody>" + (inputRows || '<tr><td colspan="5" class="input-desc">—</td></tr>') + "</tbody></table></div>" +
      "</div>" +

      '<div class="block">' +
        '<div class="block-head"><h3><svg class="icon"><use href="#i-shield"/></svg>' + esc(t("detail.verify")) + "</h3></div>" +
        '<ul class="check-list">' + verifyList + "</ul>" +
        '<div class="callout" style="margin-top:12px"><svg class="icon"><use href="#i-spark"/></svg><div>' + t("detail.resultNote") + "</div></div>" +
      "</div>" +

      '<div class="block">' +
        '<div class="block-head"><h3><svg class="icon"><use href="#i-terminal"/></svg>' + esc(t("detail.source")) + "</h3></div>" +
        codeBlock("src:" + script.id, 'source.py <span class="lang">· python</span>', script.code || "", { download: script.id + "-source.py" }) +
      "</div>" +

      '<div class="block">' +
        '<div class="block-head"><h3><svg class="icon"><use href="#i-terminal"/></svg>' + esc(t("detail.run")) + "</h3></div>" +
        '<div class="callout" style="margin-bottom:12px"><svg class="icon"><use href="#i-shield"/></svg><div>' + t("detail.runNote") + "</div></div>" +
        searchCode +
        '<div style="height:10px"></div>' +
        runCode +
      "</div>" +

      '<div class="block">' +
        '<div class="block-head"><h3><svg class="icon"><use href="#i-layers"/></svg>' + esc(t("detail.import")) + "</h3></div>" +
        '<ol class="steps">' + t("detail.importSteps") + "</ol>" +
      "</div>" +

      '<div class="panel-grid">' +
        '<div class="panel"><h4>' + esc(t("detail.data")) + "</h4><p>" + mdInline(pick(script.data_handling)) + "</p></div>" +
        '<div class="panel"><h4>' + esc(t("detail.deps")) + "</h4><p>" + depsHtml + "</p></div>" +
        '<div class="panel wide"><h4>' + esc(t("detail.notes")) + "</h4><p>" + mdInline(pick(script.notes)) + "</p></div>" +
      "</div>" +

      '<div class="detail-foot">' +
        "<span>" + esc(t("detail.version")) + " v" + esc(script.version) + "</span>" +
        "<span>" + esc(t("detail.updated")) + " " + esc(script.updated) + "</span>" +
        "<span>" + esc(t("detail.author")) + " " + esc(script.author) + "</span>" +
        "<span>" + esc(t("detail.license")) + " " + esc(script.license || "MIT") + "</span>" +
        '<a href="https://github.com/' + CORE_REPO + '" target="_blank" rel="noopener">' +
          '<svg class="icon"><use href="#i-github"/></svg>' + esc(t("detail.openRepo")) + "</a>" +
      "</div>"
    );
  }

  /* ---------------- submit modal ---------------- */

  function guideHtml() {
    const steps = [1, 2, 3, 4].map((n) => (
      '<div class="block">' +
        "<h3>" + esc(t("submit.step" + n + ".title")) + "</h3>" +
        "<p>" + t("submit.step" + n + ".body") + "</p>" +
      "</div>"
    )).join("");

    return (
      '<div class="submit-guide">' +
        "<p>" + t("submit.intro") + "</p>" +
        steps +
        '<div class="block">' +
          "<h3>" + esc(t("submit.treeTitle")) + "</h3>" +
          '<div class="folder-tree">' + t("submit.tree") + "</div>" +
        "</div>" +
        '<div class="callout warn"><svg class="icon"><use href="#i-shield"/></svg><div>' + t("submit.guideNote") + "</div></div>" +
        '<div class="gen-actions" style="margin-top:18px">' +
          '<a class="btn primary small" href="https://github.com/' + REPO + '/issues/new?template=submit_script.yml" target="_blank" rel="noopener">' +
            '<svg class="icon"><use href="#i-github"/></svg>' + esc(t("submit.openIssue")) + "</a>" +
          '<a class="btn ghost small" href="https://github.com/' + REPO + '/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener">' +
            '<svg class="icon"><use href="#i-external"/></svg>' + esc(t("submit.readGuide")) + "</a>" +
          '<button class="btn ghost small" type="button" data-tab="gen">' +
            '<svg class="icon"><use href="#i-spark"/></svg>' + esc(t("submit.openGen")) + "</button>" +
        "</div>" +
      "</div>"
    );
  }

  function fieldHtml(config) {
    const wide = config.wide ? " wide" : "";
    const hint = config.hint ? '<span class="hint">' + esc(config.hint) + "</span>" : "";
    const control = config.multiline
      ? '<textarea id="' + config.id + '" rows="' + (config.rows || 4) + '"' + (config.code ? ' class="code-input"' : "") +
        " placeholder=\"" + esc(config.placeholder || "") + '">' + esc(config.value || "") + "</textarea>"
      : config.options
        ? '<select id="' + config.id + '">' + config.options.map((option) =>
            '<option value="' + esc(option.value) + '"' + (option.value === config.value ? " selected" : "") + ">" + esc(option.label) + "</option>"
          ).join("") + "</select>"
        : '<input id="' + config.id + '" type="text" value="' + esc(config.value || "") + '" placeholder="' + esc(config.placeholder || "") + '">';
    return (
      '<div class="field' + wide + '" data-field="' + config.id + '">' +
        "<label for=\"" + config.id + '">' + esc(config.label) + hint + "</label>" +
        control +
        '<p class="err" id="err-' + config.id + '"></p>' +
      "</div>"
    );
  }

  const DEFAULT_CODE = [
    "# Recorded with the VAMP guest recorder, then reviewed.",
    "import time",
    "",
    "import pyautogui",
    "",
    "pyautogui.FAILSAFE = True",
    "pyautogui.PAUSE = 0.15",
    "",
    "pyautogui.hotkey(\"ctrl\", \"l\")",
    "time.sleep(0.5)",
    "pyautogui.write(\"https://example.com/\", interval=0.03)",
    "pyautogui.press(\"enter\")",
    "time.sleep(3.0)",
    "",
    "# Robot verification: OCR must find the expected heading."
  ].join("\n");

  function generatorHtml() {
    const gen = state.generation;
    const draft = gen ? gen.manifest : null;
    const form = gen ? gen.form : (state.formDraft || null);
    const preview = gen ? gen.previewTab || "manifest" : null;

    const resolutionOptions = ["1920x1080", "1600x900", "2560x1440", "1366x768"].map((value) => ({ value: value, label: value.replace("x", " × ") }));

    const formHtml =
      '<div class="gen-grid">' +
        fieldHtml({ id: "gen-id", label: t("gen.id"), hint: t("gen.idHint"), value: form ? form.id : "", placeholder: "my-script-id" }) +
        fieldHtml({ id: "gen-title", label: t("gen.title"), value: form ? form.name : "", placeholder: "Open the internal dashboard" }) +
        fieldHtml({ id: "gen-backend", label: t("gen.backend"), options: [
          { value: "virtualbox", label: t("gen.backendVirtualbox") },
          { value: "kvm", label: t("gen.backendKvm") }
        ], value: form ? form.backend : "virtualbox" }) +
        fieldHtml({ id: "gen-resolution", label: t("gen.resolution"), options: resolutionOptions,
          value: form ? form.resolution : "1920x1080" }) +
        fieldHtml({ id: "gen-inputs", label: t("gen.inputs"), hint: t("gen.inputsHint"),
          value: form ? form.inputs.join(", ") : "", placeholder: "query, username" }) +
        fieldHtml({ id: "gen-tags", label: t("gen.tags"), hint: t("gen.tagsHint"),
          value: form ? form.tags.join(", ") : "", placeholder: "web, login, ocr" }) +
        fieldHtml({ id: "gen-description", label: t("gen.description"), wide: true, multiline: true,
          value: form ? form.description : "", placeholder: "What the script does, what it never touches, and which screen state it expects." }) +
        fieldHtml({ id: "gen-when", label: t("gen.when"), wide: true, multiline: true, rows: 2,
          value: form ? form.when : "", placeholder: "Use when the customer list is already open and the user asks to find a customer." }) +
        fieldHtml({ id: "gen-expected", label: t("gen.expected"), wide: true, multiline: true, rows: 2,
          value: form ? form.expected : "", placeholder: "The matching customer row is visible in the result list." }) +
        fieldHtml({ id: "gen-verify", label: t("gen.verify"), hint: t("gen.verifyHint"), wide: true, multiline: true, rows: 3,
          value: form ? form.verify.join("\n") : "", placeholder: "OCR finds the heading\nNo submit occurred" }) +
        fieldHtml({ id: "gen-code", label: t("gen.code"), hint: t("gen.codeHint"), wide: true, multiline: true, code: true, rows: 10,
          value: form ? form.code : DEFAULT_CODE }) +
      "</div>";

    const actions =
      '<div class="gen-actions">' +
        '<button class="btn primary small" type="button" id="gen-run"><svg class="icon"><use href="#i-spark"/></svg>' + esc(t("gen.generate")) + "</button>" +
        '<button class="btn ghost small" type="button" id="gen-copy-manifest"' + (gen ? "" : " disabled") + ">" + esc(t("gen.copyManifest")) + "</button>" +
        '<button class="btn ghost small" type="button" id="gen-copy-readme"' + (gen ? "" : " disabled") + ">" + esc(t("gen.copyReadme")) + "</button>" +
        '<button class="btn ghost small" type="button" id="gen-issue"' + (gen ? "" : " disabled") + ">" +
          '<svg class="icon"><use href="#i-github"/></svg>' + esc(t("gen.issue")) + "</button>" +
        '<button class="btn ghost small" type="button" id="gen-reset">' + esc(t("gen.reset")) + "</button>" +
      "</div>";

    let previewHtml = '<p class="note-line">' + esc(t("gen.empty")) + "</p>";
    if (gen) {
      const tab = preview || "manifest";
      const tabs = [
        { id: "manifest", label: "rpa.json" },
        { id: "readme", label: "README.md" },
        { id: "tree", label: "folder" }
      ].map((item) =>
        '<button type="button" class="tab" role="tab" aria-selected="' + (tab === item.id) + '" data-preview="' + item.id + '">' + item.label + "</button>"
      ).join("");
      let body;
      if (tab === "readme") {
        body = codeBlock("gen-readme", "README.md <span class=\"lang\">· markdown</span>", gen.readme, { lang: "text" });
      } else if (tab === "tree") {
        body = '<div class="folder-tree">' + esc("scripts/" + gen.manifest.id + "/\n├── source.py\n├── rpa.json\n└── README.md") + "</div>";
      } else {
        body = codeBlock("gen-manifest", "rpa.json <span class=\"lang\">· vamp-saved-rpa draft</span>", gen.manifestJson, { lang: "json" });
      }
      previewHtml =
        '<div data-preview-block>' +
          '<div class="block-head"><h3><svg class="icon"><use href="#i-code"/></svg>' + esc(t("gen.preview")) + "</h3></div>" +
          '<div class="preview-tabs" role="tablist">' + tabs + "</div>" + body +
        "</div>";
    }

    const status = gen ? gen.messages.map(messageHtml).join("") : "";

    return (
      "<p>" + t("gen.intro") + "</p>" +
      formHtml + actions +
      '<div class="gen-status" id="gen-status">' + status + "</div>" +
      previewHtml
    );
  }

  function messageHtml(message) {
    const icon = message.level === "ok" ? "check" : message.level === "bad" ? "close" : "spark";
    return '<p class="gen-msg ' + message.level + '"><svg class="icon"><use href="#i-' + icon + '"/></svg><span>' +
      esc(message.text) + "</span></p>";
  }

  function renderSubmit(tab) {
    const active = tab || (state.modal && state.modal.tab) || "guide";
    if (state.modal) state.modal.tab = active;
    const body = $("#modal-body");
    $("#modal-kicker").textContent = t("submit.kicker");
    $("#modal-title").textContent = t("submit.title");
    body.innerHTML =
      '<div class="tabs" role="tablist">' +
        '<button type="button" class="tab" role="tab" aria-selected="' + (active === "guide") + '" data-tab="guide">' + esc(t("submit.tab.guide")) + "</button>" +
        '<button type="button" class="tab" role="tab" aria-selected="' + (active === "gen") + '" data-tab="gen">' + esc(t("submit.tab.gen")) + "</button>" +
      "</div>" +
      '<div data-panel="guide"' + (active === "guide" ? "" : " hidden") + ">" + guideHtml() + "</div>" +
      '<div data-panel="gen"' + (active === "gen" ? "" : " hidden") + ">" + generatorHtml() + "</div>";
  }

  /* ---------------- generator logic ---------------- */

  function slugify(text) {
    return String(text).toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
  }

  function splitList(value) {
    return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
  }

  function readForm() {
    const get = (id) => { const el = $("#" + id); return el ? el.value : ""; };
    return {
      id: slugify(get("gen-id") || get("gen-title")),
      name: get("gen-title").trim(),
      backend: get("gen-backend"),
      resolution: get("gen-resolution"),
      inputs: splitList(get("gen-inputs")),
      tags: splitList(get("gen-tags")),
      description: get("gen-description").trim(),
      when: get("gen-when").trim(),
      expected: get("gen-expected").trim(),
      verify: get("gen-verify").split("\n").map((line) => line.trim()).filter(Boolean),
      code: get("gen-code")
    };
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    const bytes = new Uint8Array(16);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(bytes) : bytes.fill(7);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
  }

  function clearErrors() {
    $$(".field").forEach((field) => field.classList.remove("invalid"));
    $$(".err").forEach((el) => { el.textContent = ""; });
  }

  function setError(fieldId, message) {
    const field = document.querySelector('[data-field="' + fieldId + '"]');
    if (field) field.classList.add("invalid");
    const err = $("#err-" + fieldId);
    if (err) err.textContent = message;
  }

  function generateDraft() {
    const form = readForm();
    clearErrors();
    const messages = [];
    let bad = false;

    if (!/^[a-z][a-z0-9_-]{1,47}$/.test(form.id)) {
      bad = true;
      setError("gen-id", t("gen.msg.id"));
      messages.push({ level: "bad", text: t("gen.msg.id") });
    }
    if (!form.name || form.name.length > 120) {
      bad = true;
      setError("gen-title", t("gen.msg.title"));
      messages.push({ level: "bad", text: t("gen.msg.title") });
    }
    if (form.description.length < 10 || form.description.length > 4000) {
      bad = true;
      setError("gen-description", t("gen.msg.description"));
      messages.push({ level: "bad", text: t("gen.msg.description") });
    }
    if (!form.when) {
      bad = true;
      setError("gen-when", t("gen.msg.when"));
      messages.push({ level: "bad", text: t("gen.msg.when") });
    }
    if (!form.expected) {
      bad = true;
      setError("gen-expected", t("gen.msg.expected"));
      messages.push({ level: "bad", text: t("gen.msg.expected") });
    }
    if (!form.code.trim()) {
      bad = true;
      setError("gen-code", t("gen.msg.code"));
      messages.push({ level: "bad", text: t("gen.msg.code") });
    }
    if (form.inputs.length > 20 || form.inputs.some((name) => !/^[A-Za-z_][A-Za-z0-9_]{0,63}$/.test(name))) {
      bad = true;
      setError("gen-inputs", t("gen.msg.input"));
      messages.push({ level: "bad", text: t("gen.msg.input") });
    }
    form.inputs.forEach((name) => {
      if (form.code.indexOf("${" + name + "}") === -1) {
        bad = true;
        setError("gen-inputs", t("gen.msg.placeholder", { input: name }));
        messages.push({ level: "bad", text: t("gen.msg.placeholder", { input: name }) });
      }
    });
    if (bad) {
      state.generation = null;
      const status = $("#gen-status");
      if (status) status.innerHTML = messages.map(messageHtml).join("");
      const stale = document.querySelector("[data-preview-block]");
      if (stale) stale.remove();
      return;
    }

    const [width, height] = form.resolution.split("x").map((value) => parseInt(value, 10));
    const manifest = {
      format: "vamp-saved-rpa",
      id: uuid(),
      name: form.name,
      description: form.description,
      when_to_use: form.when,
      expected_result: form.expected,
      tags: form.tags.slice(0, 20),
      inputs: form.inputs,
      backend: form.backend,
      resolution: [width || 1920, height || 1080],
      reviewed: false,
      version: "1.0.0",
      entrypoints: [{ name: "run", file: "source.py" }],
      source_executed: false,
      __verify: form.verify,
      __code: form.code
    };

    const verifyLines = form.verify.length ? form.verify : [form.expected];
    const readme = [
      "# " + form.name,
      "",
      form.description,
      "",
      "## When to use",
      "",
      form.when,
      "",
      "## Expected result",
      "",
      form.expected,
      "",
      "## Inputs",
      "",
      "| Name | Type | Required | Example |",
      "| --- | --- | --- | --- |",
      form.inputs.length
        ? form.inputs.map((name) => "| `" + name + "` | string | yes | — |").join("\n")
        : "| — | — | — | — |",
      "",
      "## Verification",
      "",
      verifyLines.map((line) => "- " + line).join("\n"),
      "",
      "## Recorded on",
      "",
      "- Backend: " + (form.backend === "kvm" ? "KVM" : "VirtualBox"),
      "- Guest resolution: " + (width || 1920) + "×" + (height || 1080),
      "- Script ID: `" + form.id + "`",
      "",
      "> Draft generated by the VAMP Script Hub. `source_sha256`, `actions_sha256` and",
      "> `action_count` are written by VAMP when the skill is saved. No credentials,",
      "> tokens or private text may appear in the source or in this README.",
      ""
    ].join("\n");

    const publicManifest = {};
    Object.keys(manifest).forEach((key) => {
      if (key.indexOf("__") !== 0) publicManifest[key] = manifest[key];
    });

    state.generation = {
      manifest: manifest,
      form: form,
      manifestJson: JSON.stringify(publicManifest, null, 2) + "\n",
      readme: readme,
      id: form.id,
      previewTab: "manifest",
      messages: [
        { level: "ok", text: t("gen.msg.ready", { id: form.id }) },
        { level: "warn", text: t("gen.msg.draft") }
      ]
    };
    state.formDraft = form;
    renderSubmit("gen");
    const preview = document.querySelector("[data-preview-block]");
    if (preview && preview.scrollIntoView) preview.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function issueUrl() {
    if (!state.generation) return null;
    const gen = state.generation;
    const manifest = gen.manifest;
    const build = (withCode) => {
      const params = new URLSearchParams();
      params.set("template", "submit_script.yml");
      params.set("title", t("gen.issueTitle", { name: manifest.name }));
      params.set("script_id", gen.id);
      params.set("script_name", manifest.name);
      params.set("description", manifest.description);
      params.set("when_to_use", manifest.when_to_use);
      params.set("expected_result", manifest.expected_result);
      params.set("backend", manifest.backend === "kvm" ? "KVM" : "VirtualBox");
      params.set("resolution", manifest.resolution.join("x"));
      params.set("inputs", manifest.inputs.join(", "));
      params.set("tags", manifest.tags.join(", "));
      const verify = (manifest.__verify && manifest.__verify.length) ? manifest.__verify : [manifest.expected_result];
      params.set("verification", verify.join("\n"));
      if (withCode) params.set("source_code", manifest.__code);
      return "https://github.com/" + REPO + "/issues/new?" + params.toString();
    };
    let url = build(true);
    if (url.length > 7000) url = build(false);
    return url;
  }

  function openIssue() {
    const url = issueUrl();
    if (!url) return;
    if (state.generation && state.generation.manifest.__code && url.indexOf("source_code") === -1) {
      toast(t("gen.msg.tooLong"));
    }
    window.open(url, "_blank", "noopener");
  }

  /* ---------------- modal plumbing ---------------- */

  const layer = $("#modal-layer");
  const modal = $("#modal");
  let lastFocus = null;

  function openModal(kind, payload) {
    lastFocus = document.activeElement;
    state.modal = { kind: kind, id: payload && payload.id, tab: (payload && payload.tab) || "guide" };
    if (kind === "submit") state.formDraft = null;
    layer.hidden = false;
    document.body.classList.add("modal-open");

    if (kind === "detail") {
      renderDetail(state.modal.id);
    } else {
      renderSubmit(state.modal.tab);
    }
    const close = $(".modal-close");
    if (close) close.focus();
  }

  function renderDetail(id) {
    const script = ((state.data && state.data.scripts) || []).find((item) => item.id === id);
    if (!script) return;
    $("#modal-kicker").textContent = script.id + " · " + categoryLabel(script.category);
    $("#modal-title").textContent = pick(script.name);
    $("#modal-body").innerHTML = detailHtml(script);
    $("#modal-body").scrollTop = 0;
  }

  function closeModal() {
    layer.hidden = true;
    document.body.classList.remove("modal-open");
    state.modal = null;
    state.codes.clear();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function trapFocus(event) {
    if (event.key !== "Tab") return;
    const focusables = $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', modal)
      .filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ---------------- language ---------------- */

  function setLang(lang, animate) {
    if (lang !== "en" && lang !== "ko") return;
    const apply = () => {
      if (state.modal) {
        const panel = document.querySelector('[data-panel="gen"]');
        if (panel) {
          const live = readForm();
          const touched = live.id || live.name || live.description || live.when ||
            live.expected || live.tags.length || live.inputs.length || live.code !== DEFAULT_CODE;
          if (touched) state.formDraft = live;
        }
      }
      state.lang = lang;
      writeLang(lang);
      renderAll();
      if (state.modal) {
        const scroll = $("#modal-body").scrollTop;
        if (state.modal.kind === "detail") renderDetail(state.modal.id);
        else renderSubmit(state.modal.tab);
        $("#modal-body").scrollTop = scroll;
      }
    };
    if (!animate || lang === state.lang) {
      apply();
      return;
    }
    document.body.classList.add("lang-swapping");
    setTimeout(() => {
      apply();
      requestAnimationFrame(() => document.body.classList.remove("lang-swapping"));
      toast(t("toast.lang"));
    }, 140);
  }

  /* ---------------- events ---------------- */

  function wireEvents() {
    $$(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang, true));
    });

    const search = $("#search");
    let debounce = null;
    search.addEventListener("input", () => {
      clearTimeout(debounce);
      const value = search.value;
      debounce = setTimeout(() => {
        state.query = value.trim();
        renderFilters();
        renderCards();
      }, 70);
    });

    $("#search-clear").addEventListener("click", () => {
      search.value = "";
      state.query = "";
      renderFilters();
      renderCards();
      search.focus();
    });

    function resetFilters() {
      state.query = "";
      state.hyper = "all";
      state.os = "all";
      state.cat = "all";
      search.value = "";
      renderFilters();
      renderCards();
    }
    $("#reset-filters").addEventListener("click", resetFilters);
    $("#empty-reset").addEventListener("click", resetFilters);

    $(".filters").addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      const facet = chip.dataset.facet;
      const value = chip.dataset.value;
      state[facet] = state[facet] === value ? "all" : value;
      renderFilters();
      renderCards();
    });

    $("#script-grid").addEventListener("click", (event) => {
      const card = event.target.closest(".card");
      if (card) openModal("detail", { id: card.dataset.id });
    });

    $("#script-grid").addEventListener("keydown", (event) => {
      const card = event.target.closest(".card");
      if (!card) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal("detail", { id: card.dataset.id });
      }
    });

    $$("[data-open]").forEach((btn) => {
      btn.addEventListener("click", () => openModal("submit", { tab: "guide" }));
    });

    $$("[data-close-modal]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
      if (layer.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }
      trapFocus(event);
    });

    // delegation inside the modal
    $("#modal-body").addEventListener("click", (event) => {
      const copyBtn = event.target.closest("[data-copy]");
      if (copyBtn) {
        const text = state.codes.get(copyBtn.dataset.copy) || "";
        copyText(text).then(() => {
          copyBtn.classList.add("copied");
          const label = copyBtn.querySelector("span");
          if (label) {
            const original = label.textContent;
            label.textContent = t("detail.copied");
            setTimeout(() => {
              label.textContent = original;
              copyBtn.classList.remove("copied");
            }, 1600);
          }
          toast(t("detail.copyToast"));
        }).catch(() => { /* clipboard blocked; leave the button state alone */ });
        return;
      }

      const downloadBtn = event.target.closest("[data-download]");
      if (downloadBtn) {
        const text = state.codes.get(downloadBtn.dataset.download) || "";
        download(downloadBtn.dataset.filename || "source.py", text);
        toast(t("detail.downloadToast"));
        return;
      }

      const tabBtn = event.target.closest("[data-tab]");
      if (tabBtn) {
        renderSubmit(tabBtn.dataset.tab);
        return;
      }

      const previewBtn = event.target.closest("[data-preview]");
      if (previewBtn && state.generation) {
        state.generation.previewTab = previewBtn.dataset.preview;
        renderSubmit("gen");
        return;
      }

      if (event.target.closest("#gen-run")) { generateDraft(); return; }

      if (event.target.closest("#gen-copy-manifest") && state.generation) {
        copyText(state.generation.manifestJson).then(() => toast(t("gen.copyToast")));
        return;
      }
      if (event.target.closest("#gen-copy-readme") && state.generation) {
        copyText(state.generation.readme).then(() => toast(t("gen.copyToast")));
        return;
      }
      if (event.target.closest("#gen-issue")) { openIssue(); return; }
      if (event.target.closest("#gen-reset")) {
        state.generation = null;
        state.formDraft = null;
        renderSubmit("gen");
        return;
      }
    });

    // live placeholder feedback while typing inputs or the code field
    $("#modal-body").addEventListener("input", (event) => {
      const target = event.target;
      if (!target || (target.id !== "gen-code" && target.id !== "gen-inputs")) return;
      const form = readForm();
      let missing = null;
      form.inputs.forEach((name) => {
        if (!missing && form.code.indexOf("${" + name + "}") === -1) missing = name;
      });
      const field = document.querySelector('[data-field="gen-inputs"]');
      const err = $("#err-gen-inputs");
      if (missing) {
        setError("gen-inputs", t("gen.msg.placeholder", { input: missing }));
      } else if (err) {
        err.textContent = "";
        if (field) field.classList.remove("invalid");
      }
    });
  }

  /* ---------------- boot ---------------- */

  let booted = false;

  function init() {
    if (booted) return;
    booted = true;
    state.lang = readLang();
    wireEvents();
    setLang(state.lang, false);

    fetch("./scripts.json", { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then((data) => {
        state.data = data;
        renderAll();
        const hash = window.location.hash;
        if (hash && hash.indexOf("#script=") === 0) {
          openModal("detail", { id: decodeURIComponent(hash.slice(8)) });
        }
      })
      .catch(() => {
        const grid = $("#script-grid");
        grid.innerHTML = '<p class="note-line">' + esc(t("catalog.loadError")) + "</p>";
        $("#empty").hidden = true;
      });
  }

  document.addEventListener("DOMContentLoaded", init);
  if (document.readyState !== "loading") init();
})();
