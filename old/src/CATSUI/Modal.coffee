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

# Author: Ted Benson <eob@csail.mit.edu>

$ = jQueryHcss

class Modal
  constructor: (title, content, ok, cancel, okCallback, cancelCallback) ->
    @title = title
    @content = content
    @ok = ok
    @cancel = cancel
    @okCallback = okCallback
    @cancalCallback = cancelCallback

  show: () ->
    modal = """
      <div class="modal webCatsContainer" id="catsuiModal">
        <div class="modal-header">
          <button class="close" data-dismiss="modal">×</button>
          <h3>#{@title}</h3>
        </div>
        <div class="modal-body">#{@content}</div>
        <div class="modal-footer">
          <a href="#" class="btn">#{@cancel}</a>
          <a href="#" class="btn btn-primary">#{@ok}</a>
        </div>
     </div>
    """
    @modal = $(modal)
    @modal.hide()
    $('body').append(@modal)
    @modal.modal()
    @modal.modal('show')



