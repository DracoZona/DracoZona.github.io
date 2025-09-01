---
title: "Mass Assignment leading to Local File Read"
date: "2025-08-31"
category: "Web Attacks"
tags: ["Mass Assignment", "Web", "HackTheBox"]
excerpt: "Mass assignment vulnerability that leads to Local File Read."
---

# Introduction
This blog focuses on the Mass Assignment vulnerability which leads to a Local File Read where the contents of the /etc/passwd were displayed. This is just a hackthebox machine called `BackendTwo`.

# Enumeration
Of course, a typical approach (CTF style) to things like this... first I have fired up nmap:

![Desktop View](/backendtwo/1.png)

So we got only 2 ports opened. Since it has port 80, I checked it using my browser.
![Desktop View](/backendtwo/2.png)
Seems interesting. I used gobuster to further enumerate any possible endpoints.
![Desktop View](/backendtwo/3.png)
Found two endpoints: `/docs` and `/api`, but I can't access `/docs` since I need to be authenticated and I don't have any credentials. 
![Desktop View](/backendtwo/4.png)
So I checked `/api` instead and found `/v1`
![Desktop View](/backendtwo/5.png)
then I went further and found `/user` and `/admin`. 
![Desktop View](/backendtwo/6.png)
I checked the `/admin` endpoint. Maybe I am lucky or whatever. But no I was not, the admin endpoint needs to be authenticated. (as expected!)
![Desktop View](/backendtwo/7.png)
So I checked the `/user` endpoint instead. Hmmmm, that seems odd. "Not found".
![Desktop View](/backendtwo/8.png)
I tried putting some random username, in this case, `administrator`. I wanna shoot my luck in the air. Then I got this message.
![Desktop View](/backendtwo/9.png)
It seems that it is accepting an integer value. So I tried putting an integer.
![Desktop View](/backendtwo/10.png)
Now that's juicy and licious ~juicylicious. 
![Desktop View](/backendtwo/11.png)
I was curious how many users are there, so I tried shooting a random number ~ 1000, then it returned null. So maybe there's only few hundreds or even less than a hundred users in the system. So I used intruder.
![Desktop View](/backendtwo/12.png)
As expected, only few users are there. There are 11.
![Desktop View](/backendtwo/13.png)
> I used grep-match to check for `guid` so I could sort the results faster since all results will show status code 200. Hence I needed something to use to determine which is which.
{: .prompt-info }

I checked out the last user that has a userid of 11.
![Desktop View](/backendtwo/14.png)

Well I couldn't do anything much with these since I really do need to login and I don't have any credentials. I fuzzed for further endpoints and I got something:
![Desktop View](/backendtwo/15.png)

Of course I couldn't go to login since I don't have any credentials, so luckily there is a `/signup` endpoint. I tried looking into it.
![Desktop View](/backendtwo/16.png)
Well, I don't know the parameters that must be used so I put the following to check:

```
{
    "key":"value"
}

```

![Desktop View](/backendtwo/17.png)
So `email` and `password` are needed to signup. There we go, I was able to create a user.
![Desktop View](/backendtwo/18.png)

Now, it's time to login.
![Desktop View](/backendtwo/19.png)
Hmmm. I got an error. At first I wasn't really sure, then I changed the format.
![Desktop View](/backendtwo/20.png)
Well, still the same. I added a `Content-Type` header and we got some access token.
![Desktop View](/backendtwo/21.png)

I tried to access `/docs` endpoint without the access token and as expected, it said not authenticated.
![Desktop View](/backendtwo/22.png)

Then I included the access token in the `Authorization` header, it went through.
![Desktop View](/backendtwo/23.png)

> At this point I needed to use the access token as I navigate to the page. Hence, I used a browser extension called `Simple Modify Headers`.
{: .prompt-info }

![Desktop View](/backendtwo/24.png)

I can now navigate without putting the access token in every request.
![Desktop View](/backendtwo/25.png)

Upon looking around and tampering some things, the endpoint `/api/v1/user/{user_id}/edit`  looks `tender juicy` 🌭. 
![Desktop View](/backendtwo/26.png)

I checked the account that I created which probably has the user_id 12 to check the information on it. So since according to the documentation, only the `profile` can be edited, but what if we can alter as well even the email? Let's try.
![Desktop View](/backendtwo/27.png)

So instead of only putting the profile parameter, I included the email and a value not identical to the registered email. Upon sending the request, it displayed `result: true`. So probably that went through or something.
![Desktop View](/backendtwo/28.png)

And it was altered. The email was altered instead of just the profile parameter. 
![Desktop View](/backendtwo/29.png)

> This vulnerability is called `Mass Assignment`. This allows the attacker to modify the HTTP request to add new parameters which could create or replace variables in the application code which is originally not intended.
{: .prompt-info }

At this point, upon knowing the vulnerability, remember that there is a parameter called `is_superuser`. This is probably relating to admin privileges. So I sent another request modifying the variable into `true`. 
![Desktop View](/backendtwo/30.png)

I checked the account that I created and now it's an admin!
![Desktop View](/backendtwo/31.png)

Since I already have admin privileges, I went to check the admin endpoints if there are anything `tender juicy`🌭. Then I found this one.
![Desktop View](/backendtwo/32.png)

So I was thinking maybe we could read files from the server with this. So according to the documentation, the value should be in base64_url. So typical CTF things, I encoded `/etc/passwd` using base64. 
![Desktop View](/backendtwo/33.png)

That's weird. I got permission error, but I am already an admin. That should have worked. But then I remember my access token is not yet admin. So I needed a new access token for this to work.
![Desktop View](/backendtwo/34.png)

After generating a new access token, the contents of the `/etc/passwd` was displayed. Sweet!🌭
![Desktop View](/backendtwo/35.png)