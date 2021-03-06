(function () {
  var urlText = decodeURIComponent(location.href);
  var queryString = ''; 
  var q = urlText.split('?');
  if (q.length > 0) {
    queryString = q[1];
  }

  var urlarr = queryString.split('&');
  var urlobj = {};
  var tmp = '';
  for(let i=0; i<urlarr.length; i++) {
    tmp = urlarr[i].split('=');
    if (tmp.length <= 0) {
      continue;
    }
    if (tmp.length < 2) {
      tmp.push('');
    }
    urlobj[tmp[0]] = tmp[1];
  }
  if (urlobj['token'] !== undefined) {
    localStorage.setItem('urltoken', urlobj['token']);
  }
  localStorage.setItem('userinfo', JSON.stringify(urlobj));
})();

function getUserInfo () {
  var ui = localStorage.getItem('userinfo');
  if (ui === null) {
    return null;
  }
  return JSON.parse(ui);
}

function apicall (url, options = null) {
  let a = '?';
    if (url.indexOf('?') > 0) {
      a = '&';
    }
    url = `${url}${a}token=${localStorage.getItem('urltoken')}`;
    if (options !== null) {
      return fetch(url, options);
    }
    return fetch(url);
}