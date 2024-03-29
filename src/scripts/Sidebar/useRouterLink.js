/*
  MIT License

  Copyright (c) 2018 yaminncco
  Copyright (c) 2021 Toni Harzendorf

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

// Adapted from vue-router-next
// See: https://github.com/vuejs/vue-router-next/blob/master/src/RouterLink.ts

export function activeRecordIndex(route, currentRoute) {
  const { matched } = route;
  const { length } = matched;
  const routeMatched = matched[length - 1];

  const currentMatched = currentRoute.matched;
  if (!routeMatched || !currentMatched.length) return -1;
  const index = currentMatched.findIndex(
    isSameRouteRecord.bind(null, routeMatched)
  );
  if (index > -1) return index;

  const parentRecordPath = getOriginalPath(matched[length - 2]);
  return length > 1 &&
    getOriginalPath(routeMatched) === parentRecordPath &&
    currentMatched[currentMatched.length - 1].path !== parentRecordPath
    ? currentMatched.findIndex(
        isSameRouteRecord.bind(null, matched[length - 2])
      )
    : index;
}

export function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key])) return false;
  }
  return true;
}

function getOriginalPath(record) {
  return record ? (record.aliasOf ? record.aliasOf.path : record.path) : "";
}

function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}

function isSameRouteLocationParamsValue(a, b) {
  return Array.isArray(a)
    ? isEquivalentArray(a, b)
    : Array.isArray(b)
    ? isEquivalentArray(b, a)
    : a === b;
}

function isEquivalentArray(a, b) {
  return Array.isArray(b)
    ? a.length === b.length && a.every((value, i) => value === b[i])
    : a.length === 1 && a[0] === b;
}
