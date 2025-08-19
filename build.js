const fs = require('fs');
const path = require('path');

// Markdown to HTML converter
function convertMarkdownToHtml(markdown) {
    let html = markdown;
    
    // Handle prompt boxes first
    html = html.replace(/> \*\*([^\*]+)\*\* ([^\n]+)\n\{: \.prompt-(info|warning|danger|success|tip) \}/g, '<div class="prompt-$3"><strong>$1</strong> $2</div>');
    
    // Handle code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<div class="code-block"><pre><code>$1</code></pre></div>');
    
    // Handle images
    html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="../images/$2" alt="$1" class="post-image">');
    
    // Handle headers
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Handle tables
    html = html.replace(/(\|[^\n]+\|\n)(\|[-:| ]+\|\n)((\|[^\n]+\|\n?)+)/g, function(match, header, separator, body) {
        const headerCells = header.trim().split('|').slice(1, -1).map(cell => `<th>${cell.trim()}</th>`).join('');
        const bodyRows = body.trim().split('\n').map(row => {
            const cells = row.split('|').slice(1, -1).map(cell => `<td>${cell.trim()}</td>`).join('');
            return `<tr>${cells}</tr>`;
        }).join('');
        return `<table class="markdown-table"><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    });
    
    // Handle text formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Handle paragraphs and line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    html = html.replace(/^/, '<p>');
    html = html.replace(/$/, '</p>');
    
    return html;
}

// Parse frontmatter
function parseFrontmatter(content) {
    // Normalize line endings (handle both \r\n and \n)
    const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedContent.split('\n');
    let frontmatter = {};
    let contentStart = 0;
    
    if (lines[0] === '---') {
        let frontmatterEnd = -1;
        for (let i = 1; i < lines.length; i++) {
            if (lines[i] === '---') {
                frontmatterEnd = i;
                break;
            }
        }
        
        if (frontmatterEnd > 0) {
            for (let i = 1; i < frontmatterEnd; i++) {
                const line = lines[i].trim();
                if (line && line.includes(':')) {
                    const [key, ...valueParts] = line.split(':');
                    let value = valueParts.join(':').trim();
                    
                    if ((value.startsWith('"') && value.endsWith('"')) || 
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    
                    if (value.startsWith('[') && value.endsWith(']')) {
                        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
                    }
                    
                    frontmatter[key.trim()] = value;
                }
            }
            contentStart = frontmatterEnd + 1;
        }
    }
    
    return {
        frontmatter,
        content: lines.slice(contentStart).join('\n').trim()
    };
}

// Generate slug
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

// Generate HTML post
function generatePostHtml(postData) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${postData.title} - DZ Blog</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/post.css">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1 class="logo"><a href="../index.html"><span class="logo-draco">Draco</span><span class="logo-zona">Zona</span><span class="cursor">_</span></a></h1>
            <nav class="nav">
                <a href="../index.html">Blog</a>
                <a href="../about.html">About</a>
                <a href="../cv.html">CV</a>
                <a href="../certifications.html">Certifications</a>
                <a href="../contact.html">Contact</a>
            </nav>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <article class="post">
                <div class="back-to-blog">
                    <a href="../index.html" class="back-btn">← Back to Blog</a>
                </div>
                
                <header class="post-header">
                    <div class="post-meta">
                        <span class="post-date">${new Date(postData.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                        <span class="post-category">${postData.category}</span>
                    </div>
                    <h1 class="post-title">${postData.title}</h1>
                    <div class="post-tags">
                        ${postData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </header>

                <div class="post-content">
                    ${convertMarkdownToHtml(postData.content)}
                </div>

                <footer class="post-footer">
                    <div class="post-navigation">
                        <a href="../index.html" class="nav-link">← Back to Blog</a>
                    </div>
                </footer>
            </article>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>Tender Juicy Hatdog <span class="heart">🌭</span> Hacking is not a crime.</p>
        </div>
    </footer>

    <canvas id="matrixCanvas"></canvas>
    <script src="../js/matrix.js"></script>
</body>
</html>`;
}

// Build blog
function buildBlog() {
    const postsDir = '_posts';
    const outputDir = 'posts';
    const dataDir = '_data';
    
    if (!fs.existsSync(postsDir)) {
        console.error('_posts directory not found');
        return;
    }
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    
    const posts = [];
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    
    files.forEach(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const { frontmatter, content: markdownContent } = parseFrontmatter(content);
        
        const slug = generateSlug(frontmatter.title || file.replace('.md', ''));
        
        const postData = {
            title: frontmatter.title || file.replace('.md', ''),
            slug: slug,
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            category: frontmatter.category || 'General',
            tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : 
                  (frontmatter.tags ? frontmatter.tags.split(',').map(t => t.trim()) : []),
            excerpt: frontmatter.excerpt || markdownContent.substring(0, 200) + '...',
            content: markdownContent
        };
        
        posts.push(postData);
        
        // Generate HTML file
        const htmlContent = generatePostHtml(postData);
        fs.writeFileSync(path.join(outputDir, `${slug}.html`), htmlContent);
        
        console.log(`Generated: ${slug}.html`);
    });
    
    // Sort posts by date (latest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Write posts.json
    fs.writeFileSync(path.join(dataDir, 'posts.json'), JSON.stringify(posts, null, 2));
    
    console.log(`Built ${posts.length} posts successfully!`);
}

buildBlog();