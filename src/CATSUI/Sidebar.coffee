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

## Context
# Author: Ted Benson <eob@csail.mit.edu>

$ = jQueryHcss

class Sidebar
  constructor: () ->
    @clipboard = new CATSUI.Clipboard()
    @.buildUI()

  buildUI: () ->
    html = """
    <div id="catsui-sidebar-wrapper">
      <a href="#" id="catsui-sidebar-button">CATS</a>
      <div id="catsui-sidebar">
        <h1>CATS</h1>
        <h2>Clipboard</h2>
        <ul>
          <li><a href="#">Copy Data</a></li>
          <li><a href="#">Copy Style</a></li>
          <li><a href="#">Paste Data</a></li>
          <li><a href="#">Paste Style</a></li>
        </ul>
        <h2>Edit</h2>
        <ul>
          <li><a href="#">Edit Data</a></li>
        </ul>
      </div>
    </div>
    """
    
    $("body").append(html)

    @container = $("#catsui-sidebar-wrapper")
    @toggleBtn = $("#catsui-sidebar-button")
    @toggleBtn.click(() =>
      @.toggle()
    )

  toggle: () ->
    if (@container.css("left") == "0px")
      @container.css("left", "-200px")
    else 
      @container.css("left", "0px")

window.CATSUI.sidebar = new window.CATSUI.Sidebar()
