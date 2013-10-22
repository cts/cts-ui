

_CTSUI.mockupBase = "http://treesheets.csail.mit.edu/mockups/cts-ui/";
_CTSUI.themeBase = "http://treesheets.csail.mit.edu/mockups/blog/";
_CTSUI.mockupBaseLocal = "http://localhost:8000/mockups/";
//_CTSUI.mockupBase = "http://localhost:8000/mockups/";
//_CTSUI.themeBase = "http://localhost:4000/mockups/";

_CTSUI.Mockups = {
  tray: _CTSUI.mockupBase + "tray.html",
  editor: _CTSUI.mockupBase + "editor.html",
  theminator: _CTSUI.mockupBase + "theminator.html",
  saveDialog: _CTSUI.mockupBase + "saveDialog.html"
};

_CTSUI.CSS = {
  tray: _CTSUI.mockupBaseLocal + "css/tray.css",
  editor: _CTSUI.mockupBase + "css/editor.css",
  modal: _CTSUI.mockupBase + "css/modal.css",
  theminator: _CTSUI.mockupBase + "css/theminator.css",
  bootstrap: _CTSUI.mockupBase + "css/bootstrap/bootstrap.min.css"
};

_CTSUI.Img = {
    lightWool: _CTSUI.mockupBase + "img/light_wool.png",
    transparentStar: _CTSUI.mockupBase + "img/transparent-star.png",
    star: _CTSUI.mockupBase + "img/star.png",
    emptyStar: _CTSUI.mockupBase + "img/empty-star.png",
    header: _CTSUI.mockupBase + "img/cts-header-theminator.png"
}

_CTSUI.JSON = {
  filterInfo: _CTSUI.themeBase + "filterInfo.json",
  themeInfo: _CTSUI.themeBase + "themeInfo.json"
};

_CTSUI.Blog = {
    Themes: {
        mog: {
            Mockup: {
                index: _CTSUI.themeBase + "mog/index.html",
                list: _CTSUI.themeBase + "mog/list.html",
                post: _CTSUI.themeBase + "mog/post.html",
                page: _CTSUI.themeBase + "mog/page.html",
                default: _CTSUI.themeBase + "mog/default.html"
            },
            Cts: _CTSUI.themeBase + "mog/mog.cts"
        },
        spun: {
            Mockup: {
                index: _CTSUI.themeBase + "spun/index.html",
                list: _CTSUI.themeBase + "spun/list.html",
                post: _CTSUI.themeBase + "spun/post.html",
                page: _CTSUI.themeBase + "spun/page.html",
                default: _CTSUI.themeBase + "spun/default.html"
            },
            Cts: _CTSUI.themeBase + "spun/spun.cts"
        },
        twenty_thirteen: {
            Mockup: {
                index: _CTSUI.themeBase + "twenty-thirteen/index.html",
                list: _CTSUI.themeBase + "twenty-thirteen/list.html",
                post: _CTSUI.themeBase + "twenty-thirteen/post.html",
                page: _CTSUI.themeBase + "twenty-thirteen/page.html",
                default: _CTSUI.themeBase + "twenty-thirteen/default.html"
            },
            Cts: _CTSUI.themeBase + "twenty-thirteen/twenty-thirteen.cts"
        }
    },
    Jekyll: {
        Cts: {
            index: _CTSUI.themeBase + "index.cts",
            list: _CTSUI.themeBase + "list.cts",
            post: _CTSUI.themeBase + "post.cts",
            page: _CTSUI.themeBase + "page.cts",
            default: _CTSUI.themeBase + "default.cts"
        }
    }
};
