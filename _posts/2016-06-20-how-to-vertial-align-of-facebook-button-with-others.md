---
layout: post
title:  "How to vertical align of Facebook button with others"
excerpt: "Leaning how to vertical align of Facebook button with other social buttons"
date:   2016-06-19 18:37:00 +0700
categories: web
tags: web
---

When I attach social buttons to my blog, Facebook button moves bottom almost 5 pixels from other social buttons like Twitter, Google+.

This is because facebook button has `vertical-align: bottom;` style inside of widget;

We can solve this problem adding bellow style to css.

```css
.fb_iframe_widget span {
    vertical-align: baseline !important;
}
```