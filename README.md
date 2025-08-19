# DZ Blog - Hacker's Den

A static blog generator with hackerish theme featuring violet/purple, pink, and black color scheme.

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

3. Commit and push to GitHub
4. GitHub Actions will automatically build and deploy

## Local Development

```bash
# Build the blog locally
npm run build

# This generates:
# - HTML files in posts/
# - Updated posts.json in _data/
```

## Deployment

The blog auto-deploys to GitHub Pages when you push to the main branch. Enable GitHub Pages in your repository settings.

## Customization

Edit CSS variables in `css/style.css`:
- `--primary-purple`: #8b5cf6
- `--pink`: #ec4899
- `--dark-bg`: #0f0f0f