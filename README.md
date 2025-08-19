# DZ Blogger Profile- Hacker's Den

A static blog generator with hackerish theme featuring violet/purple, pink, and black color scheme created by DracoZona. I created this to automate my blogs written using markdown language. I like the idea of jekyll blogs as I have used it before, so it's the same mechanism.

## Features

- **Markdown Posts**: Write posts in Markdown with frontmatter
- **Auto-Build**: GitHub Actions automatically builds on push
- **Responsive Design**: Mobile-friendly layout
- **Search & Filter**: Real-time search and category/tag filtering
- **Hackerish Theme**: Terminal-inspired design

## File Structure

```
dz_blog_new/
├── index.html              # Main homepage
├── build.js               # Build script
├── package.json           # Node.js config
├── _posts/                # Markdown posts folder
│   └── *.md              # Your markdown posts
├── posts/                 # Generated HTML posts
├── _data/
│   └── posts.json        # Generated posts data
├── css/                  # Stylesheets
├── js/                   # JavaScript files
└── .github/workflows/    # GitHub Actions
```

## Adding New Posts

1. Create a new `.md` file in `_posts/` folder
2. Use this frontmatter format:

```markdown
---
title: "Your Post Title"
date: "2024-01-20"
category: "Web Security"
tags: ["hacking", "security", "tutorial"]
excerpt: "Brief description of your post..."
---

# Your Content Here

Write your post content in **Markdown**.
```

3. Build locally: `node build.js`
4. Commit and push all files to GitHub
5. GitHub Pages will automatically deploy the static files

## Local Development

```bash
# Build the blog locally
node build.js

# This generates:
# - HTML files in posts/
# - Updated posts.json in _data/
```

## Deployment Workflow

1. **Write posts** in `_posts/` folder
2. **Build locally**: `node build.js`
3. **Commit all files**: `git add . && git commit -m "Add new post"`
4. **Push to GitHub**: `git push origin main`
5. **Auto-deploy**: GitHub Pages deploys the static files

## GitHub Pages Setup

1. Go to repository **Settings** → **Pages**
2. **Source**: Deploy from a branch → **GitHub Actions**
3. The workflow will automatically deploy on push

## Customization

Edit CSS variables in `css/style.css`:
- `--primary-purple`: #8b5cf6
- `--pink`: #ec4899
- `--dark-bg`: #0f0f0f