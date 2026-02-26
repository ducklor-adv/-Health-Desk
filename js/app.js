/**
 * Health Desk - Main JavaScript
 * Handles interactions and animations
 */

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active nav link
                updateActiveNavLink(this);
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        anchorLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Animation on scroll for feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => observer.observe(card));

    // Observe workflow steps
    const workflowSteps = document.querySelectorAll('.workflow-step');
    workflowSteps.forEach(step => observer.observe(step));

    // Animate stat numbers
    const statValues = document.querySelectorAll('.stat-value');

    const animateValue = (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = formatNumber(end);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return num.toLocaleString('th-TH');
        }
        return num.toString();
    };

    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent.replace(/,/g, '').replace('%', '');
                const endValue = parseFloat(text);

                if (!isNaN(endValue)) {
                    animateValue(target, 0, endValue, 1000);
                }

                statObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(stat => {
        // Skip if it's not a number
        const text = stat.textContent.replace(/,/g, '').replace('%', '');
        if (!isNaN(parseFloat(text))) {
            statObserver.observe(stat);
        }
    });

    // Animate BMI bars
    const bmiBars = document.querySelectorAll('.bar-fill');

    const barObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;

                bar.style.width = '0%';

                setTimeout(() => {
                    bar.style.transition = 'width 1s ease';
                    bar.style.width = width;
                }, 100);

                barObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    bmiBars.forEach(bar => barObserver.observe(bar));

    // Mock chart animation
    const mockCharts = document.querySelectorAll('.mock-chart');

    mockCharts.forEach(chart => {
        chart.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });

        chart.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Print functionality
    const printButtons = document.querySelectorAll('[onclick*="print"]');

    printButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
    });

    // Mobile menu toggle (if needed in future)
    const createMobileMenu = () => {
        const navbar = document.querySelector('.navbar');
        const navMenu = document.querySelector('.nav-menu');

        if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '☰';
            toggle.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                display: none;
                color: var(--gray-700);
            `;

            navbar.querySelector('.container').insertBefore(toggle, navMenu);

            toggle.addEventListener('click', () => {
                navMenu.classList.toggle('mobile-open');
            });
        }
    };

    // Initialize
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Dev report specific features
    if (document.querySelector('.dev-report-page')) {
        // Highlight code blocks on hover
        const codeBlocks = document.querySelectorAll('.code-block');

        codeBlocks.forEach(block => {
            block.addEventListener('mouseenter', function() {
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                this.style.transition = 'box-shadow 0.3s ease';
            });

            block.addEventListener('mouseleave', function() {
                this.style.boxShadow = 'none';
            });
        });

        // Copy code functionality
        codeBlocks.forEach(block => {
            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋 Copy';
            copyBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 5px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.875rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

            block.style.position = 'relative';
            block.appendChild(copyBtn);

            block.addEventListener('mouseenter', () => {
                copyBtn.style.opacity = '1';
            });

            block.addEventListener('mouseleave', () => {
                copyBtn.style.opacity = '0';
            });

            copyBtn.addEventListener('click', async () => {
                const code = block.querySelector('code').textContent;

                try {
                    await navigator.clipboard.writeText(code);
                    copyBtn.textContent = '✅ Copied!';

                    setTimeout(() => {
                        copyBtn.textContent = '📋 Copy';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                    copyBtn.textContent = '❌ Failed';

                    setTimeout(() => {
                        copyBtn.textContent = '📋 Copy';
                    }, 2000);
                }
            });
        });

        // Progress bar for timeline
        const timelineItems = document.querySelectorAll('.timeline-item');
        let completedCount = 0;

        timelineItems.forEach(item => {
            if (item.querySelector('.timeline-marker.completed')) {
                completedCount++;
            }
        });

        const progress = (completedCount / timelineItems.length) * 100;
        console.log(`Project progress: ${progress.toFixed(1)}%`);
    }

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            document.body.style.animation = 'rainbow 2s linear infinite';

            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);

            setTimeout(() => {
                document.body.style.animation = '';
                style.remove();
            }, 5000);
        }
    });
});

// Helper function to update active nav link
function updateActiveNavLink(clickedLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
}

// Service Worker registration for PWA (future enhancement)
if ('serviceWorker' in navigator) {
    // Uncomment when service worker is ready
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered', reg))
    //     .catch(err => console.log('Service Worker registration failed', err));
}

// Export for use in other modules
window.HealthDesk = {
    version: '1.0.0',
    initialized: true
};

console.log('%c Health Desk v1.0.0 ', 'background: #4F46E5; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
console.log('%c System initialized successfully ', 'background: #10B981; color: white; padding: 5px 10px; border-radius: 3px;');
