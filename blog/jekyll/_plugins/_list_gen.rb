module Jekyll
  class List < Generator
    def generate(site)
        
      site.categories.each do |category|
        build_subpages(site, "category", category[0], category[1])
      end
      
      site.tags.each do |tag|
        build_subpages(site, "tag", tag[0], tag[1])
      end
       
      years = {};
      site.posts.each do |post|
        if years.has_key?(post.date.year)
          if not years[post.date.year].include?(post.date.month)
            years[post.date.year][post.date.month] = [post]
          else
            years[post.date.year][post.date.month].push(post)
          end     
        else
          years[post.date.year] = {post.date.month=>[post]}
        end      
      end
      years.each_key do |year|
        years[year].each_key do |month|
          build_subpages(site, "archives", "#{year}/#{month.to_s().rjust(2, '0')}", years[year][month])
        end
      end
        
    end
      
    def build_subpages(site, type, val, posts)    
      atomize(site, type, val, posts)
    end
      
    def atomize(site, type, val, posts)
      path = "/#{type}/#{val}"
      atom = AtomPage.new(site, site.source, path, type, val, posts)
      site.pages << atom
    end 
    
    class AtomPage < Page
      def initialize(site, base, dir, type, val, posts)
        @site = site
        @base = base
        @dir = dir
        @name = 'index.html'
    
        self.process(@name)
        self.read_yaml(File.join(base, '_layouts'), "list.html")
        self.data[type] = val
        self.data["type"] = type
        self.data["posts"] = posts
      end
    end
    
  end
end