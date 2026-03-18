document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Blur on Scroll ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('.nav-links a, .btn').forEach(anchor => {
        if (!anchor.hasAttribute('target') && anchor.getAttribute('href').startsWith('#')) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.remove('is-active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Intersection Observer for Scroll Fade-Ins (Reveal) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Subtle Vanilla 3D Tilt Effect on Hover ---
    const tiltElements = document.querySelectorAll('.tilt-3d');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                // Get element coordinates and size
                const rect = el.getBoundingClientRect();
                const objH = rect.height;
                const objW = rect.width;

                // Mouse position relative to center of element
                const x = e.clientX - rect.left - (objW / 2);
                const y = e.clientY - rect.top - (objH / 2);

                el.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) translateY(-5px)`;
                el.style.boxShadow = `${-x / 10}px ${-y / 10}px 30px rgba(56, 189, 248, 0.2)`;
            });
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');

    if (cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        function animateFollower() {
            // Smoothly ease the follower towards the actual cursor position
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;

            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;

            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Add hover effects when mouse enters clickable elements
        const interactables = document.querySelectorAll('a, button, .event-card, .menu-item, input, .gallery-btn, .rules-btn');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                follower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                follower.classList.remove('hover');
            });
        });
        
        // Overrides applied via JS loop manually for cross-browser
        // Disable default cursor gracefully based on elements found
        document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
            el.style.cursor = 'none';
        });
    }

    // --- Countdown Timer Logic ---
    const countdown = () => {
        // Target date: April 10, 2026, 09:00:00 AM
        const countDate = new Date('April 10, 2026 09:00:00').getTime();
        const now = new Date().getTime();
        const gap = countDate - now;

        const dEl = document.getElementById('days');
        if (!dEl) return; // Only process on pages that contain the countdown element

        if (gap < 0) {
            dEl.innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const textDay = Math.floor(gap / day);
        const textHour = Math.floor((gap % day) / hour);
        const textMinute = Math.floor((gap % hour) / minute);
        const textSecond = Math.floor((gap % minute) / second);

        dEl.innerText = textDay < 10 ? '0' + textDay : textDay;
        document.getElementById('hours').innerText = textHour < 10 ? '0' + textHour : textHour;
        document.getElementById('minutes').innerText = textMinute < 10 ? '0' + textMinute : textMinute;
        document.getElementById('seconds').innerText = textSecond < 10 ? '0' + textSecond : textSecond;
    };

    setInterval(countdown, 1000);
    countdown(); // initial call




    // --- Gallery Logic ---
    const galleryBtns = document.querySelectorAll('.gallery-btn');
    const galleryTracks = document.querySelectorAll('.gallery-track');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const scrollBar = document.getElementById('scroll-bar');

    const updateProgressBar = (track) => {
        if (!track || !scrollBar) return;
        const maxScroll = track.scrollWidth / 2;
        const scrollPercentage = (track.scrollLeft / maxScroll) * 100;
        scrollBar.style.width = `${scrollPercentage}%`;
    };

    galleryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const year = btn.getAttribute('data-year');
            galleryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            galleryTracks.forEach(track => {
                track.classList.remove('active');
                if (track.id === `gallery-${year}`) {
                    setTimeout(() => {
                        track.classList.add('active');
                        updateProgressBar(track);
                    }, 50);
                }
            });
        });
    });

    const getActiveTrack = () => document.querySelector('.gallery-track.active');

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const track = getActiveTrack();
            if (track) {
                track.scrollBy({ left: 400, behavior: 'smooth' });
            }
        });

        prevBtn.addEventListener('click', () => {
            const track = getActiveTrack();
            if (track) {
                track.scrollBy({ left: -400, behavior: 'smooth' });
            }
        });
    }

    // --- Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');

    const openLightbox = (item) => {
        const img = item.querySelector('img');

        lightbox.style.display = 'flex';
        lightbox.style.opacity = '0';
        setTimeout(() => lightbox.style.opacity = '1', 10);

        lightboxImg.src = img.src;

        lightboxCaption.innerHTML = '';

        driftState.active = false;
    };

    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.display = 'none';
            driftState.active = true;
        }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // --- Buttery Smooth Gallery Drift & Drag ---
    const driftState = {
        active: true,
        speed: 0.8,
        requestId: null
    };

    galleryTracks.forEach(track => {
        // Clone items for seamless infinite scroll
        const items = Array.from(track.children);
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        // Event delegation for lightbox clicks
        track.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (item) openLightbox(item);
        });

        let isDown = false;
        let startX;
        let scrollLeft;
        let isDragging = false; // Prevent click if dragging

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            isDragging = false;
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
            driftState.active = false;
        });
        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.cursor = 'pointer';
            driftState.active = true;
        });
        track.addEventListener('mouseup', (e) => {
            isDown = false;
            track.style.cursor = 'pointer';
            driftState.active = true;
        });
        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            if (Math.abs(x - startX) > 5) {
                isDragging = true;
            }
            const walk = (x - startX) * 1.5;
            track.scrollLeft = scrollLeft - walk;
        });

        track.addEventListener('scroll', () => {
            updateProgressBar(track);
            // Infinite seamless boundary jump
            if (track.scrollLeft >= track.scrollWidth / 2) {
                track.scrollLeft = 0;
            } else if (track.scrollLeft <= 0) {
                track.scrollLeft = track.scrollWidth / 2;
            }
        });

        // Prevent click events if dragged
        track.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    });

    const drift = () => {
        if (driftState.active) {
            galleryTracks.forEach(track => {
                if (track.classList.contains('active') && !track.matches(':hover')) {
                    track.scrollLeft += driftState.speed;
                }
            });
        }
        driftState.requestId = requestAnimationFrame(drift);
    };

    driftState.requestId = requestAnimationFrame(drift);

    const pauseDrift = () => driftState.active = false;
    const resumeDrift = () => driftState.active = true;

    if (prevBtn && nextBtn) {
        [prevBtn, nextBtn].forEach(btn => {
            btn.addEventListener('mouseenter', pauseDrift);
            btn.addEventListener('mouseleave', resumeDrift);
        });
    }

    // Handle Keyboard Esc for Lightbox
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'block') closeLightbox();
    });


    // --- Gallery Particles ---
    const canvas = document.getElementById('gallery-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
                ctx.fill();
            }
        }

        const init = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        init();
        animate();
    }

});
