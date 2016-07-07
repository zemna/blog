---
layout: post
title:  "How to add social sharing buttons to Jekyll"
categories: programming
tags: jekyll social
---

Lets we study how to add social sharing buttons to Jekyll. You can see the sharing buttons at bottom of this content. 

We can try to use [Font Awesome](http://fontawesome.io) to generate social icon button.

Click [this link](http://fontawesome.io/examples/#stacked) to get information about stacked icons.

## Facebook Button

{% raw %}
```html
<a href="https://www.facebook.com/sharer/sharer.php?u={{ page.url | replace:'index.html','' | prepend: site.baseurl | prepend: site.url }}&title={{ page.title | encode }}">
    <span class="fa-stack">
        <i class="fa fa-square fa-stack-2x" style="color: #3b5998;"></i>
        <i class="fa fa-facebook fa-stack-1x fa-inverse"></i>
    </span>
</a>
```
{% endraw %}

## Twitter Button

{% raw %}
```html
<a href="http://twitter.com/share?url={{ page.url | replace:'index.html','' | prepend: site.baseurl | prepend: site.url }}&title={{ page.title | encode }}&text={{ page.title | encode }}">
    <span class="fa-stack">
        <i class="fa fa-square fa-stack-2x" style="color: #0084b4;"></i>
        <i class="fa fa-twitter fa-stack-1x fa-inverse"></i>
    </span>
</a>
```
{% endraw %}

## Google+ Button

{% raw %}
```html
<a href="https://plus.google.com/share?url={{ page.url | replace:'index.html','' | prepend: site.baseurl | prepend: site.url }}">
    <span class="fa-stack">
        <i class="fa fa-square fa-stack-2x" style="color: #d34836;"></i>
        <i class="fa fa-google-plus fa-stack-1x fa-inverse"></i>
    </span>
</a>
```
{% endraw %}

You can also make other types of social buttons.

## References

* [Share Link Generator](http://www.sharelinkgenerator.com/)
* [Social Media Colours](http://designpieces.com/2012/12/social-media-colours-hex-and-rgb/)