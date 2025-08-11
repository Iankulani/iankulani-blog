document.addEventListener('DOMContentLoaded', function() {
    // Welcome Screen Transition
    const welcomeScreen = document.getElementById('welcome-screen');
    const blogContent = document.getElementById('blog-content');
    const enterBtn = document.getElementById('enter-btn');
    
    enterBtn.addEventListener('click', function() {
        welcomeScreen.style.opacity = '0';
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            blogContent.classList.remove('hidden');
        }, 500);
    });
    
    // Navigation
    const navLinks = document.querySelectorAll('.blog-nav a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hash) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Hide all sections
                sections.forEach(section => {
                    section.classList.remove('active-section');
                });
                
                // Show target section
                const targetSection = document.querySelector(this.hash);
                if (targetSection) {
                    targetSection.classList.add('active-section');
                }
            }
        });
    });
    
    // Modal for New Post
    const newPostBtn = document.getElementById('new-post-btn');
    const postModal = document.getElementById('post-modal');
    const closeBtn = document.querySelector('.close-btn');
    
    newPostBtn.addEventListener('click', function() {
        postModal.classList.remove('hidden');
    });
    
    closeBtn.addEventListener('click', function() {
        postModal.classList.add('hidden');
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === postModal) {
            postModal.classList.add('hidden');
        }
    });
    
    // Form Submission for New Post
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts-container');
    
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const imageInput = document.getElementById('post-image');
        const codeUrl = document.getElementById('post-code').value;
        const tags = document.getElementById('post-tags').value;
        
        // Create new post object
        const newPost = {
            id: Date.now(),
            title,
            content,
            tags: tags.split(',').map(tag => tag.trim()),
            date: new Date().toLocaleDateString(),
            image: null,
            codeUrl
        };
        
        // Handle image upload
        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                newPost.image = e.target.result;
                addPostToDOM(newPost);
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            addPostToDOM(newPost);
        }
        
        // Reset form and close modal
        postForm.reset();
        postModal.classList.add('hidden');
    });
    
    // Function to add post to DOM
    function addPostToDOM(post) {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.dataset.id = post.id;
        
        let imageHTML = '';
        if (post.image) {
            imageHTML = `<img src="${post.image}" alt="${post.title}" class="post-image">`;
        } else {
            // Default image if none provided
            imageHTML = `<div class="post-image" style="background-color: #e74c3c; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${post.title.charAt(0)}</div>`;
        }
        
        let codeHTML = '';
        if (post.codeUrl) {
            codeHTML = `
                <div class="github-embed">
                    <div class="github-embed-header">
                        <img src="assets/github-mark.png" alt="GitHub" class="github-logo">
                        <a href="${post.codeUrl}" target="_blank">View on GitHub</a>
                    </div>
                    <div class="github-embed-content">
                        <p>GitHub repository linked: ${post.codeUrl}</p>
                    </div>
                </div>
            `;
        }
        
        postCard.innerHTML = `
            ${imageHTML}
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.content.substring(0, 150)}...</p>
                ${codeHTML}
                <div class="post-meta">
                    <span class="post-date">${post.date}</span>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <button class="delete-post" data-id="${post.id}">Delete</button>
            </div>
        `;
        
        postsContainer.prepend(postCard);
        
        // Add event listener to delete button
        const deleteBtn = postCard.querySelector('.delete-post');
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this post?')) {
                postCard.remove();
            }
        });
    }
    
    // Sample initial posts
    const initialPosts = [
        {
            id: 1,
            title: "Introduction to Cybersecurity",
            content: "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.",
            tags: ["cybersecurity", "beginners"],
            date: "May 15, 2023",
            image: "assets/cybersecurity.jpg",
            codeUrl: "https://github.com/iancarterkulani/cybersecurity-basics"
        },
        {
            id: 2,
            title: "JavaScript Best Practices",
            content: "Writing clean, maintainable JavaScript code is essential for any web developer. Here are some best practices to follow: 1. Use strict mode, 2. Avoid global variables, 3. Use === instead of ==, 4. Use template literals for string concatenation, 5. Properly handle errors with try-catch blocks.",
            tags: ["javascript", "web development", "coding"],
            date: "June 2, 2023",
            image: "assets/javascript.jpg",
            codeUrl: "https://github.com/iancarterkulani/js-best-practices"
        },
        {
            id: 3,
            title: "Building Secure APIs",
            content: "When building APIs, security should be a top priority. Some key considerations include: authentication, authorization, input validation, rate limiting, and proper error handling. This post will walk you through implementing these security measures in your Node.js API.",
            tags: ["api", "security", "nodejs"],
            date: "June 20, 2023",
            image: "assets/api-security.jpg",
            codeUrl: "https://github.com/iancarterkulani/secure-api-example"
        }
    ];
    
    // Load initial posts
    initialPosts.forEach(post => {
        addPostToDOM(post);
    });
    
    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // In a real application, you would send this data to a server
        console.log('Contact form submitted:', { name, email, message });
        
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
    
    // Dynamic background for header based on time of day
    function updateHeaderBackground() {
        const hour = new Date().getHours();
        const header = document.querySelector('.blog-header');
        
        if (hour >= 6 && hour < 18) {
            // Daytime
            header.style.background = 'linear-gradient(135deg, #e74c3c, #f39c12)';
        } else {
            // Nighttime
            header.style.background = 'linear-gradient(135deg, #2c3e50, #34495e)';
        }
    }
    
    updateHeaderBackground();
    setInterval(updateHeaderBackground, 3600000); // Update every hour
});