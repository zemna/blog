---
layout: post
title:  "How to add a new options by user to Select2 dropdown"
excerpt: "Learning how to add a new options by user to Select2 dropdown"
date:   2016-07-10 10:15:00 +0700
categories: javascript
tags: javascript select2 dropdown
---

If you want to give user can add new options to select tag in runtime, we can use [Select2](https://select2.github.io/) jQuery library to do it.

### 1. Enable tags option

```javascript
$('select').select2({
  tags: true
});
```

### 2. Handle `createTag` function to add extra properties

```javascript
$('select').select2({
  tags: true,
  createTag: function (params) {
    var term = $.trim(params.term);

    if (term === '') {
      return null;
    }

    return {
      id: term,
      text: term,
      newTag: true // add additional perameters
    }
  }
});
```

### 3. Update `templateResult` function to display "(new)" text inside of item

```javascript
$('select').select2({
  tags: true,
  createTag: function (params) {
    var term = $.trim(params.term);

    if (term === '') {
      return null;
    }

    return {
      id: term,
      text: term,
      newTag: true // add additional perameters
    }
  },
  templateResult: function(data) {
    var $result = $("<span></span>");

    $result.text(data.text);

    if (data.newTag) {
      $result.append(" <em>(new)</em>");
    }

    return $result;
  }
});
```

### References

* [https://select2.github.io/options.html](https://select2.github.io/options.html)
* [https://stackoverflow.com/questions/14577014/select2-dropdown-but-allow-new-values-by-user/30021059#30021059](https://stackoverflow.com/questions/14577014/select2-dropdown-but-allow-new-values-by-user/30021059#30021059)