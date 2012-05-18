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

# Preamble
$ = jQueryHcss

class UI
  constructor: () ->
    @clipboard = new CATSUI.Clipboard()
    @callout = new CATSUI.ElementCallout()
    @picker = new CATSUI.ElementPicker()
    @pasteTarget = null
    @pasteUI = """
      <div>
        <p align="center" style="font-size: 1.3em">
          <input type="checkbox" checked id="pasteData" />Data &nbsp 
        <input type="checkbox" checked id="pasteStyle" />Style</p><br />
        <div style="padding-left: 40px; float: left; margin-right: 5px;">
        <img src="http://webcats.github.com/catsui/hotlink/where.png" />
        </div>
        <div style="margin-left: 5px">
          <div style="margin-top:9px">
            <input type="radio" style="margin-right: 3px" data-location="before" id="pasteBefore" name="pasteWhere" />Before
          </div>
          <div style="margin-top:18px">
            <input type="radio" style="margin-right: 3px" data-location="prepend" id="pastePrepend" name="pasteWhere" />Prepend<br />
          </div>
          <div style="margin-top:-1px">
            <input type="radio" tyle="margin-right: 3px" data-location="replace" id="pasteReplace" name="pasteWhere" />Replace<br />
          </div>
          <div style="margin-top:0px">
            <input type="radio" style="margin-right: 3px" data-location="append" id="pasteAppend" name="pasteWhere" />Append<br />
          </div>
          <div style="margin-top:13px">
            <input type="radio" style="margin-right: 3px" data-location="after" id="pasteAfter" name="pasteWhere" />After
          </div>
        </div>
        <br />
        <p align="center">
        <button class="btn btn-primary pasterBtn">Paste</button>&nbsp<button class="btn pasteCancelBtn">Cancel</button></p>
      </div>
    """


  # Triggers the Element Picker, witha callback to the the Paste UI
  # once an element has been picked
  copy: () =>
    @picker.pick(@.copyTargetSelected, {'autoClear':yes})

  copyTargetSelected: (target) =>
    wrapper = $("<div />")
    wrapper.append(target.clone())
    html = wrapper.html()
    @clipboard.copy(html)

  paste: () =>
    @pasteTarget = null
    @picker.pick(@.pasteTargetSelected, {'autoClear':no})

  pasteTargetSelected: (target) => 
    @target = target
    @callout.callout(target, "Paste", @pasteUI)

    $(".pasteCancelBtn").click (event) =>
      event.preventDefault()
      @picker.clearSelection()
      @callout.close(@target)
      @target = null

    $(".pasterBtn").click (event) =>
      # Once they have selected the paste options, clear selection
      # an call the low-level DSS Paste library with their choice
      event.preventDefault()
      @picker.clearSelection()
      data = $("#pasteData").is(":checked")
      style = $("#pasteStyle").is(":checked") 
      loc = $("input:radio[name=pasteWhere]:checked").data("location") 
      opts = {'location':loc, 'style':style, 'data':data}
      @callout.close(@target)
      @clipboard.paste (content) =>
        @.performPaste(@target, opts, content)
        @target = null

  # Options are
  # *  location: One of 'before', 'after', 'prepend', 'append', 'replace'
  # *  style: true
  # *  data: true
  performPaste: (anchor, options, html) =>
    opts = $.extend {}, {'location':'prepend', 'style':true, 'data':true}, options
    node = $(html)

    replacementNode = $()
    if opts.data and opts.style
      replacementNode = node
    else if opts.data and not opts.style
      data = @engine.extractData(node)
      console.log("Pasted data:")
      console.log(data)
      template = @engine.extractTemplate(anchor)
      replacementNode = @engine.render(template, [data])
      replacementNode = template
    else if opts.style and not opts.data
      data = @engine.extractData(anchor)
      console.log("Pasted data:")
      console.log(data)
      template = @engine.extractTemplate(node)
      @engine.render(template, [data])
      replacementNode = template
    @.pasteNode(anchor, replacementNode, opts.location)

  # Helper function to inject a node into the DOM based on an offet
  # to some anchor node.
  pasteNode: (anchor, node, location) ->
    switch location
      when "replace"
        anchor.replaceWith(node)
        break
      when "prepend"
        anchor.prepend(node)
        break
      when "append"
        anchor.append(node)
        break
      when "before"
        anchor.before(node)
        break
      when "after"
        anchor.after(node)
        break
      else
        console.log("Error: did not understand location: " + location)


class Sidebar
  constructor: () ->
    @ui = new CATSUI.UI()
    @.buildUI()

  buildUI: () ->
    html = """
    <div id="catsui-sidebar-wrapper">
      <a href="#" id="catsui-sidebar-button">CATS</a>
      <div id="catsui-sidebar">
        <h1>CATS</h1>
        <h2>Clipboard</h2>
        <ul>
          <li><a id="catsui-btn-copy" href="#">Copy</a></li>
          <li><a id="catsui-btn-paste" href="#">Paste</a></li>
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
    @copyButton = $("#catsui-btn-copy")
    @pasteButton = $("#catsui-btn-paste")
    
    @toggleBtn.click(() =>
      @.toggle()
    )
    @copyButton.click(() =>
      @.toggle()
      @ui.copy()
    )
    @pasteButton.click(() =>
      @.toggle()
      @ui.paste()
    )

  toggle: () ->
    if (@container.css("left") == "0px")
      @container.css("left", "-200px")
    else 
      @container.css("left", "0px")

window.CATSUI.sidebar = new window.CATSUI.Sidebar()
