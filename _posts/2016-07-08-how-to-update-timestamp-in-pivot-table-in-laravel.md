---
layout: post
title:  "How to update timestamp in pivot table in Laravel"
excerpt: "Learning how to update timestamp(created_at and updated_at) column in pivot table in Laravel"
date:   2016-07-08 11:50:00 +0700
categories: laravel
tags: laravel pivot timestamp
---

When insert a new row to pivot table, we can use `attach()` method like this:

```php
$company = Company::find(1);
$company->users()->attach(1);
```

But this will not update created_at and updated_at timestamps column in pivot table.

To update timestamps, use `withTimestamps()` method on the relationship method.

```php
class Company extends Model
{
  public function users()
  {
    return $this->belongsToMany(User::class)->withTimestamps();
  }
}
```