---
layout: post
title:  "How To Block Brute Force Attack in Mikrotik Router"
excerpt: "Learning how to block Brute Force attack in Mikrotik router"
date:   2016-07-17 08:00:00 +0700
categories: mikrotik
tags: mikrotik brute-force
---

```
/ ip firewall filter
add chain=input protocol=tcp dst-port=22 src-address-list=ssh_blacklist action=drop comment="Drop SSH Brute Forcers" disabled=no
add chain=input protocol=tcp dst-port=22 connection-state=new src-address-list=ssh_stage3 action=add-src-to-address-list address-list=ssh_blacklist address-list-timeout=1d comment="" disabled=no
add chain=input protocol=tcp dst-port=22 connection-state=new src-address-list=ssh_stage2 action=add-src-to-address-list address-list=ssh_stage3 address-list-timeout=1m comment="" disabled=no
add chain=input protocol=tcp dst-port=22 connection-state=new src-address-list=ssh_stage1 action=add-src-to-address-list address-list=ssh_stage2 address-list-timeout=1m comment="" disabled=no
add chain=input protocol=tcp dst-port=22 connection-state=new action=add-src-to-address-list address-list=ssh_stage1 address-list-timeout=1m comment="" disabled=no
```

```
/ ip firewall filter
add chain=input protocol=tcp dst-port=21 src-address-list=ftp_blacklist action=drop comment="Drop FTP Brute Forcers" disabled=no
add chain=input protocol=tcp dst-port=21 connection-state=new src-address-list=ftp_stage3 action=add-src-to-address-list address-list=ftp_blacklist address-list-timeout=1d comment="" disabled=no
add chain=input protocol=tcp dst-port=21 connection-state=new src-address-list=ftp_stage2 action=add-src-to-address-list address-list=ftp_stage3 address-list-timeout=1m comment="" disabled=no
add chain=input protocol=tcp dst-port=21 connection-state=new src-address-list=ftp_stage1 action=add-src-to-address-list address-list=ftp_stage2 address-list-timeout=1m comment="" disabled=no
add chain=input protocol=tcp dst-port=21 connection-state=new action=add-src-to-address-list address-list=ftp_stage1 address-list-timeout=1m comment="" disabled=no
```

```
/ ip firewall filter
add chain=input protocol=tcp dst-port=23 src-address-list=telnet_blacklist action=drop comment="Drop Telnet Brute Forcers" disabled=no
add chain=input protocol=tcp dst-port=23 connection-state=new src-address-list=telnet_stage3 action=add-src-to-address-list address-list=telnet_blacklist address-list-timeout=1d comment="" disabled=no
add chain=input protocol=tcp dst-port=23 connection-state=new src-address-list=telnet_stage2 action=add-src-to-address-list address-list=telnet_stage3 address-list-timeout=1m comment="" disabled=no
add chain=input protocol=tcp dst-port=23 connection-state=new src-address-list=telnet_stage1 action=add-src-to-address-list address-list=telnet_stage2 address-list-timeout=1m comment="" disabled=no
add chain=input protocol=tcp dst-port=23 connection-state=new action=add-src-to-address-list address-list=telnet_stage1 address-list-timeout=1m comment="" disabled=no
```