---

---

/* Map the page content onto the mockup  
 * 
 * Note that relations are performed in Target <--- Source direction.
 *
 * (Target)                                <----      (Source)
 * Mockup Selectors                       Relation    Content Selectors
 * ------------------------------------   ---------   ------------------
 */

mockup | article .entry-title-inner             :is      #article-list article .entry-title a;
mockup | article .entry-title a {attribute:href}:is      #article-list article .entry-title a {attribute:href};
mockup | article .entry-title {attribute:href}  :is      #article-list article .entry-title a {attribute:href};
mockup | article .entry-content                 :is      #article-list article .entry-content;
mockup | article .entry-date                    :is      #article-list article .entry-date-inner;
mockup | article .cat-link                      :is      #article-list article .cat-link;
mockup | article .cat-link a {attribute:href}   :is      #article-list article .cat-link a {attribute:href};
mockup | article .tag-links                     :is      #article-list article .tag-links;
mockup | .article-list                          :are     #article-list;

{% include default.cts %}





/* And then graft the mockup into the current page
 *
 * (Target)                                 <----     (Source)
 * Content Selectors                      Relation    Mockup Selectors
 * ------------------------------------   ---------   ------------------
 */
#article-list article                          :graft   mockup | article;
#page                                          :graft   mockup | #page;

