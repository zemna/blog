---
layout: post
title:  "Setup Virtual Development Environment for PHP Project"
excerpt: "Leaning how to setup Virtual Development Environment using Vagrant for PHP Project"
date:   2016-07-21 13:00:00 +0700
categories: programming
tags: php virtual vagrant scotch
---

To make development environment in programmers computer, There are so many applications which have to install.

But If we use `Virtual` development environment, we can install thoese applications to separeted operating system and also can manage per project.

### 1. Download and Install Vagrant

Vagrant is a tool for building complete developemnt environment.

Go to [Download Page](https://www.vagrantup.com/downloads.html) and install to your computer.

### 2. Download and Install VirtualBox

Go to [Download Page](https://www.virtualbox.org/wiki/Downloads) and install to your computer.

### 3. Initialize Vagrant to Your Project

[Scotch Box](https://box.scotch.io) gives preconfigured Vigrant Box with a full array of LAMP Stack features. So we will use Scotch Box to prepare development environment.

#### 3.1. Initialize Vagrant

```bash
$ vagrant init
```

Above command will make `Vagrantfile` file.

#### 3.2. Setup `Vagrantfile' file

You can edit `Vagrantfile` made by 3.1 by manual. Or just copy and pate from [https://github.com/scotch-io/scotch-box](https://github.com/scotch-io/scotch-box/blob/master/Vagrantfile).

```yml
# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

    config.vm.box = "scotch/box"
    config.vm.network "private_network", ip: "192.168.10.100"
    config.vm.hostname = "my-project"
    config.vm.synced_folder ".", "/var/www", :mount_options => ["dmode=777", "fmode=666"]
    
    # Optional NFS. Make sure to remove other synced_folder line too
    #config.vm.synced_folder ".", "/var/www", :nfs => { :mount_options => ["dmode=777","fmode=666"] }

end
```

Update `ip address` and `synced_folder` to matching your project. Basically `scotch-box` uses `/var/www/public` folder as a document root of web server. So if your root folder is the main of web page, you have to set `synced_folder` to `/var/www/public`.

### 4. Run Vagrant

Run vigrant using bellow command:

```bash
$ vagrant up
```

### 5. Connet SSH

Connect ssh using bellow command:

```bash
$ vagrant ssh
```

### 6. Adding MSSQL Connection Support

By default, `scotch-box` doesn't support MSSQL connection. So, if you want to connect to MSSQL exeucte bellow command:

```bash
$ sudo apt-get update
$ sudo apt-get php5-sybase
```

### 7. Enjoy Development

All done, You can connect virtual web server using `ip address` or `hostname` you defined in `Vagrantfile`.

### Reference

* [https://box.scotch.io](https://box.scotch.io)