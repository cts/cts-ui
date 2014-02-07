CTS UI
======

Running the Development Environment
-----------------------------------

Running the development environment consists of three console tabs: one to run
the CTS-JS development server, one to run the CTS-UI development server, and
one to rebuild the project when you make a change to the code.

1. First checkout cts-js (github.com/cts/cts-js) and run the development server
   in that projet (port 9000):

     ```
     npm install (first time only)
     grunt server
     ```

     The `grunt server` task will run a web server hosting `cts.js` on port
     9000 and also watch and recompile upon file changes.

2. Then, in this project, (github.com/cts/cts-ui), run the development server
   on (port 8000):

     ```
     npm install (first time only)
     grunt server
     ```

     The `grunt server` task will run a web server hosting `ctsui.js` on port
     8000 and also watch and recompile upon file changes.

### Getting the bookmarklet link

Once you've got the development server running, you'll want to grab the
development bookmarklet link. This will inject CTS-UI (and CTS) into any web
page.

Visit the following page:

    ```
    http://localhost:8000/development-bookmarklet.html
    ```

And drag the bookmarklet link to the toolbar of your browser.

### Changing the code and re-running

If you're running `grunt server`, the code should update automatically as you
make changes in your editor. If you want to manually re-compile, in a separate
console, run the following command in the project root:

    ```
    grunt
    ```

This will rebuild `release/ctsui.js`. If you refresh whatever web page you were
testing CTS-UI on and click the Bookmarklet link again, you should load the new
version.

Note that sometimes you have to clear your browser history.

### Changing LESS

To automatically compile LESS to CSS:

  ```
  grunt watch less
  ```

To manually compile:

  ```
  grunt less:development
  ```

  or

  ```
  grunt less:production
  ```

This will compiled your less files into the /mockups/css directory.

Note that you must add new less files to the Gruntfile.

Code Notes
----------

This code makes use of some other excellent open source libraries:

*  **Alertify**, by Fabien Doiron (http://fabien-d.github.io/alertify.js/)


Why did the chicken cross the road?
-----------------------------------

To get to the other side!
