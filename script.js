/**
 * Duke Coffee - Master JavaScript (Vanilla JS)
 * Enhanced for silky-smooth micro-interactions, spring physics, and fluid scroll reveals
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar with Smooth Blur Transition
    const header = document.querySelector('.site-header');
    if (header) {
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScrollY = window.scrollY;
        }, { passive: true });
    }

    // 2. Mobile Hamburger Drawer with Smooth Slide
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = hamburgerBtn.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = hamburgerBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 3. Smooth Anchor Scrolling with Navbar Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 80;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: elementPosition - headerHeight - 15,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 4. Fluid Scroll Reveal System (IntersectionObserver)
    const initScrollReveals = () => {
        // Auto-tag sections, cards, and titles for reveal if not already tagged
        document.querySelectorAll('.section-title-wrap').forEach(el => el.classList.add('reveal-on-scroll'));
        document.querySelectorAll('.hero-visual').forEach(el => el.classList.add('reveal-on-scroll', 'reveal-scale'));
        document.querySelectorAll('.hero-text').forEach(el => el.classList.add('reveal-on-scroll', 'reveal-left'));
        document.querySelectorAll('.category-tabs').forEach(el => el.classList.add('reveal-on-scroll'));

        // Stagger product cards in grid
        document.querySelectorAll('.products-grid').forEach(grid => {
            const cards = grid.querySelectorAll('.product-card');
            cards.forEach((card, index) => {
                card.classList.add('reveal-on-scroll');
                const delayIndex = (index % 4) + 1;
                card.classList.add(`delay-${delayIndex}`);
            });
        });

        // Stagger stat cards
        document.querySelectorAll('.stat-card').forEach((card, index) => {
            card.classList.add('reveal-on-scroll');
            const delayIndex = (index % 4) + 1;
            card.classList.add(`delay-${delayIndex}`);
        });

        const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-scale');

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            });

            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            // Fallback for older browsers
            revealElements.forEach(el => el.classList.add('revealed'));
        }
    };

    initScrollReveals();

    // 5. Image Slip Preview
    const slipInput = document.getElementById('slipInput');
    const slipPreview = document.getElementById('slipPreview');
    const slipPreviewBox = document.getElementById('slipPreviewBox');

    if (slipInput && slipPreview) {
        slipInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    slipPreview.src = e.target.result;
                    if (slipPreviewBox) {
                        slipPreviewBox.style.display = 'block';
                        slipPreviewBox.classList.add('reveal-on-scroll', 'revealed');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 6. Fluid Toast Notification System (Spring Physics + Progress Bar)
    window.showToast = function (message, type = 'success') {
        let toastContainer = document.getElementById('duke-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'duke-toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast-item toast-${type}`;

        const icon = type === 'success' 
            ? '<i class="fas fa-check-circle" style="color: #C8A96B; font-size: 20px;"></i>' 
            : '<i class="fas fa-exclamation-circle" style="color: #dc3545; font-size: 20px;"></i>';

        toast.innerHTML = `
            ${icon}
            <span style="flex: 1;">${message}</span>
            <div class="toast-progress"></div>
        `;

        toastContainer.appendChild(toast);

        // Fluid spring slide-in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add('show');
            });
        });

        // Auto Smooth Removal after progress finishes
        setTimeout(() => {
            toast.classList.remove('show');
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    };

    // 7. Add to Cart via AJAX handler with Spring Badge Pop Animation
    document.querySelectorAll('.ajax-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const sweetLevel = this.getAttribute('data-sweet') || 'หวานปกติ (100%)';
            const typeOption = this.getAttribute('data-type') || 'เย็น (Iced)';
            const qty = this.getAttribute('data-qty') || 1;

            // Micro-interaction bounce on button
            this.style.transform = 'scale(0.88)';
            setTimeout(() => {
                this.style.transform = '';
            }, 180);

            const formData = new FormData();
            formData.append('action', 'add_to_cart');
            formData.append('product_id', productId);
            formData.append('quantity', qty);
            formData.append('sweet_level', sweetLevel);
            formData.append('type_option', typeOption);

            fetch('cart.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast(data.message, 'success');
                    const badges = document.querySelectorAll('.cart-badge');
                    badges.forEach(b => {
                        b.textContent = data.cart_count;
                        b.classList.remove('pop');
                        void b.offsetWidth; // Trigger DOM reflow to restart CSS animation
                        b.classList.add('pop');
                    });
                } else {
                    showToast(data.message, 'danger');
                }
            })
            .catch(() => {
                // Fallback direct submission
                window.location.href = `cart.php?action=add&id=${productId}`;
            });
        });
    });

    // 8. Smooth Quantity Selector Handler (+ / - buttons)
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const isPlus = this.classList.contains('qty-plus');
            const input = this.closest('.qty-control, .quantity-control')?.querySelector('input[type="number"]');
            if (input) {
                let currentVal = parseInt(input.value) || 1;
                if (isPlus) {
                    currentVal++;
                } else if (currentVal > 1) {
                    currentVal--;
                }
                input.value = currentVal;
                // Dispatch input event for any reactive recalculations
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });

    // 9. Alert Auto-dismiss with smooth fade
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(() => alert.remove(), 600);
        }, 5000);
    });
});
