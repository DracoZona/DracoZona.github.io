// Markdown Post Processor
let markdownData = null;

// Load and parse markdown file
function loadMarkdownFile() {
    const fileInput = document.getElementById('mdFile');
    const file = fileInput.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        parseMarkdown(content);
    };
    reader.readAsText(file);
}

// Parse markdown content and extract frontmatter
function parseMarkdown(content) {
    const lines = content.split('\n');
    let frontmatter = {};
    let contentStart = 0;
    
    // Check for frontmatter (YAML between ---)
    if (lines[0] === '---') {
        let frontmatterEnd = -1;
        for (let i = 1; i < lines.length; i++) {
            if (lines[i] === '---') {
                frontmatterEnd = i;
                break;
            }
        }
        
        if (frontmatterEnd > 0) {
            // Parse YAML frontmatter
            for (let i = 1; i < frontmatterEnd; i++) {
                const line = lines[i].trim();
                if (line && line.includes(':')) {
                    const [key, ...valueParts] = line.split(':');
                    let value = valueParts.join(':').trim();
                    
                    // Remove quotes if present
                    if ((value.startsWith('"') && value.endsWith('"')) || 
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    
                    // Handle arrays (tags)
                    if (value.startsWith('[') && value.endsWith(']')) {
                        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
                    }
                    
                    frontmatter[key.trim()] = value;
                }
            }
            contentStart = frontmatterEnd + 1;
        }
    }
    
    // Get markdown content
    const markdownContent = lines.slice(contentStart).join('\n').trim();
    
    // Generate slug from title or filename
    const title = frontmatter.title || document.getElementById('mdFile').files[0].name.replace('.md', '');
    const slug = generateSlug(title);
    
    markdownData = {
        title: title,
        slug: slug,
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        category: frontmatter.category || 'General',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : 
              (frontmatter.tags ? frontmatter.tags.split(',').map(t => t.trim()) : []),
        excerpt: frontmatter.excerpt || markdownContent.substring(0, 200) + '...',
        content: markdownContent
    };
    
    displayParsedData();
}

// Display parsed markdown data
function displayParsedData() {
    const container = document.getElementById('markdownContent');
    const parsedDiv = document.getElementById('parsedData');
    
    parsedDiv.innerHTML = `
        <div class="parsed-info">
            <h4>Title:</h4> <span>${markdownData.title}</span><br>
            <h4>Slug:</h4> <span>${markdownData.slug}</span><br>
            <h4>Date:</h4> <span>${markdownData.date}</span><br>
            <h4>Category:</h4> <span>${markdownData.category}</span><br>
            <h4>Tags:</h4> <span>${markdownData.tags.join(', ')}</span><br>
            <h4>Excerpt:</h4> <p>${markdownData.excerpt}</p>
        </div>
        <div class="content-preview">
            <h4>Content Preview:</h4>
            <div class="markdown-preview">${convertMarkdownToHtml(markdownData.content)}</div>
        </div>
    `;
    
    container.style.display = 'block';
}

// Process markdown and add to blog
async function processMarkdown() {
    if (!markdownData) {
        showMessage('Please select a markdown file first.', 'error');
        return;
    }
    
    try {
        // Load existing posts
        let existingPosts = [];
        try {
            const response = await fetch('_data/posts.json');
            existingPosts = await response.json();
        } catch (error) {
            console.log('No existing posts found, creating new array');
        }
        
        // Add new post
        existingPosts.unshift(markdownData);
        
        // Create updated posts.json
        const postJson = JSON.stringify(existingPosts, null, 2);
        
        // Create HTML file
        const postHtml = generatePostHtml(markdownData);
        
        // Show success with download links
        showMessage(`
            Post processed successfully!<br><br>
            <strong>Files generated:</strong><br>
            1. Updated posts.json<br>
            2. ${markdownData.slug}.html<br><br>
            <button onclick="downloadFiles('${markdownData.slug}', \`${postJson.replace(/`/g, '\\`')}\`, \`${postHtml.replace(/`/g, '\\`')}\`)" class="btn-primary">Download Files</button>
        `, 'success');
        
    } catch (error) {
        console.error('Error processing markdown:', error);
        showMessage('Error processing markdown file.', 'error');
    }
}

// Convert markdown to HTML
function convertMarkdownToHtml(markdown) {
    return markdown
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/g, '<div class="code-block"><pre><code>$1</code></pre></div>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

// Generate HTML file
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
            <h1 class="logo"><a href="../index.html">DZ_BLOG<span class="cursor">_</span></a></h1>
            <nav class="nav">
                <a href="../index.html">Home</a>
                <a href="#" onclick="history.back()">Back</a>
            </nav>
        </div>
    </header>

    <main class="main">
        <div class="container">
            <article class="post">
                <header class="post-header">
                    <div class="post-meta">
                        <span class="post-date">${formatDate(postData.date)}</span>
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
                        <a href="../index.html" class="nav-link">← Back to All Posts</a>
                    </div>
                </footer>
            </article>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 DZ Blog. Coded with <span class="heart">♥</span> in the terminal.</p>
        </div>
    </footer>
</body>
</html>`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Show message
function showMessage(message, type) {
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = message;
    
    const container = document.querySelector('.editor-container');
    container.appendChild(messageDiv);
    
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

// Download files
function downloadFiles(slug, jsonData, htmlData) {
    // Download posts.json
    const jsonBlob = new Blob([jsonData], { type: 'application/json' });
    const jsonUrl = URL.createObjectURL(jsonBlob);
    const jsonLink = document.createElement('a');
    jsonLink.href = jsonUrl;
    jsonLink.download = 'posts.json';
    jsonLink.click();
    
    // Download HTML file
    const htmlBlob = new Blob([htmlData], { type: 'text/html' });
    const htmlUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlUrl;
    htmlLink.download = `${slug}.html`;
    htmlLink.click();
    
    setTimeout(() => {
        URL.revokeObjectURL(jsonUrl);
        URL.revokeObjectURL(htmlUrl);
    }, 100);
}