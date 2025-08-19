// Blog data and functionality
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
const postsPerPage = 12;

// Initialize the blog
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    setupEventListeners();
});

// Fallback posts data
const fallbackPosts = [
    {
        "title": "DracoZona",
        "slug": "dracozona",
        "date": "2025-08-19",
        "category": "Your Category",
        "tags": ["test"],
        "excerpt": "Your excerpt here"
    },
    {
        "title": "Penetration Testing Methodology with Visual Guide",
        "slug": "penetration-testing-methodology-with-visual-guide",
        "date": "2024-01-22",
        "category": "Penetration Testing",
        "tags": ["pentesting", "cybersecurity"],
        "excerpt": "Complete penetration testing methodology guide with visual diagrams and practical examples for ethical hackers and security professionals."
    },
    {
        "title": "Advanced Buffer Overflow Exploitation",
        "slug": "advanced-buffer-overflow-exploitation",
        "date": "2024-01-20",
        "category": "Binary Exploitation",
        "tags": ["Binary Exploitation"],
        "excerpt": "Deep dive into advanced buffer overflow techniques including ROP chains, ASLR bypass, and modern exploitation methods."
    },
    {
        "title": "Advanced SQL Injection Techniques",
        "slug": "advanced-sql-injection-techniques",
        "date": "2024-01-18",
        "category": "Web Security",
        "tags": ["web-security"],
        "excerpt": "Explore advanced SQL injection techniques including blind SQLi, time-based attacks, and modern bypass methods for web application security testing."
    },
    {
        "title": "Windows Privilege Escalation Guide",
        "slug": "windows-privilege-escalation-guide",
        "date": "2024-01-15",
        "category": "Privilege Escalation",
        "tags": ["windows", "privesc"],
        "excerpt": "Complete guide to Windows privilege escalation techniques and tools for penetration testers."
    },
    {
        "title": "Linux Enumeration Techniques",
        "slug": "linux-enumeration-techniques",
        "date": "2024-01-12",
        "category": "Enumeration",
        "tags": ["linux", "enumeration"],
        "excerpt": "Essential Linux enumeration techniques for post-exploitation and privilege escalation."
    },
    {
        "title": "Web Application Fuzzing with Burp Suite",
        "slug": "web-application-fuzzing-burp-suite",
        "date": "2024-01-10",
        "category": "Web Security",
        "tags": ["burp-suite", "fuzzing"],
        "excerpt": "Learn how to effectively fuzz web applications using Burp Suite's Intruder module."
    },
    {
        "title": "Metasploit Framework Essentials",
        "slug": "metasploit-framework-essentials",
        "date": "2024-01-08",
        "category": "Exploitation",
        "tags": ["metasploit", "exploitation"],
        "excerpt": "Master the Metasploit Framework for penetration testing and exploit development."
    },
    {
        "title": "OSINT Gathering Techniques",
        "slug": "osint-gathering-techniques",
        "date": "2024-01-05",
        "category": "OSINT",
        "tags": ["osint", "reconnaissance"],
        "excerpt": "Open Source Intelligence gathering techniques for ethical hackers and security researchers."
    },
    {
        "title": "Docker Container Security",
        "slug": "docker-container-security",
        "date": "2024-01-03",
        "category": "Container Security",
        "tags": ["docker", "containers"],
        "excerpt": "Security best practices and common vulnerabilities in Docker containers."
    },
    {
        "title": "Wireless Network Penetration Testing",
        "slug": "wireless-network-penetration-testing",
        "date": "2024-01-01",
        "category": "Wireless Security",
        "tags": ["wifi", "wireless"],
        "excerpt": "Complete guide to wireless network security testing and WPA/WPA2 attacks."
    },
    {
        "title": "Social Engineering Attack Vectors",
        "slug": "social-engineering-attack-vectors",
        "date": "2023-12-28",
        "category": "Social Engineering",
        "tags": ["social-engineering", "phishing"],
        "excerpt": "Understanding and defending against social engineering attacks in cybersecurity."
    },
    {
        "title": "Cryptography Fundamentals for Hackers",
        "slug": "cryptography-fundamentals-hackers",
        "date": "2023-12-25",
        "category": "Cryptography",
        "tags": ["crypto", "encryption"],
        "excerpt": "Essential cryptography concepts every ethical hacker should understand."
    },
    {
        "title": "Mobile Application Security Testing",
        "slug": "mobile-application-security-testing",
        "date": "2023-12-22",
        "category": "Mobile Security",
        "tags": ["mobile", "android", "ios"],
        "excerpt": "Comprehensive guide to mobile application security testing for Android and iOS."
    },
    {
        "title": "Cloud Security Assessment",
        "slug": "cloud-security-assessment",
        "date": "2023-12-20",
        "category": "Cloud Security",
        "tags": ["cloud", "aws", "azure"],
        "excerpt": "Security assessment techniques for cloud infrastructure and services."
    }
];

// Load posts from JSON data
async function loadPosts() {
    try {
        const response = await fetch('_data/posts.json');
        allPosts = await response.json();
    } catch (error) {
        console.error('Error loading posts.json, using fallback data:', error);
        allPosts = fallbackPosts;
    }
    
    // Sort posts by date (latest first)
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    filteredPosts = [...allPosts];
    displayPosts(filteredPosts);
    populateFilters();
}

