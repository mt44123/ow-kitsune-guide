function sortByViews_(items) {
  return items.sort(
    (a, b) => Number(b.views || 0) - Number(a.views || 0)
  );
}

function sortByDateDesc_(items) {
  return items.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}

function getTitleLanguageMode_() {
  return localStorage.getItem("titleLanguageMode") || "original";
}

function buildMediaTitles_(raw, jp, en, kr) {
  const mode = getTitleLanguageMode_();

  const clean = value => String(value || "").trim();

  raw = clean(raw);
  jp = clean(jp);
  en = clean(en);
  kr = clean(kr);

  const unique = items =>
    items.filter((item, index) =>
      item && items.indexOf(item) === index
    );

  const byMode = {
    original: [raw],

    en: [en || raw],
    "en-original": [en || raw, raw],

    jp: [jp || raw],
    "jp-original": [jp || raw, raw],
    "jp-en-original": [jp || raw, en, raw],

    kr: [kr || raw],
    "kr-original": [kr || raw, raw],
    "kr-en-original": [kr || raw, en, raw]
  };

  const titles = unique(byMode[mode] || byMode.original);

  return {
    mainTitle: titles[0] || "",
    subTitles: titles.slice(1)
  };
}