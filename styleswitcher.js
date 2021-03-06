function scroller(id) {
	document.getElementById(id).scrollIntoView();
}

function setActiveStyleSheet(title) {
  var i, a, main;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
      a.disabled = true;
      if(a.getAttribute("title") == title) a.disabled = false;
    }
  }
}

function getActiveStyleSheet() {
  var i, a;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");
  }
  return null;
}

function getPreferredStyleSheet() {
  var i, a;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1
       && a.getAttribute("rel").indexOf("alt") == -1
       && a.getAttribute("title")
       ) return a.getAttribute("title");
  }
  return null;
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      if (typeof this.activeLink == 'undefined' || !this.activeLink) {
        this.activeLink = setActiveNavLink(window.location.pathname);
      }
      /* Exit the function: */
      return;
    }
  }
}

function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 0);
  }
}

function trackScroll() {
  if (typeof this.topBtn == 'undefined') {
    this.topBtn = document.querySelector('.scroll-to-top');
    this.topBtn.addEventListener('click', backToTop);
  }
  if (this.topBtn != null) {
    var scrolled = window.pageYOffset;
    var coords = document.documentElement.clientHeight;

    if (scrolled > coords) {
      this.topBtn.classList.add('scroll-to-top-show');
    } else {
      this.topBtn.classList.remove('scroll-to-top-show');
    }
  }
}

function setActiveNavLink(url) {
  var linkContainer = document.querySelectorAll('.navbar-link');
  let i = linkContainer.length;
  if (i == 0) return false;
  while (--i > 0) {
    var h = linkContainer[i].getAttribute("href");
    if (h == null || !h.match(".html")) continue;
    if (url.match(h.split(".")[0])) break;
  }
  linkContainer[i].firstChild.classList.add('active');
  return true;
}

function loadScript(url) {
  var script = document.createElement("script");
  script.src = url;
  script.async = true;
  document.head.appendChild(script);
}

loadScript("https://www.googletagmanager.com/gtag/js?id=UA-10249025-10");
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-10249025-10');

function refreshTag(id, refresh_time, interval) {
  var timeout;
  var tag = document.getElementById(id);
  if (tag == null) {
    timeout = 500;
  } else {
    timeout = interval * 1000;
    var pixfuture_frame = id + "_mainframe";
    var idsp = id.split('x');
    var tagw = parseInt(idsp[1]);
    var tagh = parseInt(idsp[2]);
    if (tagh < tagw && tag.clientWidth < tagw) {
      tag.style.transform = "scale(" + tag.clientWidth / tagw + ")";
      tag.style.transformOrigin = "0 0";
    } else if (tagw < tagh) {
      var scaleh = tag.parentElement.clientHeight / tagh;
      var scalew = ((document.documentElement.clientWidth - 730) / 2 - 48) / tagw;
      var scale = Math.min(scalew, scaleh);
      if (scale < 1) {
        tag.style.transform = "scale(" + scale + ")";
        tag.style.transformOrigin = "100% 0";
      }
    }
    tag.innerHTML = '<iframe id="'+pixfuture_frame+'" scrolling="no" frameborder="0" marginwidth="0" marginheight="0" width="'+ idsp[1] +'" height="'+ idsp[2] +'"></iframe>';
    var frameDoc = document.getElementById(pixfuture_frame).contentWindow.document;
    frameDoc.write('<html><head></head><body><div id="'+ id +'" clickTrack="%%CLICK_URL_ESC%%"><\/div><script async type="text/javascript" src="//served-by.pixfuture.com/www/delivery/headerbid_refresh.php?dat='+id+'"><\/script><\/body><\/html>');
    frameDoc.close();
  }
  if (refresh_time > 0) {
    setTimeout(function() {
      refreshTag(id, --refresh_time, interval);
    }, timeout);
  }
}

window.onload = function(e) {
  var cookie = readCookie("style");
  var title = cookie ? cookie : getPreferredStyleSheet();
  setActiveStyleSheet(title);
  window.addEventListener('scroll', trackScroll);
  if (document.documentElement.clientWidth > 1000) {
    refreshTag('4941x160x600x964x_ADSLOT1', 5, 30);
  }
  refreshTag('4945x728x90x964x_ADSLOT1', 5, 30);
}

window.onunload = function(e) {
  var title = getActiveStyleSheet();
  createCookie("style", title, 365);
}

var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);
