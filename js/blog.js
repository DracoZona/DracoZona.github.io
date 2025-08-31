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
const fallbackPosts =     [
        {
            "title": "Mass Assignment leading to Local File Read.",
            "slug": "mass-assignment-leading-to-local-file-read",
            "date": "2025-08-31",
            "category": "Web Attacks",
            "tags": [
                "Mass Assignment",
                "HackTheBox",
                "Web"
                
            ],
            "excerpt": "Mass assignment vulnerability that leads to Local File Read."
        },
        {
            "title": "Shared Folder Setup for VMWare",
            "slug": "shared-folder-setup-for-vmware",
            "date": "2025-08-28",
            "category": "My Notes",
            "tags": [
                "My Notes",
                "General"
            ],
            "excerpt": "Setting up a shared folder for my vmware setup. Made a post for future reference."
        },
        {
            "title": "DFIR Sherlock Challenge - Brutus",
            "slug": "dfir-sherlock-challenge-brutus",
            "date": "2025-04-03",
            "category": "DFIR",
            "tags": [
                "DFIR",
                "HTB",
                "Defensive Security"
            ],
            "excerpt": "Digital Forensics and Incident Response (DFIR) challenge from HTB Sherlocks."
        },
        {
            "title": "Active Directory Series - Machine 2",
            "slug": "active-directory-series-machine-2",
            "date": "2025-04-02",
            "category": "Active Directory",
            "tags": [
                "AD",
                "HTB",
                "Offensive Security"
            ],
            "excerpt": "EscapeTwo. Second machine in the Active Directory Exploitation track in HackTheBox. A little bit harder in my perspective, but it was fun."
        },
        {
            "title": "Active Directory Series - Machine 1",
            "slug": "active-directory-series-machine-1",
            "date": "2025-03-30",
            "category": "Active Directory",
            "tags": [
                "AD",
                "HTB",
                "Offensive Security"
            ],
            "excerpt": "First machine in the Active Directory Exploitation tracks in HackTheBox. This is a chill machine, but full of new learnings."
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