CTS UI
======

Running the Development Environment
-----------------------------------

Running the development environment consists of three console tabs: one to run
the CTS-JS development server, one to run the CTS-UI development server, and
one to rebuild the project when you make a change to the code.

1. First checkout cts-js (github.com/cts/cts-js) and run the development server
   in that projet (port 9000):

     python dev-server.js

2. Then, in this project, (github.com/cts/cts-ui), run the development server
   on (port 8000):

    python dev-server.js

### Getting the bookmarklet link

Once you've got the development server running, you'll want to grab the
development bookmarklet link. This will inject CTS-UI (and CTS) into any web
page.

Visit the following page:

    http://localhost:8000/development-bookmarklet.html

And drag the bookmarklet link to the toolbar of your browser.

### Changing the code and re-running

From a separate console, run grunt in the project root:

    grunt

This will rebuild `release/ctsui.js`. If you refresh whatever web page you were
testing CTS-UI on and click the Bookmarklet link again, you should load the new
version.

Note that sometimes you have to clear your browser history.
