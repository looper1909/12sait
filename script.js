// === ДАННЫЕ ===
let cart = JSON.parse(localStorage.getItem('photoCart')) || [];
const lenses = [
    { name: "Sony 50mm f/1.8", focal: "50mm", aperture: "f/1.8", weight: "186g", price: "21 990 ₽" },
    { name: "Canon RF 50mm f/1.8", focal: "50mm", aperture: "f/1.8", weight: "160g", price: "19 500 ₽" },
    { name: "Sigma 35mm f/1.4", focal: "35mm", aperture: "f/1.4", weight: "665g", price: "75 000 ₽" },
    { name: "Tamron 28-75mm", focal: "28-75mm", aperture: "f/2.8", weight: "540g", price: "82 000 ₽" }
];

// === ФУНКЦИИ КОРЗИНЫ ===
function updateCartUI() {
    const badge = document.getElementById('cartCount');
    if (badge) badge.innerText = cart.length;
    localStorage.setItem('photoCart', JSON.stringify(cart));
}

window.deleteItem = (index) => {
    cart.splice(index, 1);
    updateCartUI();
    renderCartList();
};

function renderCartList() {
    const list = document.getElementById('cartItemList');
    const btn = document.getElementById('checkoutBtn');
    if (!list) return;

    list.innerHTML = cart.length ? '' : '<li style="justify-content:center">Корзина пуста</li>';
    cart.forEach((item, i) => {
        list.innerHTML += `<li><span>${item}</span><span onclick="deleteItem(${i})" style="color:red;cursor:pointer">✖</span></li>`;
    });
    if (btn) btn.style.display = cart.length ? 'block' : 'none';
}

// === ОСНОВНАЯ ЛОГИКА (DOMContentLoaded) ===
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    // 1. Модальное окно корзины
    const modal = document.getElementById('cartModal');
    const cartIcon = document.querySelector('.cart-icon');
    const closeBtn = document.querySelector('.close-modal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (cartIcon) cartIcon.onclick = () => { renderCartList(); modal.style.display = 'block'; };
    if (closeBtn) closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    if (checkoutBtn) {
        checkoutBtn.onclick = () => {
            alert('Свяжемся с вами в течении 10 минут');
            cart = [];
            updateCartUI();
            modal.style.display = 'none';
        };
    }

    // 2. Добавление в корзину (на всех страницах)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const card = e.target.closest('.product-card');
            const name = card.querySelector('h3').innerText;
            cart.push(name);
            updateCartUI();
        }
    });

    // 3. Сравнение объективов (на главной)
    const s1 = document.getElementById('lens1Select');
    const s2 = document.getElementById('lens2Select');
    const tableCont = document.getElementById('compareTableContainer');

    if (s1 && s2 && tableCont) {
        lenses.forEach((l, i) => {
            s1.add(new Option(l.name, i));
            s2.add(new Option(l.name, i));
        });
        s2.selectedIndex = 1;

        const drawTable = () => {
            const l1 = lenses[s1.value], l2 = lenses[s2.value];
            tableCont.innerHTML = `
                <table class="compare-table">
                    <tr><td style="color:#888">Вес</td><td>${l1.weight}</td><td>${l2.weight}</td></tr>
                    <tr><td style="color:#888">Диафрагма</td><td>${l1.aperture}</td><td>${l2.aperture}</td></tr>
                    <tr><td style="color:#888">Цена</td><td style="color:green"><b>${l1.price}</b></td><td style="color:green"><b>${l2.price}</b></td></tr>
                </table>`;
        };
        s1.onchange = drawTable; s2.onchange = drawTable;
        drawTable();
    }

    // 4. Фильтры каталога (если есть список)
    const filters = document.querySelectorAll('#filterList li');
    if (filters.length) {
        filters.forEach(f => {
            f.onclick = () => {
                const cat = f.getAttribute('data-cat');
                filters.forEach(el => el.classList.remove('active-filter'));
                f.classList.add('active-filter');
                document.querySelectorAll('.product-card').forEach(card => {
                    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'block' : 'none';
                });
            };
        });
    }

    // 5. Подписка (Скидка)
    const subBtn = document.getElementById('subscribeBtn');
    if (subBtn) {
        subBtn.onclick = () => {
            const email = document.getElementById('subEmail').value;
            if (email.includes('@')) {
                alert(`Спасибо! Промокод на скидку отправлен на ${email}`);
                document.getElementById('subEmail').value = '';
            } else {
                alert('Введите корректный Email');
            }
        };
    }

    // 6. Табы и Год
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.tab-btn, .tab-pane').forEach(el => el.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        };
    });

    const yr = document.getElementById('currentYear');
    if (yr) yr.innerText = new Date().getFullYear();
});
