/* ================================================
   BURGERHUB — Admin Panel Logic
   ================================================ */

(() => {
    'use strict';

    // List of available files in images folder
    const AVAILABLE_IMAGES = [
        'b1.jpg', 'b2.jpg',
        's1.jpg', 's2.jpg',
        't1.jpg', 't2.jpg',
        'g1.jpg', 'g2.jpg',
        'r1.jpg', 'r2.jpg',
        'o1.jpg', 'o2.jpg',
        'sn1.jpg', 'sn2.jpg',
        'sa1.jpg', 'sa2.jpg'
    ];

    // ============================================
    // STATE
    // ============================================
    let orders = JSON.parse(localStorage.getItem('bh_orders') || '[]');
    let menu = JSON.parse(localStorage.getItem('bh_menu') || '[]');
    let itemImages = JSON.parse(localStorage.getItem('bh_item_images') || '{}');

    let activeTab = 'orders';
    let ordersPeriod = 'today';
    let revenuePeriod = 'today';
    let activeCategory = menu.length > 0 ? menu[0].key : 'burgers';
    let targetItemForImage = null;

    // ============================================
    // DOM REFS
    // ============================================
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const dom = {};

    function initDom() {
        dom.tabs = $$('.admin-tab');
        dom.sections = $$('.admin-section');
        dom.pendingBadge = $('#pending-orders-badge');

        // Orders
        dom.ordersPeriodFilter = $('#orders-period-filter');
        dom.ordersStatTotal = $('#orders-stat-total');
        dom.ordersStatPending = $('#orders-stat-pending');
        dom.ordersStatAccepted = $('#orders-stat-accepted');
        dom.ordersStatCancelled = $('#orders-stat-cancelled');
        dom.ordersList = $('#orders-list');

        // Revenue
        dom.revenuePeriodFilter = $('#revenue-period-filter');
        dom.revenuePeriodLabel = $('#revenue-period-label');
        dom.revenueTotalDisplay = $('#revenue-total-display');
        dom.revenueAcceptedCount = $('#revenue-metric-accepted-count');
        dom.revenueAvgCheck = $('#revenue-metric-avg-check');
        dom.revenueTotalOrders = $('#revenue-metric-total-orders');
        dom.revenueItemsBreakdown = $('#revenue-items-breakdown');

        // Positions
        dom.positionsCategoryNav = $('#positions-category-nav');
        dom.positionsGrid = $('#positions-grid');
        dom.btnOpenAddCategory = $('#btn-open-add-category');
        dom.btnAddPosition = $('#btn-add-position');

        // Add Category Modal
        dom.addCategoryOverlay = $('#add-category-overlay');
        dom.addCategoryModal = $('#add-category-modal');
        dom.btnCloseAddCategory = $('#btn-close-add-category');
        dom.formAddCategory = $('#form-add-category');
        dom.newCatTitle = $('#new-cat-title');

        // Image Picker Modal
        dom.imagePickerOverlay = $('#image-picker-overlay');
        dom.imagePickerModal = $('#image-picker-modal');
        dom.btnCloseImagePicker = $('#btn-close-image-picker');
        dom.imagePickerGrid = $('#image-picker-grid');
        dom.btnRemovePhoto = $('#btn-remove-photo');

        // Admin Auth Modal
        dom.btnAdminLogout = $('#btn-admin-logout');
        dom.adminAuthOverlay = $('#admin-auth-overlay');
        dom.adminAuthModal = $('#admin-auth-modal');
        dom.formAdminLogin = $('#form-admin-login');
        dom.adminLoginInput = $('#admin-login-input');
        dom.adminPassInput = $('#admin-pass-input');

        // Toast
        dom.toast = $('#toast');
        dom.toastText = $('#toast-text');
    }

    // ============================================
    // INIT
    // ============================================
    function init() {
        initDom();
        setupEventListeners();
        if (checkAdminAuth()) {
            updatePendingBadge();
            renderActiveTab();
            fetchOrdersFromServer();
            setInterval(fetchOrdersFromServer, 10000);
        }
    }

    async function fetchOrdersFromServer() {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const serverOrders = await res.json();
                if (Array.isArray(serverOrders) && serverOrders.length > 0) {
                    const existingMap = new Map();
                    orders.forEach(o => existingMap.set(String(o.id), o));

                    serverOrders.forEach(so => {
                        const idStr = String(so.id);
                        if (!existingMap.has(idStr)) {
                            const newObj = {
                                id: idStr,
                                date: so.date ? new Date(so.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
                                createdAt: so.date || new Date().toISOString(),
                                type: so.type || 'delivery',
                                name: so.name || 'Клиент',
                                phone: so.phone || '',
                                address: so.address || '',
                                comment: so.comment || '',
                                total: so.total || 0,
                                itemsString: so.items || '',
                                items: typeof so.items === 'string' ? [] : (so.items || []),
                                status: so.status === 'processing' ? 'pending' : (so.status || 'pending')
                            };
                            orders.push(newObj);
                            existingMap.set(idStr, newObj);
                        }
                    });

                    localStorage.setItem('bh_orders', JSON.stringify(orders));
                    updatePendingBadge();
                    if (activeTab === 'orders' || activeTab === 'revenue') {
                        renderActiveTab();
                    }
                }
            }
        } catch (e) {}
    }

    // ============================================
    // DATE HELPERS
    // ============================================
    function isToday(dateStr) {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const now = new Date();
        return d.getDate() === now.getDate() &&
               d.getMonth() === now.getMonth() &&
               d.getFullYear() === now.getFullYear();
    }

    function isThisWeek(dateStr) {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - d);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
    }

    function isThisMonth(dateStr) {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }

    function filterOrdersByPeriod(list, period) {
        if (period === 'today') {
            return list.filter(o => isToday(o.createdAt || o.date));
        }
        if (period === 'week') {
            return list.filter(o => isThisWeek(o.createdAt || o.date));
        }
        if (period === 'month') {
            return list.filter(o => isThisMonth(o.createdAt || o.date));
        }
        return list; // 'all'
    }

    // ============================================
    // TAB SWITCHING
    // ============================================
    function switchTab(tabKey) {
        activeTab = tabKey;
        dom.tabs.forEach(tab => {
            tab.classList.toggle('admin-tab--active', tab.dataset.tab === tabKey);
        });
        dom.sections.forEach(sec => {
            sec.classList.toggle('admin-section--active', sec.id === `section-${tabKey}`);
        });
        renderActiveTab();
    }

    function renderActiveTab() {
        if (activeTab === 'orders') renderOrders();
        if (activeTab === 'revenue') renderRevenue();
        if (activeTab === 'positions') renderPositions();
    }

    function updatePendingBadge() {
        const pendingCount = orders.filter(o => (o.status || 'pending') === 'pending').length;
        if (dom.pendingBadge) {
            dom.pendingBadge.textContent = pendingCount;
            dom.pendingBadge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
        }
    }

    // ============================================
    // 1. ORDERS SECTION
    // ============================================
    function renderOrders() {
        const filtered = filterOrdersByPeriod(orders, ordersPeriod);

        // Calculate summary metrics
        const total = filtered.length;
        const pending = filtered.filter(o => (o.status || 'pending') === 'pending').length;
        const accepted = filtered.filter(o => o.status === 'accepted').length;
        const cancelled = filtered.filter(o => o.status === 'cancelled').length;

        dom.ordersStatTotal.textContent = total;
        dom.ordersStatPending.textContent = pending;
        dom.ordersStatAccepted.textContent = accepted;
        dom.ordersStatCancelled.textContent = cancelled;

        updatePendingBadge();

        if (filtered.length === 0) {
            dom.ordersList.innerHTML = '<div class="orders-empty">Заявок за выбранный период не найдено</div>';
            return;
        }

        dom.ordersList.innerHTML = filtered.slice().reverse().map(order => {
            const status = order.status || 'pending';
            let badgeHtml = '';
            if (status === 'accepted') {
                badgeHtml = '<span class="order-card__badge badge--accepted">● Принят</span>';
            } else if (status === 'cancelled') {
                badgeHtml = '<span class="order-card__badge badge--cancelled">✕ Отменен</span>';
            } else {
                badgeHtml = '<span class="order-card__badge badge--pending">⏳ В ожидании</span>';
            }

            const itemsHtml = (order.items || []).map(ci => `
                <div class="order-item-row">
                    <span class="order-item-row__name">${ci.name}${ci.variantLabel ? ' (' + ci.variantLabel + ')' : ''} x${ci.qty}</span>
                    <span class="order-item-row__price">${ci.price * ci.qty} р</span>
                </div>
            `).join('');

            return `
                <div class="order-card" data-id="${order.id}">
                    <div class="order-card__header">
                        <div class="order-card__id">
                            ${order.id || 'ЗАКАЗ'}
                            <span class="order-card__date">${order.date || ''}</span>
                        </div>
                        ${badgeHtml}
                    </div>
                    <div class="order-card__content">
                        <div class="order-card__customer">
                            <div class="customer-row">
                                <span class="customer-row__label">Клиент:</span>
                                <span class="customer-row__val">${order.name || '—'}</span>
                            </div>
                            <div class="customer-row">
                                <span class="customer-row__label">Телефон:</span>
                                <span class="customer-row__val">${order.phone || '—'}</span>
                            </div>
                            <div class="customer-row">
                                <span class="customer-row__label">Тип:</span>
                                <span class="customer-row__val">${order.type === 'delivery' ? 'Доставка' : 'С собой'}</span>
                            </div>
                            ${order.address ? `
                            <div class="customer-row">
                                <span class="customer-row__label">Адрес:</span>
                                <span class="customer-row__val">${order.address}</span>
                            </div>` : ''}
                            ${order.comment ? `
                            <div class="customer-row">
                                <span class="customer-row__label">Коммент:</span>
                                <span class="customer-row__val">${order.comment}</span>
                            </div>` : ''}
                        </div>
                        <div class="order-card__items">
                            ${itemsHtml}
                        </div>
                    </div>
                    <div class="order-card__footer">
                        <div class="order-card__total">
                            Сумма: <span class="order-card__total-val">${order.total} р</span>
                        </div>
                        <div class="order-card__actions">
                            ${status !== 'accepted' ? `<button class="btn btn--accept" data-action="accept" data-id="${order.id}">Принять</button>` : ''}
                            ${status !== 'cancelled' ? `<button class="btn btn--cancel" data-action="cancel" data-id="${order.id}">Отменить</button>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function updateOrderStatus(orderId, newStatus) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        order.status = newStatus;
        localStorage.setItem('bh_orders', JSON.stringify(orders));

        // Sync with backend API if server active
        try {
            fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus === 'pending' ? 'processing' : newStatus })
            }).catch(() => {});
        } catch(e) {}

        const msg = newStatus === 'accepted' ? `Заказ ${orderId} принят` : `Заказ ${orderId} отменен`;
        showToast(msg);

        renderActiveTab();
    }

    // ============================================
    // 2. REVENUE SECTION
    // ============================================
    function renderRevenue() {
        const filtered = filterOrdersByPeriod(orders, revenuePeriod);

        const acceptedOrders = filtered.filter(o => o.status === 'accepted');
        const totalRevenue = acceptedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        const acceptedCount = acceptedOrders.length;
        const avgCheck = acceptedCount > 0 ? Math.round(totalRevenue / acceptedCount) : 0;

        // Label update
        const labels = {
            today: 'Выручка за день',
            week: 'Выручка за неделю',
            month: 'Выручка за месяц',
            all: 'Вся выручка'
        };
        dom.revenuePeriodLabel.textContent = labels[revenuePeriod] || 'Выручка';
        dom.revenueTotalDisplay.textContent = totalRevenue.toLocaleString('ru-RU') + ' р';
        dom.revenueAcceptedCount.textContent = acceptedCount;
        dom.revenueAvgCheck.textContent = avgCheck.toLocaleString('ru-RU') + ' р';
        dom.revenueTotalOrders.textContent = filtered.length;

        // Breakdown by items
        const itemSales = {};
        acceptedOrders.forEach(o => {
            (o.items || []).forEach(ci => {
                const key = ci.name + (ci.variantLabel ? ' (' + ci.variantLabel + ')' : '');
                if (!itemSales[key]) {
                    itemSales[key] = { qty: 0, sum: 0 };
                }
                itemSales[key].qty += ci.qty;
                itemSales[key].sum += ci.price * ci.qty;
            });
        });

        const sortedItems = Object.entries(itemSales).sort((a, b) => b[1].sum - a[1].sum);

        if (sortedItems.length === 0) {
            dom.revenueItemsBreakdown.innerHTML = '<p class="orders-empty">Продаж за выбранный период нет</p>';
            return;
        }

        dom.revenueItemsBreakdown.innerHTML = sortedItems.map(([name, data]) => `
            <div class="revenue-item-row">
                <div>
                    <span>${name}</span>
                    <span class="revenue-item-row__count">${data.qty} шт</span>
                </div>
                <span class="revenue-item-row__sum">${data.sum.toLocaleString('ru-RU')} р</span>
            </div>
        `).join('');
    }

    // ============================================
    // 3. POSITIONS SECTION (MENU MANAGEMENT)
    // ============================================
    function renderPositions() {
        renderPositionsCategories();
        renderPositionsGrid();
    }

    function renderPositionsCategories() {
        dom.positionsCategoryNav.innerHTML = menu.map(cat => `
            <button class="menu__category-btn${cat.key === activeCategory ? ' menu__category-btn--active' : ''}" data-category="${cat.key}">${cat.label}</button>
        `).join('');
    }

    function renderPositionsGrid() {
        const cat = menu.find(c => c.key === activeCategory);
        if (!cat) return;

        dom.positionsGrid.innerHTML = cat.items.map(item => {
            const imgSrc = itemImages[item.id];
            const hasImg = Boolean(imgSrc);

            const imgHtml = hasImg
                ? `<img src="${imgSrc}" alt="${item.name}" class="position-card__img">`
                : `<span class="position-card__no-img">Нет фото</span>`;

            const imgBtnLabel = hasImg ? 'Заменить' : 'Добавить фото';

            return `
                <div class="position-card" data-id="${item.id}">
                    <div class="position-card__image-box">
                        ${imgHtml}
                        <button class="position-card__img-btn" data-action="pick-image" data-id="${item.id}">${imgBtnLabel}</button>
                    </div>
                    <div class="position-card__fields">
                        <div class="form-group">
                            <label class="form-label">Название</label>
                            <input type="text" class="form-input pos-name" value="${item.name.replace(/"/g, '&quot;')}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Описание</label>
                            <textarea class="form-input form-input--textarea pos-desc">${item.desc.replace(/"/g, '&quot;')}</textarea>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Цена (руб)</label>
                            <input type="number" class="form-input pos-price" value="${item.price || 0}">
                        </div>
                    </div>
                    <div class="position-card__footer">
                        <button class="btn btn--outline" data-action="delete-pos" data-id="${item.id}" style="border-color: rgba(231,76,60,0.4); color: var(--color-error);">Удалить</button>
                        <button class="btn btn--primary" data-action="save-pos" data-id="${item.id}">Сохранить изменения</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ============================================
    // ADD CATEGORY & POSITION HANDLERS
    // ============================================
    function openAddCategoryModal() {
        dom.newCatTitle.value = '';
        dom.addCategoryOverlay.classList.add('overlay--active');
        dom.addCategoryModal.classList.add('modal--open');
        document.body.classList.add('no-scroll');
        setTimeout(() => dom.newCatTitle.focus(), 150);
    }

    function closeAddCategoryModal() {
        dom.addCategoryOverlay.classList.remove('overlay--active');
        dom.addCategoryModal.classList.remove('modal--open');
        document.body.classList.remove('no-scroll');
    }

    function handleAddCategory(e) {
        e.preventDefault();
        const title = dom.newCatTitle.value.trim();
        if (!title) return;

        const key = 'cat_' + Date.now();
        const newCategory = {
            key: key,
            label: title,
            items: []
        };

        menu.push(newCategory);
        localStorage.setItem('bh_menu', JSON.stringify(menu));

        activeCategory = key;
        closeAddCategoryModal();
        renderPositions();
        showToast(`Категория «${title}» добавлена`);
    }

    function handleAddPosition() {
        const cat = menu.find(c => c.key === activeCategory);
        if (!cat) return;

        const newId = 'pos_' + Date.now();
        const newItem = {
            id: newId,
            name: 'Новая позиция',
            desc: 'Состав и описание позиции',
            price: 300
        };

        cat.items.push(newItem);
        localStorage.setItem('bh_menu', JSON.stringify(menu));

        renderPositionsGrid();
        showToast('Новая позиция добавлена');
    }

    function deletePosition(itemId) {
        if (!confirm('Вы уверены, что хотите удалить эту позицию?')) return;

        for (const cat of menu) {
            const idx = cat.items.findIndex(i => i.id === itemId);
            if (idx !== -1) {
                cat.items.splice(idx, 1);
                delete itemImages[itemId];
                localStorage.setItem('bh_menu', JSON.stringify(menu));
                localStorage.setItem('bh_item_images', JSON.stringify(itemImages));
                showToast('Позиция удалена');
                renderPositionsGrid();
                return;
            }
        }
    }

    function savePosition(itemId) {
        const card = document.querySelector(`.position-card[data-id="${itemId}"]`);
        if (!card) return;

        const newName = card.querySelector('.pos-name').value.trim();
        const newDesc = card.querySelector('.pos-desc').value.trim();
        const newPrice = parseInt(card.querySelector('.pos-price').value, 10);

        if (!newName || isNaN(newPrice)) {
            showToast('Заполните название и цену');
            return;
        }

        // Update in menu state
        for (const cat of menu) {
            const item = cat.items.find(i => i.id === itemId);
            if (item) {
                item.name = newName;
                item.desc = newDesc;
                item.price = newPrice;
                break;
            }
        }

        // Save to localStorage
        localStorage.setItem('bh_menu', JSON.stringify(menu));
        showToast('Позиция обновлена');
        renderPositionsGrid();
    }

    // ============================================
    // IMAGE PICKER MODAL
    // ============================================
    function openImagePicker(itemId) {
        targetItemForImage = itemId;
        renderImagePickerGrid();
        dom.imagePickerOverlay.classList.add('overlay--active');
        dom.imagePickerModal.classList.add('modal--open');
        document.body.classList.add('no-scroll');
    }

    function closeImagePicker() {
        targetItemForImage = null;
        dom.imagePickerOverlay.classList.remove('overlay--active');
        dom.imagePickerModal.classList.remove('modal--open');
        document.body.classList.remove('no-scroll');
    }

    function renderImagePickerGrid() {
        dom.imagePickerGrid.innerHTML = AVAILABLE_IMAGES.map(fileName => {
            const fullPath = 'images/' + fileName;
            return `
                <div class="image-option" data-file="${fullPath}">
                    <img src="${fullPath}" alt="${fileName}">
                    <span class="image-option__name">${fileName}</span>
                </div>
            `;
        }).join('');
    }

    function selectImageForPosition(imagePath) {
        if (!targetItemForImage) return;

        itemImages[targetItemForImage] = imagePath;
        localStorage.setItem('bh_item_images', JSON.stringify(itemImages));

        closeImagePicker();
        renderPositionsGrid();
        showToast('Фотография привязана');
    }

    function removeImageForPosition() {
        if (!targetItemForImage) return;

        delete itemImages[targetItemForImage];
        localStorage.setItem('bh_item_images', JSON.stringify(itemImages));

        closeImagePicker();
        renderPositionsGrid();
        showToast('Фотография удалена');
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
    // ADMIN AUTHENTICATION GUARD
    // ============================================
    function checkAdminAuth() {
        const isAuth = localStorage.getItem('bh_admin_auth') === 'true';
        if (!isAuth) {
            if (dom.adminAuthOverlay && dom.adminAuthModal) {
                dom.adminAuthOverlay.classList.add('overlay--active');
                dom.adminAuthModal.classList.add('modal--open');
                document.body.classList.add('no-scroll');
            }
            return false;
        } else {
            if (dom.adminAuthOverlay && dom.adminAuthModal) {
                dom.adminAuthOverlay.classList.remove('overlay--active');
                dom.adminAuthModal.classList.remove('modal--open');
                document.body.classList.remove('no-scroll');
            }
            return true;
        }
    }

    function handleAdminLogin(e) {
        e.preventDefault();
        const login = (dom.adminLoginInput?.value || '').trim().toLowerCase();
        const pass = dom.adminPassInput?.value;

        if ((login === 'admin' || login === 'admin@burgerhub.ru') && (pass === 'Burgerhub_admin88' || pass === 'Burger_hub1@')) {
            localStorage.setItem('bh_admin_auth', 'true');
            showToast('Успешный вход в систему');
            checkAdminAuth();
            updatePendingBadge();
            renderActiveTab();
        } else {
            showToast('Неверный логин или пароль');
        }
    }

    function handleAdminLogout() {
        localStorage.removeItem('bh_admin_auth');
        showToast('Вы вышли из админ-панели');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 400);
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    function setupEventListeners() {
        // Admin Auth Listeners
        if (dom.formAdminLogin) dom.formAdminLogin.addEventListener('submit', handleAdminLogin);
        if (dom.btnAdminLogout) dom.btnAdminLogout.addEventListener('click', handleAdminLogout);

        // Tab switching
        dom.tabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });

        // Orders Period filter
        dom.ordersPeriodFilter.addEventListener('click', e => {
            const btn = e.target.closest('.period-btn');
            if (!btn) return;
            ordersPeriod = btn.dataset.period;
            dom.ordersPeriodFilter.querySelectorAll('.period-btn').forEach(b => {
                b.classList.toggle('period-btn--active', b.dataset.period === ordersPeriod);
            });
            renderOrders();
        });

        // Orders List actions (accept / cancel)
        dom.ordersList.addEventListener('click', e => {
            const btn = e.target.closest('.btn[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            const id = btn.dataset.id;
            if (action === 'accept') updateOrderStatus(id, 'accepted');
            if (action === 'cancel') updateOrderStatus(id, 'cancelled');
        });

        // Revenue Period filter
        dom.revenuePeriodFilter.addEventListener('click', e => {
            const btn = e.target.closest('.period-btn');
            if (!btn) return;
            revenuePeriod = btn.dataset.period;
            dom.revenuePeriodFilter.querySelectorAll('.period-btn').forEach(b => {
                b.classList.toggle('period-btn--active', b.dataset.period === revenuePeriod);
            });
            renderRevenue();
        });

        // Positions Categories
        dom.positionsCategoryNav.addEventListener('click', e => {
            const btn = e.target.closest('.menu__category-btn');
            if (!btn) return;
            activeCategory = btn.dataset.category;
            renderPositionsCategories();
            renderPositionsGrid();
        });

        // Add Category & Position listeners
        if (dom.btnOpenAddCategory) dom.btnOpenAddCategory.addEventListener('click', openAddCategoryModal);
        if (dom.btnCloseAddCategory) dom.btnCloseAddCategory.addEventListener('click', closeAddCategoryModal);
        if (dom.addCategoryOverlay) dom.addCategoryOverlay.addEventListener('click', closeAddCategoryModal);
        if (dom.formAddCategory) dom.formAddCategory.addEventListener('submit', handleAddCategory);
        if (dom.btnAddPosition) dom.btnAddPosition.addEventListener('click', handleAddPosition);

        // Positions Grid actions (save, delete, pick image)
        dom.positionsGrid.addEventListener('click', e => {
            const saveBtn = e.target.closest('[data-action="save-pos"]');
            if (saveBtn) {
                savePosition(saveBtn.dataset.id);
                return;
            }

            const deleteBtn = e.target.closest('[data-action="delete-pos"]');
            if (deleteBtn) {
                deletePosition(deleteBtn.dataset.id);
                return;
            }

            const imgBtn = e.target.closest('[data-action="pick-image"]');
            if (imgBtn) {
                openImagePicker(imgBtn.dataset.id);
                return;
            }
        });

        // Image Picker Modal
        dom.btnCloseImagePicker.addEventListener('click', closeImagePicker);
        dom.imagePickerOverlay.addEventListener('click', closeImagePicker);

        dom.imagePickerGrid.addEventListener('click', e => {
            const option = e.target.closest('.image-option');
            if (option) {
                selectImageForPosition(option.dataset.file);
            }
        });

        dom.btnRemovePhoto.addEventListener('click', removeImageForPosition);

        // Escape key closes modals
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                closeImagePicker();
                closeAddCategoryModal();
            }
        });
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