// Display posts in the container with pagination
function displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="no-posts">No posts found. Try adjusting your search or filters.</div>';
        return;
    }
    
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = posts.slice(startIndex, endIndex);
    
    container.innerHTML = paginatedPosts.map(post => `
        <article class="post-card">
            <div class="post-meta">
                <span class="post-date">${formatDate(post.date)}</span>
                <span class="post-category">${post.category}</span>
            </div>
            <h2 class="post-title">
                <a href="posts/${post.slug}.html">${post.title}</a>
            </h2>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-tags">
                ${post.tags.map(tag => `<a href="#" class="tag" onclick="filterByTag('${tag}')">${tag}</a>`).join('')}
            </div>
            <a href="posts/${post.slug}.html" class="read-more">READ MORE >></a>
        </article>
    `).join('');
    
    displayPagination(posts.length);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Populate sidebar with categories and tags
function populateFilters() {
    const categories = [...new Set(allPosts.map(post => post.category))];
    const tags = [...new Set(allPosts.flatMap(post => post.tags))];
    
    // Populate categories sidebar
    const categoriesList = document.getElementById('categoriesList');
    categoriesList.innerHTML = categories.map(category => {
        const count = allPosts.filter(post => post.category === category).length;
        return `
            <div class="category-item" onclick="filterByCategory('${category}')">
                <span class="category-name">${category}</span>
                <span class="category-count">${count}</span>
            </div>
        `;
    }).join('');
    
    // Populate tags sidebar
    const tagsList = document.getElementById('tagsList');
    const tagCounts = {};
    allPosts.forEach(post => {
        post.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    
    tagsList.innerHTML = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([tag, count]) => `
            <div class="tag-item" onclick="filterByTag('${tag}')">
                <span class="tag-name">${tag}</span>
                <span class="tag-count">${count}</span>
            </div>
        `).join('');
}

// Search functionality
function searchPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        filteredPosts = [...allPosts];
    } else {
        filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm) ||
            (post.content && post.content.toLowerCase().includes(searchTerm)) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    currentPage = 1;
    displayPosts(filteredPosts);
}

// Display pagination
function displayPagination(totalPosts) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const container = document.getElementById('postsContainer');
    
    // Remove existing pagination
    const existingPagination = document.querySelector('.pagination');
    if (existingPagination) {
        existingPagination.remove();
    }
    
    if (totalPages <= 1) return;
    
    const paginationHtml = `
        <div class="pagination">
            ${currentPage > 1 ? `<button onclick="changePage(${currentPage - 1})" class="page-btn">← Previous</button>` : ''}
            ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => 
                `<button onclick="changePage(${page})" class="page-btn ${page === currentPage ? 'active' : ''}">${page}</button>`
            ).join('')}
            ${currentPage < totalPages ? `<button onclick="changePage(${currentPage + 1})" class="page-btn">Next →</button>` : ''}
        </div>
    `;
    
    container.insertAdjacentHTML('afterend', paginationHtml);
}

// Change page
function changePage(page) {
    currentPage = page;
    displayPosts(filteredPosts);
}

// Filter by category from sidebar
function filterByCategory(category) {
    filteredPosts = allPosts.filter(post => post.category === category);
    displayPosts(filteredPosts);
}

// Filter by tag from sidebar  
function filterByTag(tag) {
    filteredPosts = allPosts.filter(post => post.tags.includes(tag));
    displayPosts(filteredPosts);
}

// Clear all filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    filteredPosts = [...allPosts];
    displayPosts(filteredPosts);
}

// Navigation functions
function showAll() {
    clearFilters();
}

function showCategories() {
    // Group posts by category
    const categories = {};
    allPosts.forEach(post => {
        if (!categories[post.category]) {
            categories[post.category] = [];
        }
        categories[post.category].push(post);
    });
    
    displayCategoryView(categories);
}

function showTags() {
    // Group posts by tags
    const tags = {};
    allPosts.forEach(post => {
        post.tags.forEach(tag => {
            if (!tags[tag]) {
                tags[tag] = [];
            }
            tags[tag].push(post);
        });
    });
    
    displayTagView(tags);
}

// Display category view
function displayCategoryView(categories) {
    const container = document.getElementById('postsContainer');
    container.innerHTML = Object.entries(categories).map(([category, posts]) => `
        <div class="category-section">
            <h2 class="category-title">${category} (${posts.length})</h2>
            <div class="category-posts">
                ${posts.map(post => `
                    <div class="category-post">
                        <a href="posts/${post.slug}.html">${post.title}</a>
                        <span class="post-date">${formatDate(post.date)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Display tag view
function displayTagView(tags) {
    const container = document.getElementById('postsContainer');
    container.innerHTML = Object.entries(tags).map(([tag, posts]) => `
        <div class="tag-section">
            <h2 class="tag-title">#${tag} (${posts.length})</h2>
            <div class="tag-posts">
                ${posts.map(post => `
                    <div class="tag-post">
                        <a href="posts/${post.slug}.html">${post.title}</a>
                        <span class="post-date">${formatDate(post.date)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchPosts();
        }
    });
    
    // Real-time search (optional - uncomment if desired)
    // searchInput.addEventListener('input', searchPosts);
}

// Display error message
function displayError() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = `
        <div class="error-message">
            <h2>Error Loading Posts</h2>
            <p>Unable to load blog posts. Please check if the posts.json file exists.</p>
        </div>
    `;
}