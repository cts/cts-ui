
/* Map the page content onto the mockup  
 * 
 * Note that relations are performed in Target <--- Source direction.
 *
 * (Target)                                <----      (Source)
 * Mockup Selectors                       Relation    Content Selectors
 * ------------------------------------   ---------   ------------------
 */

list | .page-title .index-type                :is      .index-type;
list | .page-title .index-cat                 :is      .index-cat;

list | article .entry-title-inner             :is      #article-list article .entry-title a;
list | article .entry-title a {attribute:href}:is      #article-list article .entry-title a {attribute:href};
list | article .entry-title {attribute:href}  :is      #article-list article .entry-title a {attribute:href};
list | article .entry-content                 :is      #article-list article .entry-content;
list | article .entry-date                    :is      #article-list article .entry-date-inner;
list | article .cat-link                      :is      #article-list article .cat-link;
list | article .cat-link a {attribute:href}   :is      #article-list article .cat-link a {attribute:href};
list | article .tag-links                     :is      #article-list article .tag-links;
list | #article-list                          :are     #article-list;

list | .site-title                            :is      #site-title;
list | .site-title a {attribute:href}         :is      #site-title a {attribute:href};
list | .site-description                      :is      #site-description;
list | .menu > ul                             :is      #nav-main > ul;
list | .menu > ul > li                        :is      #nav-main > ul > li;
list | .menu .children                        :are     #nav-main > ul > li > ul;
list | .menu a                                :is      #nav-main a;
list | .menu a {attribute:href}               :is      #nav-main a {attribute:href};
list | #recent-posts ul                       :are     #recent-posts;
list | #recent-posts li a                     :is      #recent-posts a;
list | #recent-posts li a {attribute:href}    :is      #recent-posts a {attribute:href};
list | #archives ul                           :are     #archives;
list | #archives li a                         :is      #archives a;
list | #archives li a {attribute:href}        :is      #archives a {attribute:href};
list | #categories ul                         :are     #categories;
list | #categories li a                       :is      #categories a;
list | #categories li a {attribute:href}      :is      #categories a {attribute:href};
list | #search form {attribute: action}       :is      a.site-url {attribute:href};





/* And then graft the mockup into the current page
 *
 * (Target)                                 <----     (Source)
 * Content Selectors                      Relation    Mockup Selectors
 * ------------------------------------   ---------   ------------------
 */
#article-list article                         :graft   list | article;
#page                                         :graft   list | #page;
