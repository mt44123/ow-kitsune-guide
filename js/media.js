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

function buildMediaTitles_(raw, jp, en) {
  let mainTitle = "";
  const subTitles = [];

  if (jp) {
    mainTitle = jp;

    if (en) {
      subTitles.push(en);
    }

    if (raw && raw !== jp && raw !== en) {
      subTitles.push(raw);
    }

  } else {
    mainTitle = raw || en || "";

    if (raw && en && en !== raw) {
      subTitles.push(en);
    }
  }

  return {
    mainTitle,
    subTitles
  };
}