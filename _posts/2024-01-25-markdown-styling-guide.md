---
title: "Markdown Styling Guide - Code Blocks and Prompts"
date: "2024-01-25"
category: "Documentation"
tags: ["markdown", "styling", "guide"]
excerpt: "Complete guide on using enhanced code blocks and prompt boxes in your blog posts."
---

# Markdown Styling Guide

This guide demonstrates how to use the enhanced code blocks and prompt boxes in your blog posts.

## Code Blocks

Use triple backticks with language specification for syntax highlighting:

```bash
nmap -sS -sV -sC -O target.com
```

```python
def exploit_buffer_overflow():
    payload = "A" * 140
    payload += struct.pack("<I", 0x08048484)
    return payload
```

```powershell
Get-ADUser -Filter * -Properties * | Select-Object Name, SamAccountName
```

```sql
SELECT * FROM users WHERE id = 1 UNION SELECT username, password FROM admin_users--
```

## Prompt Boxes

### Info Prompt (Blue)
> **Nmap** is a network discovery and security auditing tool used for network exploration and security scanning.
{: .prompt-info }

### Warning Prompt (Yellow)
> **Always get proper authorization** before conducting any penetration testing activities on systems you don't own.
{: .prompt-warning }

### Danger Prompt (Red)
> **SeDebugPrivilege** allows a process to debug other processes, potentially leading to full system compromise if exploited.
{: .prompt-danger }

### Success Prompt (Green)
> **Successfully compromised** the target system and obtained administrator privileges!
{: .prompt-success }

### Tip Prompt (Purple)
> **Pro tip:** Always document your methodology and findings during penetration testing for better reporting.
{: .prompt-tip }

## Combined Example

Here's a practical example combining both features:

```bash
# Initial reconnaissance
nmap -sS -sV -p- target.com
```

> **Remember** to always start with passive reconnaissance before moving to active scanning techniques.
{: .prompt-tip }

```bash
# SMB enumeration
smbclient -L //target.com -N
enum4linux -a target.com
```

> **SMB null sessions** can sometimes provide valuable information about users and shares without authentication.
{: .prompt-info }

> **Be careful** when using aggressive scanning techniques as they may trigger security alerts.
{: .prompt-warning }

## Exploitation Phase

```python
import socket
import struct

def create_payload():
    # Buffer overflow payload
    buffer = "A" * 146
    eip = struct.pack("<I", 0x625011af)  # JMP ESP
    nops = "\x90" * 16
    shellcode = "\xfc\x48\x83\xe4\xf0..."  # msfvenom payload
    
    return buffer + eip + nops + shellcode
```

> **Always test your exploits** in a controlled environment before using them in real assessments.
{: .prompt-danger }

```bash
# Execute the exploit
python exploit.py target_ip target_port
```

> **Exploitation successful!** Remember to document all steps taken for your penetration testing report.
{: .prompt-success }

## Conclusion

These styling features help make your blog posts more readable and informative. Use them to highlight important information and make your code examples stand out.

*Happy blogging and stay ethical!*