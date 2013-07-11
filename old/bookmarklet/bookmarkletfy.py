# Copyright (c) 2012 Edward Benson
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Helper file for constructing the CATSUI bookmarklet link

def maybeImportJquery(url, jquery):
  ret =  "if (typeof $ == 'undefined') {"
  ret += makeImportString(jquery)
  ret += "}"
  ret += makeImportString(url)
  return ret

def importCSS(url):
  ret =  "var s=document.createElement('link');"
  ret += "s.setAttribute('href','%s');" % url
  ret += "s.setAttribute('rel','stylesheet');"
  ret += "s.setAttribute('type','text/css');"
  ret += "document.getElementsByTagName('body')[0].appendChild(s);"
  return ret

def importJS(url):
  ret =  "var s=document.createElement('script');"
  ret += "s.setAttribute('src','%s');" % url
  ret += "document.getElementsByTagName('body')[0].appendChild(s);"
  return ret

def makeBookmarkletString(javascript, anchor):
  s = "<a href=\"javascript:%s\">%s</a>" % (javascript, anchor)
  return s

def makeBookmarkletFor(cssFiles, jsFiles, final, anchor):
  jsStrings = [importJS(js) for js in jsFiles]
  js = ";".join(jsStrings)
  cssStrings = [importCSS(css) for css in cssFiles]
  css = ";".join(cssStrings)
  javascript = "%s;%s;%s" % (css, js, final)
  return makeBookmarkletString(javascript, anchor)


domain = "localhost:4000"

cssFiles = [
    "http://%s/catsui/hotlink/catsui.css" % domain,
    "http://%s/catsui/hotlink/bootstrap.css" % domain
]

jsFiles = [
    "http://%s/catsui/hotlink/catsui.js" % domain
]


bookmarkletWithBoot = makeBookmarkletFor(cssFiles, jsFiles, "window.CATSUI.sidebar = new CATSUI.Sidebar();", "CATS")

print ""
print ""
print bookmarkletWithBoot
