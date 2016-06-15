---
layout: post
title:  "How to deploy subfolder to Github Pages"
categories: [Github]
---

{% highlight json %}
{
    "name": "Example App",
    "dependencies": { ... },
    "scripts": {
        "deploy": "git subtree push --prefix subfolder-name-here origin gh-pages"
    }
}
{% endhighlight %}