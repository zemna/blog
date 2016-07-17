---
layout: post
title:  "How To Block DNS Request From Outside Network in Mikrotik Router"
excerpt: "Learning how to block DNS request from outside network in Mikrotik router"
date:   2016-07-17 07:00:00 +0700
categories: mikrotik
tags: mikrotik
---

```
/ip firewall filter
add chain=input in-interface=ether1 protocol=udp dst-port=53 action=drop
add chain=input in-interface=ether1 protocol=tcp dst-port=53 action=drop
```