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


{% include default.cts %}

mockup | article                                :is      #individual-article;
mockup | article .entry-title                   :is      #individual-article .entry-title;
mockup | article .entry-content                 :is      #individual-article .entry-content;
mockup | article .entry-date                    :is      #individual-article .entry-date-inner;
mockup | article .cat-link a                    :is      #individual-article .cat-link;
mockup | article .cat-link a {attribute:href}   :is      #individual-article .cat-link {attribute:href};
mockup | article .tag-links                     :is      #individual-article .tag-links;






/* And then graft the mockup into the current page
 *
 * (Target)                                 <----     (Source)
 * Content Selectors                      Relation    Mockup Selectors
 * ------------------------------------   ---------   ------------------
 */
#page                                         :graft   mockup | #page;
#page {attribute:class}                       :is      mockup | #page {attribute:class};
#individual-article                           :graft   mockup | article;