---
layout: post
title:  "How to solve SSL error of RubyGems"
excerpt: "Leaning how to solve SSL error when trying to pull updates from RubyGems"
date:   2016-12-30 18:00:00 +0700
categories: programming
tags: ssl rubygems
---

When you exeucte `gem` command, you may see SSL error like bellow.

```console
SSL_connect returned=1 errno=0 state=SSLv3 read server certificate B: certificate verify failed
```

This error is produced because of changes in rubygems.org infrastructure.

### How to solve it?

#### 1. Downlaod update package

Download update package from bellow link.

Download : [rubygems-update-2.6.7.gem](https://rubygems.org/downloads/rubygems-update-2.6.7.gem)

#### 2. Update RubyGems using Command Prompt

Execute `Command Prompt` and go to download folder. (ex. C:\)

And execute bellow command.

```console
C:\>gem install --local C:\rubygems-update-2.6.7.gem
C:\>update_rubygems --no-ri --no-rdoc
```

After this, execute `gem --version` to check new version of RubyGems.

#### 3. Uninstall rubygems-update gem

You can uninstall `rubygems-update` gem.

```console
C:\>gem uninstall rubygems-update -x
Removing update_rubygems
Successfully uninstalled rubygems-update-2.6.7
```

### Reference

* [http://guides.rubygems.org/ssl-certificate-update](http://guides.rubygems.org/ssl-certificate-update/)