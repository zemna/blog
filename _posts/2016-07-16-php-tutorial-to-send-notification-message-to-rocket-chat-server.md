---
layout: post
title:  "PHP Tutorial to Send Direct Message to Rocket.Chat User"
excerpt: "Learning how to automatically send direct message from PHP application to Rocket.Chat User"
date:   2016-07-16 07:00:00 +0700
categories: programming
tags: rocketchat php notification
image: assets/img/rocketchat-logo.png
---

### 1. Overview

I need to send direct message to target user to notify user action in my PHP application. My company already has `Rocket.Chat` messaging system as a `Company Messenger`. So I decide to use it. Here is a sample.

### 2. Rocket.Chat Setting

#### 2.1. Give `create-d` permission to `Bot` role

To send `Direct Message` from `Bot` to user, `Bot` role has to have `create-d` permission. Go to "Administration" -> "Permissions" and check `create-d` permission for `bot` role.

[![Rocket.Chat create-d permission](/assets/img/rocketchat-create-d-permission-for-bot.jpg){: .img-responsive}](/assets/img/rocketchat-create-d-permission-for-bot.jpg)

#### 2.2. Create a new bot user

This step is `optional` if you want to use existing bot user as a sender of this notification.

Go to "Administration" -> "Users" and create a new `Bot user` and activate.

#### 2.3. Create a new WebHook

Go to "Administration" -> "Integrations" and create a new "Incoming WebHook". And input each settings like this:

* Enabled : True
* Name (Optional) : _Your WebHook Name (ex: My WebHook)_
* Post to Channel : _Input any default username. This will override. (ex: @zemna)_
* Post as : _Input bot user created by Step 2.2 (ex:my-project-bot)_
* Script Enabled : False

Click `Save Changes` to save.

#### 2.4. Test WebHook

You can see the `curl` example on page. Copy it and execute from command prompt to test. If you can receive notification message, all settings are correct.

But if you didn't receive, please check this;

* WebHook is enabled or not?
* To send direct message to user, sending user must have `create-d` permission. You already give permission or not?

#### 2.5. Copy your WebHook URL

You can see `WebHook URL` on `Incoming WebHook` page. Copy it to use in your php application.

### 3. PHP Application Programming

#### 3.0. Prerequisites

We need a mapping betwwen `PHP application user` and `Rocket.Chat user`. You have to make like `Rocket.Chat Integration` page to let user input Rocket.Chat username, or use `same username` between them.

#### 3.1. Install `guzzle` using composer

We will use `guzzle` as a HTTP Client. Install `guzzle` using `composer`.

```bash
$ composer require guzzlehttp/guzzle
```

#### 3.2. Sending Direct Message

Write coding like bellow to send direct message to user.

```php
$client = new GuzzleHttp\Client();

$client->post('Paste Your WebHook URL Here', [
  'body' => json_encode([
    'channel' => '@' . $username,
    'username' => 'My PHP Project',
    'text' => 'New notification arrived',
    'attachments' => [[
      'title' => 'Notification Title',
      'title_link' => 'http://www.example.com/123',
      'text' => 'Notification description',
      'color' => '#0000FF'
    ]]
  ])
]);
```

See [Guzzle Documentation](http://docs.guzzlephp.org/en/latest/) for more options.