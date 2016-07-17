---
layout: post
title:  "Develop User Management Feature with Social Login – Part1"
excerpt: "Learning how to develop User Management Feature with Social Login – Part1"
date:   2015-06-23 07:00:00 +0700
categories: programming
tags: social user
---

* Part1 – System Analysis & Database Design
* Part2 – Internal User Management
* Part3 – Integrate With Social Login

## Part1 – System Analysis & Database Design

### 1. System Analysis

#### 1.1. REQUIREMENTS

User can register using signup feature. User can login using user credentials.
If user forget password, user can reset password using registered email.
User can login using social account like Google, Facebook and Twitter.

#### 1.2. BIG FLOW

The big flow of this feature likes following picture.

[![User Management Big Flow](https://lh3.googleusercontent.com/g61NSUIKLgM43FX2l0r2JwmWQyuesf2j8xFuU5FhMxfK=w481-h741-no){: .img-responsive}](https://lh3.googleusercontent.com/g61NSUIKLgM43FX2l0r2JwmWQyuesf2j8xFuU5FhMxfK=w481-h741-no)

When user connect to website, user can login using basic login system and also social login. Each login feature have different business logic.

__Basic Login__

Process is like as traditional one. User register using username, email, password, display name, etc. After register, user can login using username(or email) and password. System also can give a feature to reset password for user who forget password.

__Social Login__

User also can login using their social account like Google, Facebook and Twitter. Social login has three steps to process. Authorize app by social webpage, verify user in user database and connect social account with user database.

### 2. Database Design

Let’s make a database for user management.

#### 2.1. ENTITY RELATIONSHIP DIAGRAM

[![User Management ERD](https://lh3.googleusercontent.com/xNaWCrNUvPEx-ZJwQX0tR778Vnbg_Ho_6Xl3K39YUFw-=w414-h269-no){: .img-responsive}](https://lh3.googleusercontent.com/xNaWCrNUvPEx-ZJwQX0tR778Vnbg_Ho_6Xl3K39YUFw-=w414-h269-no)

There are 3 tables to manage user. I divided table by feature group.

__‘user’ Table__

This is the main table of user. All users have one record in this table. When user login using social login feature, system searches user table to check existence and add record if doesn’t exist.

```sql
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(16) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(128) DEFAULT NULL,
  `display_name` varchar(50) NOT NULL,
  `created` datetime NOT NULL,
  `user_group` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
```

__‘user_password_reset’ Table__

This table is used for reset password. I divided this table from user table because of frequency. If user want to reset password, system add a new record to ‘user_password_reset’ table with temporary reset verification key and verification expiration date. This key will be sent to user via email. User can click password reset link from email and set a new password. After complete to set a new password, record in this table will be deleted automatically. User also can’t be set a new password if link is already expired.

```sql
CREATE TABLE `user_password_reset` (
  `user_id` bigint(20) NOT NULL,
  `reset_key` varchar(32) NOT NULL,
  `reset_key_expired` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `reset_key` (`reset_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

__‘user_provider’ Table__

This table is for manage social account. Many people have multiple social account. To protect duplication of user creation, social login information will be saved to ‘user_provider’ table and connect with main ‘user’ table.

```sql
CREATE TABLE `user_provider` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `provider` varchar(20) NOT NULL,
  `provider_uid` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
```

### 3. Conclusion

In this article, we made a business flow of user management feature and also made a database.