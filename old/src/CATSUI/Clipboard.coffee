# Copyright (c) 2012 David Karger, Edward Benson
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

# Original Author: David Karger <karger@mit.edu>
# Coffeescript Port: Ted Benson <eob@csail.mit.edu>

$ = jQueryHcss

#class ClipboardServer
#  @SetCookie: (name, value, days) ->
#    expires = ""
#    if (days) {
#      date = new Date()
#      date.setTime(date.getTime() + (days*24*60*60*1000))
#      expires = "; expires="+date.toGMTString()
#    setting = name+"="+encodeURIComponent(value)+expires+"; path=/"
#    document.cookie = setting
#
#   
#  @GetCookie: (name) ->
#    nameEQ = name + "="
#    ca = document.cookie.split(/;\s*/)
#    for i in [0...ca.length]
#      c = ca[i]
#	    if c.indexOf(nameEQ) == 0
#  	    return decodeURIComponent(c.substring(nameEQ.length,c.length))
#    return null
#
#  @OnMessage: (event) {
#    msg = event.data
#    if event.source === window.parent
#	    if msg.cmd === "set"
#	      Clipboard.SetCookie(msg.name, msg.value, msg.days)
#      else if msg.cmd == "get"
#	      event.source.postMessage(Clipboard.GetCookie(msg.name),"*")

class Clipboard
  constructor: (clipboardServer) ->
    @clipboardServer = clipboardServer || "http://people.csail.mit.edu/karger/Cookie/cookie-server.html"
    @clipboardKey = "cats-clipboard"
    @loading = $.Deferred()
    @serverWindow = null
    window.addEventListener("message", @.onLoad, false)
    $ () =>
      @frame = $("<iframe src='#{@clipboardServer}'></iframe>")
      @frame.hide()
      $('body').append(@frame)
  
  onLoad: (event) =>
    if event.source != @frame.get(0).contentWindow
      return # Wrong event
    window.removeEventListener("message", @.onLoad)
    @serverWindow = event.source
    @loading.resolve()

  copy: (text) =>
    @loading.done () ->
		  @serverWindow.postMessage({
        cmd: "set",
        name: @clipboardKey,
        value: text,
        days: 7},"*")

  paste: (callback) =>
    @loading.done () =>
	    returnData = (event) =>
        if event.source == @serverWindow
          window.removeEventListener("message", returnData)
        if typeof(event) != "undefined"
          if callback?
            callback(event.data)
      window.addEventListener("message", returnData, false)
		  @serverWindow.postMessage({cmd: "get", name: @clipboardKey},"*")
