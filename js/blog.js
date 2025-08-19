// Blog data and functionality
let allPosts = [];
let filteredPosts = [];

// Initialize the blog
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    setupEventListeners();
});

// Load posts from JSON data
async function loadPosts() {
    try {
        const response = await fetch('_data/posts.json');
        allPosts = await response.json();
        
        // Sort posts by date (latest first)
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filteredPosts = [...allPosts];
        displayPosts(filteredPosts);
        populateFilters();
    } catch (error) {
        console.error('Error loading posts:', error);
        displayError();
    }
}

// Display posts in the container
function displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    
    if (posts.length === 0) {
        container.innerHTML = '<div class="no-posts">No posts found. Try adjusting your search or filters.</div>';
        return;
    }
    
    container.innerHTML = posts.map(post => `
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
            post.content.toLowerCase().includes(searchTerm) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    applyFilters();
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