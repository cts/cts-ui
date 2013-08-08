

/* Map the page content onto the mockup  
 * 
 * Note that relations are performed in Target <--- Source direction.
 *
 * (Target)                                <----      (Source)
 * Mockup Selectors                       Relation    Content Selectors
 * ------------------------------------   ---------   ------------------
 */

index | article .entry-title-inner             :is      #article-list article .entry-title a;
index | article .entry-title a {attribute:href}:is      #article-list article .entry-title a {attribute:href};
index | article .entry-title {attribute:href}  :is      #article-list article .entry-title a {attribute:href};
index | article .entry-content                 :is      #article-list article .entry-content;
index | article .entry-date                    :is      #article-list article .entry-date-inner;
index | article .cat-link                      :is      #article-list article .cat-link;
index | article .cat-link a {attribute:href}   :is      #article-list article .cat-link a {attribute:href};
index | article .tag-links                     :is      #article-list article .tag-links;
index | .article-list                          :are     #article-list;

index | .site-title                            :is      #site-title;
index | .site-title a {attribute:href}         :is      #site-title a {attribute:href};
index | .site-description                      :is      #site-description;
index | .menu > ul                             :is      #nav-main > ul;
index | .menu > ul > li                        :is      #nav-main > ul > li;
index | .menu .children                        :are     #nav-main > ul > li > ul;
index | .menu a                                :is      #nav-main a;
index | .menu a {attribute:href}               :is      #nav-main a {attribute:href};
index | #recent-posts ul                       :are     #recent-posts;
index | #recent-posts li a                     :is      #recent-posts a;
index | #recent-posts li a {attribute:href}    :is      #recent-posts a {attribute:href};
index | #archives ul                           :are     #archives;
index | #archives li a                         :is      #archives a;
index | #archives li a {attribute:href}        :is      #archives a {attribute:href};
index | #categories ul                         :are     #categories;
index | #categories li a                       :is      #categories a;
index | #categories li a {attribute:href}      :is      #categories a {attribute:href};
index | #search form {attribute: action}       :is      a.site-url {attribute:href};





/* And then graft the mockup into the current page
 *
 * (Target)                                 <----     (Source)
 * Content Selectors                      Relation    Mockup Selectors
 * ------------------------------------   ---------   ------------------
 */
#article-list article                          :graft   index | article;
#page                                          :graft   index | #page;

