_CTSUI = {};


//_CTSUI.mockupBase = "http://www.treesheets.org/cts-ui/mockups/";
//_CTSUI.themeBase = "http://treesheets.csail.mit.edu/mockups/blog/";

_CTSUI.mockupBase = "http://localhost:8000/";
_CTSUI.themeBase = "http://localhost:4000/";

_CTSUI.Mockups = {
  tray: _CTSUI.mockupBase + "tray.html",
  editor: _CTSUI.mockupBase + "editor.html",
  theminator: _CTSUI.mockupBase + "theminator.html"
};

_CTSUI.CSS = {
  tray: _CTSUI.mockupBase + "css/tray.css",
  editor: _CTSUI.mockupBase + "css/editor.css",
  theminator: _CTSUI.mockupBase + "css/theminator.css",
  bootstrap: _CTSUI.mockupBase + "css/bootstrap/bootstrap.min.css"
};

_CTSUI.JSON = {
  filterInfo: _CTSUI.themeBase + "filterInfo.json",
  themesInfo: _CTSUI.themeBase + "themeInfo.json"
};


_CTSUI.Blog = {
    Themes: {
        mog: {
            Mockup: {
                index: _CTSUI.themeBase + "themes/mog/index.html",
                list: _CTSUI.themeBase + "themes/mog/list.html",
                post: _CTSUI.themeBase + "themes/mog/post.html",
                page: _CTSUI.themeBase + "themes/mog/page.html",
                default: _CTSUI.themeBase + "themes/mog/default.html"
            },
            Cts: _CTSUI.themeBase + "themes/mog/mog.cts"
        },
        spun: {
            Mockup: {
                index: _CTSUI.themeBase + "themes/spun/index.html",
                list: _CTSUI.themeBase + "themes/spun/list.html",
                post: _CTSUI.themeBase + "themes/spun/post.html",
                page: _CTSUI.themeBase + "themes/spun/page.html",
                default: _CTSUI.themeBase + "themes/spun/default.html"
            },
            Cts: _CTSUI.themeBase + "themes/spun/spun.cts"
        }
    },
    Jekyll: {
        Cts: {
            index: _CTSUI.themeBase + "jekyll/index.cts",
            list: _CTSUI.themeBase + "jekyll/list.cts",
            post: _CTSUI.themeBase + "jekyll/post.cts",
            page: _CTSUI.themeBase + "jekyll/page.cts",
        }
    }
};