---
layout: post
title:  "How to setting to use SQL Server in Laravel"
excerpt: "How to setting SQL Server configuration in Laravel"
date:   2016-06-20 12:47:00 +0700
categories: laravel
tags: laravel
---

When I setup Laravel project for my company, I've faced the problem about SQL Server database connection problem. I've googled and now I can use it.

## 1. Install php7.0-sybase to Homestead

New version of Homestead uses php7.0 to serve laravel website. So, I installed php7.0-sybase using bellow command.

```bash
$ sudo apt-get install php7.0-sybase
```

## 2. Edit /etc/freetds/freetds.conf file

I don't know about TDS but I followed reference bellow,

* [laracasts - sqlsrv driver on Linux?](https://laracasts.com/discuss/channels/general-discussion/sqlsrv-driver-on-linux/replies/14887)

```bash
$ sudo vi /etc/freetds/freetds.conf
```

```bash
[global]
    tds version = 7.2
    client charset = UTF-8
```

Also create /etc/freetds/locales.conf file to allow correct parsing of dates.

```bash
$ sudo vi /etc/freetds/locales.conf
```

```bash
[default]
    date format = %Y-%m-%d %I:%M:%S.%z
```

## 3. add getDateFormat() function to each Model classes

Eventhough I already set the datetime format from above, I still got the `Data missing` error when access `Carbon` class.
This is because the difference of datetime string format. My SQL Server gives `'2016-06-20 13:00:00'` datetime string to Laravel, but `Carbon` accepts `'Y-m-d H:i:s.000'` format to create instance.

So, add `getDateFormat()` function to each Model classes to give format information.

```php
protected function getDateFormat() {
  return 'Y-m-d H:i:s+';
}
```

SqlServerGrammer.php file returns `Y-m-d H:i:s.000` DateFormat. Change it to `Y-m-d H:i:s` to apply all models or just delete this function. Because `Grammer.php` abstract class returns `Y-m-d H:i:s` format...