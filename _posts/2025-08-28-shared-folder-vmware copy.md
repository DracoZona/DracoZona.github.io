---
title: "Shared Folder Setup for VMWare"
date: "2025-08-28"
category: "My Notes"
tags: ["My Notes", "General"]
excerpt: "Setting up a shared folder for my vmware setup. Made a post for future reference."
---

# Prerequisites

- Open-vm-tools version is at 10.0.0 or greater
- OS supports fuse
- Kernel version >= 3.10 (if open-vm-tools < 10.3.0. kernel version must be >= 4.0)
- Supports systemd

### Step 1: Create the file /etc/systemd/system/mnt-hgfs.mount

Content:

```

[Unit]
Description=VMware mount for hgfs
DefaultDependencies=no
Before=umount.target
ConditionVirtualization=vmware
After=sys-fs-fuse-connections.mount

[Mount]
What=vmhgfs-fuse
Where=/mnt/hgfs
Type=fuse
Options=default_permissions,allow_other

[Install]
WantedBy=multi-user.target

```

### Step 2: Create the file /etc/modules-load.d/open-vm-tools.conf 

Content:
```
fuse
```
> If the file above is already existing, just add the following line at the bottom.
{: .prompt-info }

### Step 3: Enable the system service

Command:

```
sudo systemctl enable mnt-hgfs.mount
```

> This will make sure the hgfs fdirectory will be mounted after a reboot.
{: .prompt-info }

### Step 4: Make sure the 'fuse' module is loaded:

Command:

```
sudo modprobe -v fuse
```

### Additional step if the shared folder is still not showing in the `/mnt` folder:

Command:

```
sudo systemctl start mnt-hgfs.mount
```

or try 

```
reboot
```

Whatever works. Haha

### Note:

This is how it worked for me. I don't know if there are other ways or something. 