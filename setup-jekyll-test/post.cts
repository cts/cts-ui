

/* Map the page content onto the mockup  
 * 
 * Note that relations are performed in Target <--- Source direction.
 *
 * (Target)                                <----      (Source)
 * Mockup Selectors                       Relation    Content Selectors
 * ------------------------------------   ---------   ------------------
 */


post | .site-title                            :is      #site-title;
post | .site-title a {attribute:href}         :is      #site-title a {attribute:href};
post | .site-description                      :is      #site-description;
post | .menu > ul                             :is      #nav-main > ul;
post | .menu > ul > li                        :is      #nav-main > ul > li;
post | .menu .children                        :are     #nav-main > ul > li > ul;
post | .menu a                                :is      #nav-main a;
post | .menu a {attribute:href}               :is      #nav-main a {attribute:href};
post | #recent-posts ul                       :are     #recent-posts;
post | #recent-posts li a                     :is      #recent-posts a;
post | #recent-posts li a {attribute:href}    :is      #recent-posts a {attribute:href};
post | #archives ul                           :are     #archives;
post | #archives li a                         :is      #archives a;
post | #archives li a {attribute:href}        :is      #archives a {attribute:href};
post | #categories ul                         :are     #categories;
post | #categories li a                       :is      #categories a;
post | #categories li a {attribute:href}      :is      #categories a {attribute:href};
post | #search form {attribute: action}       :is      a.site-url {attribute:href};

post | article                                :is      #individual-article;
post | article .entry-title                   :is      #individual-article .entry-title;
post | article .entry-content                 :is      #individual-article .entry-content;
post | article .entry-date                    :is      #individual-article .entry-date-inner;
post | article .cat-link a                    :is      #individual-article .cat-link;
post | article .cat-link a {attribute:href}   :is      #individual-article .cat-link {attribute:href};
post | article .tag-links                     :is      #individual-article .tag-links;






/* And then graft the mockup into the current page
 *
 * (Target)                                 <----     (Source)
 * Content Selectors                      Relation    Mockup Selectors
 * ------------------------------------   ---------   ------------------
 */
#page                                         :graft   post | #page;
#page {attribute:class}                       :is      post | #page {attribute:class};
#individual-article                           :graft   post | article;