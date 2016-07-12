---
layout: post
title:  "Complex unique validation rule in Laravel"
excerpt: "Learning how to use unique validation rule with more condition in Laravel"
date:   2016-07-12 22:10:00 +0700
categories: laravel
tags: laravel validation unique
image: assets/img/laravel-logo.png
---

Laravel provides `unique` validation rule for check unique value on a given database table.

Ref : [https://laravel.com/docs/5.1/validation#rule-unique](https://laravel.com/docs/5.1/validation#rule-unique)

### Syntax

*unique:table,column,except,idColumn,whereColumn1,whereValue1,whereColumn2,whereValue2,...*

### Ex1. Validate unique value in given database table

```php
'username' => 'unique:users,username'
```

### Ex2. Validate unique value except given ID

In mostly used when update existing record.

```php
'username' => 'unique:users,username,'.$user->id
```

### Ex3. Gives id column name if primary key of table isn't 'id'.

```php
'username' => 'unique:users,username,'.$user->id.',user_id'
```

### Ex4. Adding additional where clauses for more complex condition

If company has tag list and want to check unique value,

```php
'name' => 'unique:tags,name,NULL,id,company_id,'.$company_id
```

If company has hierarchical folder list and want to check unique value per each node,

```php
'name' => 'unique:folders,name,NULL,id,company_id,'.$company_id.',parent_id,'.$parent_id
```