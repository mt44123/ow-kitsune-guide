const GAS_ORIGIN_URL =
  "https://script.google.com/macros/s/AKfycbwaFwtnnYHV1P7TIs-C_R3MKxpW9-3_HsLBZIw4twTnpoYSwWdgqnxBhG7ChNNkwKoV/exec";

// Production: Cloudflare Pages Function caches Apps Script responses.
// Local static servers have no /api/gas, so fall back to Apps Script directly.
const CONFIG = {
  API_URL:
    typeof location !== "undefined" &&
    (location.hostname === "localhost" ||
      location.hostname === "127.0.0.1")
      ? GAS_ORIGIN_URL
      : "/api/gas"
};
