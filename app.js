/* ================================================
   BURGERHUB — Application Logic
   ================================================ */

(() => {
    'use strict';

    // ============================================
    // MENU DATA (Default)
    // ============================================
    const DEFAULT_MENU = [
        {
            key: 'burgers',
            label: 'Бургеры',
            items: [
                { id: 'b1', name: 'Бургер в соусе', desc: 'Булочка, говяжья котлета, сыр Чеддер, огурцы маринованные, карамелизированный лук, фри, фирменный соус', price: 490 },
                { id: 'b2', name: 'Бургер с креветками', desc: 'Булочка 125 мм, креветки, салат, помидоры, сыр Чеддер, соус Спайси', price: 440 },
                { id: 'b3', name: 'Бургер Classic говяжий', desc: 'Булочка 125 мм, говяжья котлета, салат, помидоры, огурцы маринованные, лук красный, сыр Чеддер, соус Гриль', price: 420 },
                { id: 'b4', name: 'Бургер Classic куриный', desc: 'Булочка 125 мм, куриные стрипсы, салат, помидоры, сыр Чеддер, соус Ранч', price: 380 },
                { id: 'b5', name: 'Baby бургер говяжий', desc: 'Булочка 100 мм, говяжья котлета, салат, помидоры, огурцы маринованные, лук красный, сыр Чеддер, соус Гриль', price: 280 },
                { id: 'b6', name: 'Baby бургер куриный', desc: 'Булочка 100 мм, куриные стрипсы, салат, помидоры, сыр Чеддер, соус Ранч', price: 260 },
                { id: 'b7', name: 'Чизбургер', desc: 'Булочка 100 мм, говяжья котлета, кетчуп, горчица, сыр Чеддер, огурцы маринованные', price: 240 },
                { id: 'b8', name: 'Гамбургер', desc: 'Булочка 100 мм, говяжья котлета, кетчуп, горчица', price: 220 }
            ]
        },
        {
            key: 'shawarma',
            label: 'Шаурма',
            items: [
                { id: 's1', name: 'Шаурма Brisket в кляре', desc: 'Лаваш, мясо Brisket, салат, помидоры, соус барбекю, фирменный соус, кляр', price: 500 },
                { id: 's2', name: 'Шаурма Куриная в кляре', desc: 'Лаваш, куриное филе, салат, помидоры, соус фирменный, кляр', price: 440 },
                { id: 's3', name: 'Шаурма Brisket', desc: 'Лаваш, мясо Brisket, салат, помидоры, огурцы, соус барбекю, фирменный соус', price: 420 },
                { id: 's4', name: 'Шаурма с фаршем', desc: 'Лаваш, говяжий фарш, салат, помидоры, огурцы, соус фирменный', price: 380 },
                { id: 's5', name: 'Шаурма фирменная', desc: 'Лаваш, куриное филе, салат, помидоры, огурцы, соус фирменный', price: 370 },
                { id: 's6', name: 'Шаурма куриная', desc: 'Лаваш, куриное филе, салат, помидоры, огурцы, соус', price: 340 }
            ]
        },
        {
            key: 'tacos',
            label: 'Такос',
            items: [
                { id: 't1', name: 'Такос с фаршем', desc: 'Пшеничная лепешка, говяжий фарш, сыр, фри, соус', price: 400 },
                { id: 't2', name: 'Такос с курицей', desc: 'Пшеничная лепешка, куриное филе, сыр, фри, соус', variants: [{ label: 'Стандарт', price: 380 }, { label: 'Большой', price: 580 }] }
            ]
        },
        {
            key: 'gyro',
            label: 'Гиро',
            items: [
                { id: 'g1', name: 'Гиро фирменный', desc: 'Булочка, куриное филе, фри, салат, свежие помидоры, огурцы маринованные, лук красный, соус', price: 360 },
                { id: 'g2', name: 'Гиро классический', desc: 'Булочка, куриное филе, фри, салат, свежие помидоры, свежие огурцы, соус', price: 350 }
            ]
        },
        {
            key: 'rolls',
            label: 'Роллы',
            items: [
                { id: 'r1', name: 'Цезарь ролл с креветками', desc: 'Пшеничная лепешка, креветки в панировке, салат, помидоры, огурцы свежие, сыр, соус Цезарь', price: 370 },
                { id: 'r2', name: 'Ролл с говядиной', desc: 'Пшеничная лепешка, говяжья котлета, помидоры, огурцы маринованные, лук красный, сыр, соус Ранч', price: 350 },
                { id: 'r3', name: 'Ролл фирменный', desc: 'Пшеничная лепешка, куриные стрипсы, салат, помидоры, огурцы маринованные, лук красный, сыр, кетчуп, горчица', price: 340 },
                { id: 'r4', name: 'Цезарь ролл с курицей', desc: 'Пшеничная лепешка, куриные стрипсы, салат, помидоры, огурцы свежие, сыр, соус Цезарь', price: 320 }
            ]
        },
        {
            key: 'other',
            label: 'Другое',
            items: [
                { id: 'o1', name: 'Кесадилья с курицей', desc: 'Пшеничная лепешка, куриное филе, болгарский перец, помидоры, кукуруза, сыр, соус', price: 380 },
                { id: 'o2', name: 'Френч дог', desc: 'Булочка, колбаска Гриль, кетчуп, горчица', price: 200 }
            ]
        },
        {
            key: 'snacks',
            label: 'Снеки',
            items: [
                { id: 'sn1', name: 'Острые крылышки', desc: '5 шт', price: 349 },
                { id: 'sn2', name: 'Стрипсы', desc: 'Куриные стрипсы в панировке', variants: [{ label: '3 шт', price: 199 }, { label: '5 шт', price: 279 }] },
                { id: 'sn3', name: 'Наггетсы', desc: 'Куриные наггетсы', variants: [{ label: '6 шт', price: 189 }, { label: '9 шт', price: 229 }] },
                { id: 'sn4', name: 'Сырные шарики', desc: '8 шт', price: 249 },
                { id: 'sn5', name: 'Картошка по-деревенски', desc: 'Ароматные дольки картофеля', price: 199 },
                { id: 'sn6', name: 'Картофель фри', desc: 'Классический картофель фри', price: 189 }
            ]
        },
        {
            key: 'salads',
            label: 'Салаты',
            items: [
                { id: 'sa1', name: 'Салат Цезарь с курицей', desc: 'Классический салат Цезарь с куриным филе', price: 350 },
                { id: 'sa2', name: 'Салат Цезарь с креветками', desc: 'Салат Цезарь с креветками', price: 380 }
            ]
        }
    ];

    // Image mapping (default)
    const DEFAULT_ITEM_IMAGES = {
        'b1': 'images/b1.jpg', 'b2': 'images/b2.jpg',
        's1': 'images/s1.jpg', 's2': 'images/s2.jpg',
        't1': 'images/t1.jpg', 't2': 'images/t2.jpg',
        'g1': 'images/g1.jpg', 'g2': 'images/g2.jpg',
        'r1': 'images/r1.jpg', 'r2': 'images/r2.jpg',
        'o1': 'images/o1.jpg', 'o2': 'images/o2.jpg',
        'sn1': 'images/sn1.jpg', 'sn2': 'images/sn2.jpg',
        'sa1': 'images/sa1.jpg', 'sa2': 'images/sa2.jpg'
    };

    // Load dynamic MENU and ITEM_IMAGES from localStorage or fallback
    function getStoredMenu() {
        const stored = localStorage.getItem('bh_menu');
        if (!stored) {
            localStorage.setItem('bh_menu', JSON.stringify(DEFAULT_MENU));
            return DEFAULT_MENU;
        }
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
            localStorage.setItem('bh_menu', JSON.stringify(DEFAULT_MENU));
            return DEFAULT_MENU;
        } catch(e) {
            return DEFAULT_MENU;
        }
    }

    function getStoredImages() {
        const stored = localStorage.getItem('bh_item_images');
        if (!stored) {
            localStorage.setItem('bh_item_images', JSON.stringify(DEFAULT_ITEM_IMAGES));
            return DEFAULT_ITEM_IMAGES;
        }
        try {
            return JSON.parse(stored);
        } catch(e) {
            return DEFAULT_ITEM_IMAGES;
        }
    }

    let MENU = getStoredMenu();
    let ITEM_IMAGES = getStoredImages();

    // Helper to get seed orders if none exist
    function getStoredOrders() {
        const stored = localStorage.getItem('bh_orders');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch(e) {}
        }
        
        // Seed orders for testing stats (Today, Week, Month)
        const now = new Date();
        const todayIso = now.toISOString();
        const threeDaysAgoIso = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
        const tenDaysAgoIso = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();
        const twentyDaysAgoIso = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString();

        const seedOrders = [
            {
                id: 'ORD-781920',
                date: new Date(now).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                createdAt: todayIso,
                type: 'delivery',
                name: 'Александр',
                phone: '+7 (928) 555-12-34',
                address: 'ул. Ленина 45, кв. 12',
                comment: 'Домофон 12',
                total: 1250,
                status: 'accepted',
                items: [
                    { cartKey: 'b1', itemId: 'b1', name: 'Бургер в соусе', price: 490, qty: 1 },
                    { cartKey: 'sn6', itemId: 'sn6', name: 'Картофель фри', price: 189, qty: 2 },
                    { cartKey: 'o2', itemId: 'o2', name: 'Френч дог', price: 200, qty: 1 }
                ],
                userEmail: ''
            },
            {
                id: 'ORD-649102',
                date: new Date(now).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                createdAt: todayIso,
                type: 'pickup',
                name: 'Мария',
                phone: '+7 (903) 111-22-33',
                address: '',
                comment: '',
                total: 840,
                status: 'pending',
                items: [
                    { cartKey: 's1', itemId: 's1', name: 'Шаурма Brisket в кляре', price: 500, qty: 1 },
                    { cartKey: 'r3', itemId: 'r3', name: 'Ролл фирменный', price: 340, qty: 1 }
                ],
                userEmail: ''
            },
            {
                id: 'ORD-519204',
                date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                createdAt: threeDaysAgoIso,
                type: 'delivery',
                name: 'Руслан',
                phone: '+7 (988) 777-88-99',
                address: 'пр. Ленина 10, кв. 4',
                comment: 'Позвонить заранее',
                total: 1540,
                status: 'accepted',
                items: [
                    { cartKey: 'b2', itemId: 'b2', name: 'Бургер с креветками', price: 440, qty: 2 },
                    { cartKey: 'g1', itemId: 'g1', name: 'Гиро фирменный', price: 360, qty: 1 },
                    { cartKey: 'sn1', itemId: 'sn1', name: 'Острые крылышки', price: 300, qty: 1 }
                ],
                userEmail: ''
            },
            {
                id: 'ORD-402911',
                date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                createdAt: tenDaysAgoIso,
                type: 'pickup',
                name: 'Ислам',
                phone: '+7 (928) 333-44-55',
                address: '',
                comment: '',
                total: 780,
                status: 'accepted',
                items: [
                    { cartKey: 't1', itemId: 't1', name: 'Такос с фаршем', price: 400, qty: 1 },
                    { cartKey: 'o1', itemId: 'o1', name: 'Кесадилья с курицей', price: 380, qty: 1 }
                ],
                userEmail: ''
            },
            {
                id: 'ORD-301928',
                date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                createdAt: twentyDaysAgoIso,
                type: 'delivery',
                name: 'Елена',
                phone: '+7 (918) 222-33-44',
                address: 'ул. Пушкина 15',
                comment: '',
                total: 420,
                status: 'cancelled',
                items: [
                    { cartKey: 'b3', itemId: 'b3', name: 'Бургер Classic говяжий', price: 420, qty: 1 }
                ],
                userEmail: ''
            }
        ];

        localStorage.setItem('bh_orders', JSON.stringify(seedOrders));
        return seedOrders;
    }

    // ============================================
    // STATE
    // ============================================
    let cart = JSON.parse(localStorage.getItem('bh_cart') || '[]');
    let currentUser = JSON.parse(localStorage.getItem('bh_user') || 'null');
    let orders = getStoredOrders();
    let activeCategory = MENU.length > 0 ? MENU[0].key : 'burgers';
    let selectedVariants = {}; // { itemId: variantIndex }
    let orderType = 'delivery';
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {};

    function initDom() {
        dom.header = $('#site-header');
        dom.cartBadge = $('#cart-badge');
        dom.btnCart = $('#btn-cart');
        dom.btnAdminPanel = $('#btn-admin-panel');
        dom.btnAccount = $('#btn-account');

        dom.categoryNav = $('#category-nav');
        dom.menuItems = $('#menu-items');

        dom.cartOverlay = $('#cart-overlay');
        dom.cartSidebar = $('#cart-sidebar');
        dom.btnCloseCart = $('#btn-close-cart');
        dom.cartEmpty = $('#cart-empty');
        dom.cartList = $('#cart-list');
        dom.cartFooter = $('#cart-footer');
        dom.cartTotal = $('#cart-total');
        dom.btnCheckout = $('#btn-checkout');

        dom.accountOverlay = $('#account-overlay');
        dom.accountModal = $('#account-modal');
        dom.accountTitle = $('#account-modal-title');
        dom.btnCloseAccount = $('#btn-close-account');
        dom.authSection = $('#auth-section');
        dom.profileSection = $('#profile-section');
        dom.formLogin = $('#form-login');
        dom.formRegister = $('#form-register');
        dom.profileAvatar = $('#profile-avatar');
        dom.profileName = $('#profile-name');
        dom.profileEmail = $('#profile-email');
        dom.profilePhone = $('#profile-phone');
        dom.ordersList = $('#orders-list');
        dom.btnLogout = $('#btn-logout');

        dom.checkoutOverlay = $('#checkout-overlay');
        dom.checkoutModal = $('#checkout-modal');
        dom.btnCloseCheckout = $('#btn-close-checkout');
        dom.checkoutBody = $('#checkout-body');
        dom.orderTypeEl = $('#order-type');
        dom.deliveryFields = $('#delivery-fields');
        dom.pickupFields = $('#pickup-fields');
        dom.checkoutItems = $('#checkout-items');
        dom.checkoutTotal = $('#checkout-total');
        dom.btnPlaceOrder = $('#btn-place-order');
        dom.orderSuccess = $('#order-success');
        dom.orderSuccessText = $('#order-success-text');
        dom.btnOrderDone = $('#btn-order-done');

        dom.toast = $('#toast');
        dom.toastText = $('#toast-text');
    }

    // ============================================
    // INIT
    // ============================================
    function init() {
        initDom();
        renderCategories();
        renderMenuItems();
        updateCartBadge();
        setupEventListeners();
        setupScrollEffects();
        setupIntersectionObserver();
        updateAccountUI();
        prefillCheckout();
    }

    // ============================================
    // CATEGORIES
    // ============================================
    function renderCategories() {
        dom.categoryNav.innerHTML = MENU.map(cat =>
            `<button class="menu__category-btn${cat.key === activeCategory ? ' menu__category-btn--active' : ''}" data-category="${cat.key}">${cat.label}</button>`
        ).join('');
    }

    function switchCategory(key) {
        activeCategory = key;
        $$('.menu__category-btn').forEach(btn => {
            btn.classList.toggle('menu__category-btn--active', btn.dataset.category === key);
        });
        renderMenuItems();
    }

    // ============================================
    // MENU ITEMS
    // ============================================
    function renderMenuItems() {
        const cat = MENU.find(c => c.key === activeCategory);
        if (!cat) return;

        dom.menuItems.innerHTML = cat.items.map((item, i) => {
            const hasVariants = item.variants && item.variants.length > 0;
            const selIdx = selectedVariants[item.id] || 0;
            const displayPrice = hasVariants ? item.variants[selIdx].price : item.price;
            const variantLabel = hasVariants ? item.variants[selIdx].label : null;
            const cartKey = variantLabel ? `${item.id}_${selIdx}` : item.id;

            const existingInCart = cart.find(ci => ci.cartKey === cartKey);
            const qty = existingInCart ? existingInCart.qty : 0;

            let variantsHtml = '';
            if (hasVariants) {
                variantsHtml = `<div class="menu-card__variants">${item.variants.map((v, vi) =>
                    `<button class="variant-btn${vi === selIdx ? ' variant-btn--active' : ''}" data-item-id="${item.id}" data-variant="${vi}">${v.label}</button>`
                ).join('')}</div>`;
            }

            const imageUrl = ITEM_IMAGES[item.id];
            const imageHtml = imageUrl
                ? `<div class="menu-card__image-wrap"><img src="${imageUrl}" alt="${item.name}" class="menu-card__image" loading="lazy"></div>`
                : '';

            let actionBtnHtml = '';
            if (qty > 0) {
                actionBtnHtml = `
                    <div class="menu-card__qty-control" data-item-id="${item.id}" data-cart-key="${cartKey}">
                        <button class="menu-card__qty-btn" data-card-action="minus" data-key="${cartKey}">-</button>
                        <span class="menu-card__qty-num">${qty}</span>
                        <button class="menu-card__qty-btn" data-card-action="plus" data-key="${cartKey}">+</button>
                    </div>
                `;
            } else {
                actionBtnHtml = `
                    <button class="menu-card__add" data-item-id="${item.id}" aria-label="Добавить в корзину">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        В корзину
                    </button>
                `;
            }

            return `
                <div class="menu-card fade-in" style="transition-delay: ${i * 0.04}s">
                    ${imageHtml}
                    <div class="menu-card__top">
                        <h3 class="menu-card__name">${item.name}</h3>
                        <span class="menu-card__price" data-item-id="${item.id}">${displayPrice} р</span>
                    </div>
                    <p class="menu-card__desc">${item.desc}</p>
                    <div class="menu-card__footer">
                        ${variantsHtml}
                        ${actionBtnHtml}
                    </div>
                </div>
            `;
        }).join('');

        // Trigger fade-in animations
        requestAnimationFrame(() => {
            $$('.fade-in').forEach(el => el.classList.add('fade-in--visible'));
        });
    }

    // ============================================
    // CART LOGIC
    // ============================================
    function findMenuItem(id) {
        for (const cat of MENU) {
            const item = cat.items.find(i => i.id === id);
            if (item) return item;
        }
        return null;
    }

    function addToCart(itemId) {
        const item = findMenuItem(itemId);
        if (!item) return;

        const hasVariants = item.variants && item.variants.length > 0;
        const variantIdx = selectedVariants[itemId] || 0;
        const price = hasVariants ? item.variants[variantIdx].price : item.price;
        const variantLabel = hasVariants ? item.variants[variantIdx].label : null;

        const cartKey = variantLabel ? `${itemId}_${variantIdx}` : itemId;

        const existing = cart.find(ci => ci.cartKey === cartKey);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                cartKey,
                itemId,
                name: item.name,
                price,
                variantLabel,
                qty: 1
            });
        }

        saveCart();
        updateCartBadge();
        renderCart();
        renderMenuItems();
    }

    function updateCartQty(cartKey, delta) {
        const item = cart.find(ci => ci.cartKey === cartKey);
        if (!item) return;

        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(ci => ci.cartKey !== cartKey);
        }

        saveCart();
        updateCartBadge();
        renderCart();
        renderMenuItems();
    }

    function saveCart() {
        localStorage.setItem('bh_cart', JSON.stringify(cart));
    }

    function getCartTotal() {
        return cart.reduce((sum, ci) => sum + ci.price * ci.qty, 0);
    }

    function getCartCount() {
        return cart.reduce((sum, ci) => sum + ci.qty, 0);
    }

    function updateCartBadge() {
        const count = getCartCount();
        dom.cartBadge.textContent = count;
        dom.cartBadge.classList.toggle('header__badge--visible', count > 0);
    }

    function renderCart() {
        if (cart.length === 0) {
            dom.cartEmpty.classList.remove('cart__empty--hidden');
            dom.cartList.innerHTML = '';
            dom.cartFooter.classList.add('cart__footer--hidden');
            return;
        }

        dom.cartEmpty.classList.add('cart__empty--hidden');
        dom.cartFooter.classList.remove('cart__footer--hidden');

        dom.cartList.innerHTML = cart.map(ci => `
            <div class="cart-item">
                <div class="cart-item__info">
                    <div class="cart-item__name">${ci.name}</div>
                    ${ci.variantLabel ? `<div class="cart-item__variant">${ci.variantLabel}</div>` : ''}
                </div>
                <div class="cart-item__controls">
                    <button class="qty-btn" data-action="minus" data-key="${ci.cartKey}" aria-label="Уменьшить">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                    <span class="cart-item__qty">${ci.qty}</span>
                    <button class="qty-btn" data-action="plus" data-key="${ci.cartKey}" aria-label="Увеличить">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                </div>
                <span class="cart-item__price">${ci.price * ci.qty} р</span>
            </div>
        `).join('');

        dom.cartTotal.textContent = getCartTotal() + ' р';
    }

    // ============================================
    // CART SIDEBAR
    // ============================================
    function openCart() {
        renderCart();
        dom.cartOverlay.classList.add('overlay--active');
        dom.cartSidebar.classList.add('cart--open');
        document.body.classList.add('no-scroll');
    }

    function closeCart() {
        dom.cartOverlay.classList.remove('overlay--active');
        dom.cartSidebar.classList.remove('cart--open');
        document.body.classList.remove('no-scroll');
    }

    // ============================================
    // ACCOUNT MODAL
    // ============================================
    function openAccount() {
        updateAccountUI();
        dom.accountOverlay.classList.add('overlay--active');
        dom.accountModal.classList.add('modal--open');
        document.body.classList.add('no-scroll');
    }

    function closeAccount() {
        dom.accountOverlay.classList.remove('overlay--active');
        dom.accountModal.classList.remove('modal--open');
        document.body.classList.remove('no-scroll');
    }

    function updateAccountUI() {
        const isAdminAuth = localStorage.getItem('bh_admin_auth') === 'true';

        if (dom.btnAdminPanel) {
            dom.btnAdminPanel.style.display = isAdminAuth ? 'inline-flex' : 'none';
        }

        if (isAdminAuth) {
            dom.authSection.style.display = 'none';
            dom.profileSection.classList.remove('profile-section--hidden');
            dom.profileSection.style.display = '';
            dom.accountTitle.textContent = 'Администратор';
            dom.profileAvatar.textContent = '⚙️';
            dom.profileName.textContent = 'Администратор';
            dom.profileEmail.textContent = 'Логин: Admin';
            dom.profilePhone.textContent = 'Режим управления активен';

            dom.ordersList.innerHTML = `
                <div style="text-align:center; padding: 12px 0;">
                    <p style="font-size: 0.85rem; color: var(--color-gold); margin-bottom: 14px;">Авторизация Администратора активна</p>
                    <button class="btn btn--primary btn--full" onclick="window.location.href='admin.html'">Перейти в Админ-панель</button>
                </div>
            `;
            return;
        }

        if (currentUser) {
            dom.authSection.style.display = 'none';
            dom.profileSection.classList.remove('profile-section--hidden');
            dom.profileSection.style.display = '';
            dom.accountTitle.textContent = 'Личный кабинет';
            dom.profileAvatar.textContent = (currentUser.name || 'U').charAt(0).toUpperCase();
            dom.profileName.textContent = currentUser.name;
            dom.profileEmail.textContent = currentUser.email || '';
            dom.profilePhone.textContent = currentUser.phone || '';
            renderOrderHistory();
        } else {
            dom.authSection.style.display = '';
            dom.profileSection.classList.add('profile-section--hidden');
            dom.profileSection.style.display = 'none';
            dom.accountTitle.textContent = 'Вход / Регистрация';
        }
    }

    function renderOrderHistory() {
        const userOrders = orders.filter(o => o.userEmail === (currentUser?.email || ''));
        if (userOrders.length === 0) {
            dom.ordersList.innerHTML = '<p class="profile__no-orders">Заказов пока нет</p>';
            return;
        }

        dom.ordersList.innerHTML = userOrders.slice().reverse().map(o => `
            <div class="order-history-item">
                <span class="order-history-item__info">
                    ${o.date}
                    <span class="order-history-item__type">${o.type === 'delivery' ? 'Доставка' : 'С собой'}</span>
                </span>
                <span class="order-history-item__total">${o.total} р</span>
            </div>
        `).join('');
    }

    function normalizePhone(phoneStr) {
        if (!phoneStr) return '';
        return phoneStr.replace(/\D/g, '');
    }

    function handleLogin(e) {
        e.preventDefault();
        const loginInput = $('#login-email').value.trim();
        const password = $('#login-password').value;

        if (!loginInput || !password) {
            showToast('Заполните все поля');
            return;
        }

        const loginLower = loginInput.toLowerCase();
        const inputDigits = normalizePhone(loginInput);

        // Admin Login Check
        if ((loginLower === 'admin' || loginLower === 'admin@burgerhub.ru' || loginInput === 'Admin') && (password === 'Burgerhub_admin88' || password === 'Burger_hub1@')) {
            localStorage.setItem('bh_admin_auth', 'true');
            showToast('Авторизация Администратора успешна!');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 500);
            return;
        }

        // Customer Login Check (by Phone or Email)
        const users = JSON.parse(localStorage.getItem('bh_users') || '[]');
        const user = users.find(u => {
            if (u.password !== password) return false;
            if (u.phone && normalizePhone(u.phone) === inputDigits && inputDigits.length >= 6) return true;
            if (u.phone && u.phone === loginInput) return true;
            if (u.email && u.email.toLowerCase() === loginLower) return true;
            return false;
        });

        if (user) {
            currentUser = { name: user.name, email: user.email || '', phone: user.phone || '' };
            localStorage.setItem('bh_user', JSON.stringify(currentUser));
            updateAccountUI();
            prefillCheckout();
            showToast('Добро пожаловать, ' + user.name);
        } else {
            showToast('Неверный телефон / логин или пароль');
        }
    }

    function handleRegister(e) {
        e.preventDefault();
        const name = $('#reg-name').value.trim();
        const phone = $('#reg-phone').value.trim();
        const email = $('#reg-email')?.value.trim() || '';
        const password = $('#reg-password').value;

        if (!name || !phone || !password) {
            showToast('Заполните имя, телефон и пароль');
            return;
        }

        const users = JSON.parse(localStorage.getItem('bh_users') || '[]');
        const regDigits = normalizePhone(phone);

        if (users.find(u => normalizePhone(u.phone) === regDigits && regDigits.length >= 6)) {
            showToast('Пользователь с таким номером уже зарегистрирован');
            return;
        }

        users.push({ name, email, phone, password });
        localStorage.setItem('bh_users', JSON.stringify(users));

        currentUser = { name, email, phone };
        localStorage.setItem('bh_user', JSON.stringify(currentUser));
        updateAccountUI();
        prefillCheckout();
        showToast('Регистрация успешна');
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('bh_user');
        localStorage.removeItem('bh_admin_auth');
        updateAccountUI();
        showToast('Вы вышли из аккаунта');
    }

    // ============================================
    // CHECKOUT MODAL
    // ============================================
    function openCheckout() {
        if (cart.length === 0) return;
        closeCart();

        renderCheckoutSummary();
        prefillCheckout();

        // Reset state
        dom.checkoutBody.style.display = '';
        dom.orderSuccess.classList.add('order-success--hidden');
        dom.orderSuccess.style.display = 'none';

        setTimeout(() => {
            dom.checkoutOverlay.classList.add('overlay--active');
            dom.checkoutModal.classList.add('modal--open');
            document.body.classList.add('no-scroll');
        }, 200);
    }

    function closeCheckout() {
        dom.checkoutOverlay.classList.remove('overlay--active');
        dom.checkoutModal.classList.remove('modal--open');
        document.body.classList.remove('no-scroll');
    }

    function prefillCheckout() {
        if (currentUser) {
            const nameField = $('#co-name');
            const phoneField = $('#co-phone');
            const nameFieldP = $('#co-name-p');
            const phoneFieldP = $('#co-phone-p');

            if (nameField && !nameField.value) nameField.value = currentUser.name || '';
            if (phoneField && !phoneField.value) phoneField.value = currentUser.phone || '';
            if (nameFieldP && !nameFieldP.value) nameFieldP.value = currentUser.name || '';
            if (phoneFieldP && !phoneFieldP.value) phoneFieldP.value = currentUser.phone || '';
        }
    }

    function setOrderType(type) {
        orderType = type;
        $$('.order-type__btn').forEach(btn => {
            btn.classList.toggle('order-type__btn--active', btn.dataset.type === type);
        });
        dom.deliveryFields.classList.toggle('checkout-fields--hidden', type !== 'delivery');
        dom.pickupFields.classList.toggle('checkout-fields--hidden', type !== 'pickup');
    }

    function renderCheckoutSummary() {
        dom.checkoutItems.innerHTML = cart.map(ci => `
            <div class="checkout-summary__item">
                <span>${ci.name}${ci.variantLabel ? ' (' + ci.variantLabel + ')' : ''}<span class="checkout-summary__item-qty"> x${ci.qty}</span></span>
                <span class="checkout-summary__item-price">${ci.price * ci.qty} р</span>
            </div>
        `).join('');
        dom.checkoutTotal.textContent = getCartTotal() + ' р';
    }

    function placeOrder() {
        // Validate
        let name, phone;

        if (orderType === 'delivery') {
            name = $('#co-name').value.trim();
            phone = $('#co-phone').value.trim();
            const address = $('#co-address').value.trim();
            if (!name || !phone || !address) {
                showToast('Заполните имя, телефон и адрес');
                return;
            }
        } else {
            name = $('#co-name-p').value.trim();
            phone = $('#co-phone-p').value.trim();
            if (!name || !phone) {
                showToast('Заполните имя и телефон');
                return;
            }
        }

        // Save order
        const now = new Date();
        const pickupComment = orderType === 'pickup' ? ($('#co-pickup-comment')?.value.trim() || '') : '';
        const deliveryComment = orderType === 'delivery' ? ($('#co-comment')?.value.trim() || '') : '';
        const orderComment = pickupComment || deliveryComment;

        const formattedItemsString = cart.map(item =>
            item.name + (item.variantLabel ? ' (' + item.variantLabel + ')' : '') + ' x ' + item.qty + ' = ' + (item.price * item.qty) + ' р'
        ).join('\n');

        const order = {
            id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            date: now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            createdAt: now.toISOString(),
            type: orderType,
            name: name,
            phone: phone,
            address: orderType === 'delivery' ? ($('#co-address')?.value.trim() || '') : '',
            comment: orderComment,
            total: getCartTotal(),
            items: cart.map(item => ({ ...item })),
            itemsString: formattedItemsString,
            userEmail: currentUser?.email || '',
            status: 'pending'
        };
        orders.push(order);
        localStorage.setItem('bh_orders', JSON.stringify(orders));

        // Attempt POST to backend API (which sends Telegram bot notification)
        try {
            fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: orderType,
                    name: name,
                    phone: phone,
                    items: formattedItemsString,
                    total: getCartTotal(),
                    address: order.address,
                    comment: orderComment
                })
            }).catch(() => {});
        } catch(e) {}

        // Clear cart
        cart = [];
        saveCart();
        updateCartBadge();

        // Show success
        dom.checkoutBody.style.display = 'none';
        dom.orderSuccess.classList.remove('order-success--hidden');
        dom.orderSuccess.style.display = '';

        const typeText = orderType === 'delivery' ? 'Мы доставим ваш заказ в ближайшее время.' : 'Заказ будет готов через 15-20 минут. Ждем вас!';
        dom.orderSuccessText.textContent = `Спасибо за заказ, ${name}! ${typeText}`;
    }

    function handleOrderDone() {
        closeCheckout();
        // Reset forms
        $('#co-address') && ($('#co-address').value = '');
        $('#co-comment') && ($('#co-comment').value = '');
    }

    // ============================================
    // TOAST
    // ============================================
    let toastTimer = null;
    function showToast(msg) {
        dom.toastText.textContent = msg;
        dom.toast.classList.add('toast--visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            dom.toast.classList.remove('toast--visible');
        }, 2400);
    }

    // ============================================
    // SCROLL EFFECTS
    // ============================================
    function setupScrollEffects() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    dom.header.classList.toggle('header--scrolled', window.scrollY > 60);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ============================================
    // INTERSECTION OBSERVER (fade-in)
    // ============================================
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in--visible');
                }
            });
        }, { threshold: 0.1 });

        $$('.fade-in').forEach(el => observer.observe(el));
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    function setupEventListeners() {
        // Category tabs
        if (dom.categoryNav) {
            dom.categoryNav.addEventListener('click', e => {
                const btn = e.target.closest('.menu__category-btn');
                if (btn) switchCategory(btn.dataset.category);
            });
        }

        // Menu items (add to cart, variant select, card quantity counter)
        if (dom.menuItems) {
            dom.menuItems.addEventListener('click', e => {
                const addBtn = e.target.closest('.menu-card__add');
                if (addBtn) {
                    addToCart(addBtn.dataset.itemId);
                    return;
                }

                const qtyCardBtn = e.target.closest('[data-card-action]');
                if (qtyCardBtn) {
                    const action = qtyCardBtn.dataset.cardAction;
                    const key = qtyCardBtn.dataset.key;
                    updateCartQty(key, action === 'plus' ? 1 : -1);
                    return;
                }

                const varBtn = e.target.closest('.variant-btn');
                if (varBtn) {
                    const itemId = varBtn.dataset.itemId;
                    const variantIdx = parseInt(varBtn.dataset.variant, 10);
                    selectedVariants[itemId] = variantIdx;
                    renderMenuItems();
                }
            });
        }

        // Cart
        if (dom.btnCart) dom.btnCart.addEventListener('click', openCart);
        if (dom.btnCloseCart) dom.btnCloseCart.addEventListener('click', closeCart);
        if (dom.cartOverlay) dom.cartOverlay.addEventListener('click', closeCart);
        if (dom.btnCheckout) dom.btnCheckout.addEventListener('click', openCheckout);

        if (dom.cartList) {
            dom.cartList.addEventListener('click', e => {
                const btn = e.target.closest('.qty-btn');
                if (!btn) return;
                const key = btn.dataset.key;
                const action = btn.dataset.action;
                updateCartQty(key, action === 'plus' ? 1 : -1);
            });
        }

        // Account & Admin
        if (dom.btnAdminPanel) {
            dom.btnAdminPanel.addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }
        if (dom.btnAccount) dom.btnAccount.addEventListener('click', openAccount);
        if (dom.btnCloseAccount) dom.btnCloseAccount.addEventListener('click', closeAccount);
        if (dom.accountOverlay) dom.accountOverlay.addEventListener('click', closeAccount);

        // Auth tabs
        $$('.modal__tab').forEach(tab => {
            tab.addEventListener('click', () => {
                $$('.modal__tab').forEach(t => t.classList.remove('modal__tab--active'));
                tab.classList.add('modal__tab--active');
                const target = tab.dataset.tab;
                if (dom.formLogin) dom.formLogin.classList.toggle('modal__form--hidden', target !== 'login');
                if (dom.formRegister) dom.formRegister.classList.toggle('modal__form--hidden', target !== 'register');
            });
        });

        if (dom.formLogin) dom.formLogin.addEventListener('submit', handleLogin);
        if (dom.formRegister) dom.formRegister.addEventListener('submit', handleRegister);
        if (dom.btnLogout) dom.btnLogout.addEventListener('click', handleLogout);

        // Checkout
        if (dom.btnCloseCheckout) dom.btnCloseCheckout.addEventListener('click', closeCheckout);
        if (dom.checkoutOverlay) dom.checkoutOverlay.addEventListener('click', closeCheckout);

        if (dom.orderTypeEl) {
            dom.orderTypeEl.addEventListener('click', e => {
                const btn = e.target.closest('.order-type__btn');
                if (btn) setOrderType(btn.dataset.type);
            });
        }

        if (dom.btnPlaceOrder) dom.btnPlaceOrder.addEventListener('click', placeOrder);
        if (dom.btnOrderDone) dom.btnOrderDone.addEventListener('click', handleOrderDone);

        // Smooth scroll for anchor links
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Keyboard: Escape closes modals
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                closeCart();
                closeAccount();
                closeCheckout();
            }
        });
    }

    // ============================================
    // START
    // ============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
