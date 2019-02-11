export function makeTagsFilterFn(tagsArr) {
  if (tagsArr.length > 0) {
    return item => tagsArr.every(tag => item.tags.indexOf(tag) !== -1);
  } else {
    return item => item;
  }
}

export function filterByStateFn(bookStore) {
  return item => bookStore.some(i => i === item.id);
}

export function urlParse(str) {
  let tabArr = str.match(/tab=\w{1,}/);
  let tagsArr = str.match(/tags=.{1,}/);
  let tab = tabArr ? tabArr[0].substring(4) : null;
  let tags = tagsArr
    ? tagsArr[0]
        .substring(5)
        .replace("%20", " ")
        .split(",")
    : null;
  return { tab, tags };
}

export function makeURL(url, tab = null, tags = []) {
  let tabStr = tab ? "tab=" + tab : "";
  let tagsStr = tags.length > 0 ? "tags=" + tags.join(",") : "";
  if (tabStr && tagsStr) {
    return url + "?" + tabStr + "&" + tagsStr;
  } else if (!tabStr && tagsStr) {
    return url + "?" + tagsStr;
  } else if (tabStr && !tagsStr) {
    return url + "?" + tabStr;
  } else {
    return url;
  }
}
