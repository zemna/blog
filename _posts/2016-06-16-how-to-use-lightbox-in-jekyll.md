---
layout: post
title:  "How to use Lightbox in Jekyll"
categories: programming
tags: jekyll, lightbox
---

Install with bower

```bash
$ bower install ekko-lightbox --save
```

Basic usage likes bellow,

```html
<a href="image-url" data-toggle="lightbox" data-title="Image title" data-footer="Image footer">
    ![Image Title](/images/github-logo.png){: width="400px" }
</a>
```

If you want to give lightbox feature to all images in page, we can it by bellow javascript.

first, give anchor to image in jekyll

```html
[![Title](/images/github-logo.png){: width="400px"}](/images/github-logo.png)
```

and, make javascript like bellow,

```javascript
$(function() {
    $('img').each(function() {
        var that = $(this);
        that.closest('a').attr('data-toggle', 'lightbox').attr('data-title', that.attr('alt'));
    });

    $(document).delegate('*[data-toggle="lightbox"]', 'click', function(e) {
        e.preventDefault();
        $(this).ekkoLightbox();
    });    
})
```

This is sample.

[![Title](/images/github-logo.png){: width="400px"}](/images/github-logo.png)