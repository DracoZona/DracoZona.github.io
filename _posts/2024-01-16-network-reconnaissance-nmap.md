---
title: "Network Reconnaissance with Nmap"
date: "2024-01-16"
category: "Network Security"
tags: ["reconnaissance", "tools"]
excerpt: "Master network reconnaissance using Nmap for penetration testing. Learn advanced scanning techniques, evasion methods, and target enumeration."
---

# Network Reconnaissance with Nmap

Network reconnaissance is the foundation of any penetration test. Nmap (Network Mapper) is the industry standard for network discovery and security auditing, offering powerful capabilities for ethical hackers.

## Basic Scanning Techniques

### Host Discovery
```bash
# Ping sweep
nmap -sn 192.168.1.0/24

# ARP scan (local network)
nmap -PR 192.168.1.0/24

# TCP SYN ping
nmap -PS22,80,443 192.168.1.0/24
```

### Port Scanning
```bash
# TCP SYN scan (stealth)
nmap -sS target.com

# TCP connect scan
nmap -sT target.com

# UDP scan
nmap -sU target.com

# Comprehensive scan
nmap -sS -sU -T4 -A -v target.com
```

## Advanced Techniques

### Service Detection
```bash
# Version detection
nmap -sV target.com

# Aggressive service detection
nmap -sV --version-intensity 9 target.com

# OS detection
nmap -O target.com
```

### NSE Scripts
Nmap Scripting Engine for advanced enumeration:

```bash
# Vulnerability scanning
nmap --script vuln target.com

# SMB enumeration
nmap --script smb-enum-* target.com

# HTTP enumeration
nmap --script http-enum target.com

# Custom script categories
nmap --script "auth or brute" target.com
```

## Evasion Techniques

### Timing and Performance
```bash
# Paranoid timing (very slow)
nmap -T0 target.com

# Aggressive timing (fast)
nmap -T4 target.com

# Custom timing
nmap --min-rate 1000 --max-rate 5000 target.com
```

### Firewall Evasion
```bash
# Fragment packets
nmap -f target.com

# Decoy scanning
nmap -D RND:10 target.com

# Source port spoofing
nmap --source-port 53 target.com

# Idle scan (zombie host)
nmap -sI zombie_host target.com
```

## Target Enumeration

### Web Applications
```bash
# HTTP methods
nmap --script http-methods target.com

# SSL/TLS information
nmap --script ssl-enum-ciphers -p 443 target.com

# Directory brute force
nmap --script http-brute-dirs target.com
```

### Database Services
```bash
# MySQL enumeration
nmap --script mysql-* -p 3306 target.com

# MSSQL enumeration
nmap --script ms-sql-* -p 1433 target.com

# MongoDB enumeration
nmap --script mongodb-* -p 27017 target.com
```

## Output and Reporting

### Output Formats
```bash
# All formats
nmap -oA scan_results target.com

# XML output
nmap -oX results.xml target.com

# Grepable output
nmap -oG results.gnmap target.com
```

### Advanced Output
```bash
# Verbose output
nmap -v target.com

# Debug output
nmap -d target.com

# Packet trace
nmap --packet-trace target.com
```

## Practical Examples

### Internal Network Assessment
```bash
# Comprehensive internal scan
nmap -sS -sU -T4 -A -PE -PP -PS80,443 -PA3389 -PU40125 -PY -g 53 --script "default or (discovery and safe)" 192.168.1.0/24
```

### External Penetration Test
```bash
# External reconnaissance
nmap -sS -T4 -p- --min-rate 1000 --max-retries 5 -v target.com
```

## Legal and Ethical Considerations

- Always obtain proper authorization
- Use appropriate timing to avoid DoS
- Respect rate limits and system resources
- Document all activities for reporting

## Conclusion

Nmap is an essential tool for network security professionals. Mastering its capabilities enables effective reconnaissance while maintaining stealth and avoiding detection. Remember to always use these techniques responsibly and within legal boundaries.