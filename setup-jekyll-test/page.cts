

/* Map the page content onto the mockup  
 * 
 * Note that relations are performed in Target <--- Source direction.
 *
 * (Target)                                <----      (Source)
 * Mockup Selectors                       Relation    Content Selectors
 * ------------------------------------   ---------   ------------------
 */


page | .site-title                            :is      #site-title;
page | .site-title a {attribute:href}         :is      #site-title a {attribute:href};
page | .site-description                      :is      #site-description;
page | .menu > ul                             :is      #nav-main > ul;
page | .menu > ul > li                        :is      #nav-main > ul > li;
page | .menu .children                        :are     #nav-main > ul > li > ul;
page | .menu a                                :is      #nav-main a;
page | .menu a {attribute:href}               :is      #nav-main a {attribute:href};
page | #recent-posts ul                       :are     #recent-posts;
page | #recent-posts li a                     :is      #recent-posts a;
page | #recent-posts li a {attribute:href}    :is      #recent-posts a {attribute:href};
page | #archives ul                           :are     #archives;
page | #archives li a                         :is      #archives a;
page | #archives li a {attribute:href}        :is      #archives a {attribute:href};
page | #categories ul                         :are     #categories;
page | #categories li a                       :is      #categories a;
page | #categories li a {attribute:href}      :is      #categories a {attribute:href};
page | #search form {attribute: action}       :is      a.site-url {attribute:href};





/* And then graft the mockup into the current page
 *
 * (Target)                                 <----     (Source)
 * Content Selectors                      Relation    Mockup Selectors
 * ------------------------------------   ---------   ------------------
 */

#page                                         :graft   page | #page;