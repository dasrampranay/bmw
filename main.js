document.addEventListener('DOMContentLoaded', () => {

    // --- Data ---
    const cars = [
        {
            id: 'm4',
            name: 'BMW M4 Competition',
            desc: 'The benchmark for high-performance sports cars. TwinPower Turbo inline 6-cylinder engine delivering 503 hp.',
            price: '₹1,53,00,000',
            image: 'assets/bmw_m4.png'
        },
        {
            id: 'x5',
            name: 'BMW X5',
            desc: 'The legendary Sports Activity Vehicle. Perfect balance of luxurious comfort and undeniable performance.',
            price: '₹95,00,000',
            image: 'assets/bmw_x5.png'
        },
        {
            id: 'i4',
            name: 'BMW i4 M50',
            desc: 'All-electric Gran Coupe. Exhilarating power meets eco-conscious engineering with up to 536 hp.',
            price: '₹77,50,000',
            image: 'assets/bmw_i4.png'
        },
        {
            id: 'm8',
            name: 'BMW M8 Gran Coupe',
            desc: 'The pinnacle of luxury and performance. A dominant 617 hp V8 engine with a commanding presence.',
            price: '₹2,44,00,000',
            image: 'assets/bmw_m8.png'
        },
        {
            id: 'z4',
            name: 'BMW Z4 Roadster',
            desc: 'Classic open-top driving experience redesigned for modern thrills. Top-down freedom and agility.',
            price: '₹90,90,000',
            image: 'assets/bmw_z4.png'
        }
    ];

    // --- State ---
    let garage = JSON.parse(localStorage.getItem('bmw_garage')) || [];
    let selectedCarForPurchase = null;
    let currentConfig = {
        paint: { name: 'Tanzanite Blue', price: 0 },
        wheels: { name: '19 inch Standard', price: 0 },
        interior: { name: 'Black Sensatec', price: 0 }
    };

    // --- DOM Elements ---
    const linkShowroom = document.getElementById('link-showroom');
    const linkGarage = document.getElementById('link-garage');
    const viewShowroom = document.getElementById('view-showroom');
    const viewGarage = document.getElementById('view-garage');
    
    const showroomGrid = document.getElementById('showroom-grid');
    const garageGrid = document.getElementById('garage-grid');
    const emptyGarage = document.getElementById('empty-garage');
    const garageCount = document.getElementById('garage-count');
    const btnToShowroom = document.getElementById('btn-to-showroom');

    // Modal elements
    const purchaseModal = document.getElementById('purchase-modal');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const btnConfirmPurchase = document.getElementById('btn-confirm-purchase');

    const paintOptions = document.querySelectorAll('#paint-options .color-btn');
    const paintLabel = document.getElementById('paint-label');
    const wheelOptions = document.querySelectorAll('#wheel-options .option-btn');
    const interiorSelect = document.getElementById('interior-select');

    // Toast
    const toast = document.getElementById('toast');

    // --- Initialize ---
    function init() {
        if (showroomGrid) renderShowroom();
        if (garageCount) updateGarageView();
    }

    // --- Navigation Logic ---
    function switchView(viewId) {
        if (!viewShowroom || !viewGarage) {
            // If on a different page, navigate to index.html with an anchor/param or just go to index.html
            window.location.href = viewId === 'garage' ? 'index.html#garage' : 'index.html';
            return;
        }

        // Toggle active links
        if (linkShowroom) linkShowroom.classList.toggle('active', viewId === 'showroom');
        if (linkGarage) linkGarage.classList.toggle('active', viewId === 'garage');

        // Toggle views
        if (viewId === 'showroom') {
            viewShowroom.classList.add('active-view');
            viewGarage.classList.remove('active-view');
        } else {
            viewGarage.classList.add('active-view');
            viewShowroom.classList.remove('active-view');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Check URL hash for direct garage link
    if (window.location.hash === '#garage') {
        setTimeout(() => switchView('garage'), 100);
    }

    if (linkShowroom) linkShowroom.addEventListener('click', (e) => { e.preventDefault(); switchView('showroom'); });
    if (linkGarage) linkGarage.addEventListener('click', (e) => { e.preventDefault(); switchView('garage'); });
    if (btnToShowroom) btnToShowroom.addEventListener('click', () => switchView('showroom'));

    // --- Rendering Logic ---
    function renderShowroom() {
        showroomGrid.innerHTML = '';
        cars.forEach(car => {
            const card = document.createElement('div');
            card.className = 'car-card';
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${car.image}" alt="${car.name}" class="card-img" />
                </div>
                <div class="card-content">
                    <h3 class="card-title">${car.name}</h3>
                    <p class="card-desc">${car.desc}</p>
                    <div class="card-footer">
                        <span class="car-price">${car.price}</span>
                        <button class="btn btn-primary btn-buy" data-id="${car.id}">Configure</button>
                    </div>
                </div>
            `;
            showroomGrid.appendChild(card);
        });

        // Add event listeners to buy buttons
        document.querySelectorAll('.btn-buy').forEach(btn => {
            btn.addEventListener('click', (e) => openModal(e.target.dataset.id));
        });

        // Configurator Event Listeners
        if (paintOptions.length > 0) {
            paintOptions.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    paintOptions.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    currentConfig.paint.price = parseInt(e.target.dataset.price);
                    currentConfig.paint.name = e.target.dataset.name;
                    paintLabel.textContent = `${currentConfig.paint.name} ` + (currentConfig.paint.price > 0 ? `(+₹${currentConfig.paint.price.toLocaleString('en-IN')})` : '- Included');
                    updateModalPrice();
                });
            });
        }
        
        if (wheelOptions.length > 0) {
            wheelOptions.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    wheelOptions.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    currentConfig.wheels.price = parseInt(e.target.dataset.price);
                    currentConfig.wheels.name = e.target.dataset.name;
                    updateModalPrice();
                });
            });
        }

        if (interiorSelect) {
            interiorSelect.addEventListener('change', (e) => {
                const selectedOption = e.target.options[e.target.selectedIndex];
                currentConfig.interior.price = parseInt(selectedOption.value);
                currentConfig.interior.name = selectedOption.dataset.name;
                updateModalPrice();
            });
        }
    }

    // --- Modal & Purchasing Logic ---
    function updateModalPrice() {
        if (!selectedCarForPurchase) return;
        const basePrice = parseInt(selectedCarForPurchase.price.replace(/[^0-9]/g, ''));
        const totalPrice = basePrice + currentConfig.paint.price + currentConfig.wheels.price + currentConfig.interior.price;
        modalPrice.textContent = '₹' + totalPrice.toLocaleString('en-IN');
    }

    function openModal(carId) {
        selectedCarForPurchase = cars.find(c => c.id === carId);
        if (!selectedCarForPurchase) return;

        // Reset config
        currentConfig = {
            paint: { name: 'Tanzanite Blue', price: 0 },
            wheels: { name: '19 inch Standard', price: 0 },
            interior: { name: 'Black Sensatec', price: 0 }
        };
        
        // Reset UI if elements exist
        if (paintOptions.length) {
            paintOptions.forEach(b => b.classList.remove('active'));
            paintOptions[0].classList.add('active');
            paintLabel.textContent = 'Tanzanite Blue - Included';
        }
        if (wheelOptions.length) {
            wheelOptions.forEach(b => b.classList.remove('active'));
            wheelOptions[0].classList.add('active');
        }
        if (interiorSelect) {
            interiorSelect.selectedIndex = 0;
        }

        modalImg.src = selectedCarForPurchase.image;
        modalTitle.textContent = selectedCarForPurchase.name;
        modalDesc.textContent = selectedCarForPurchase.desc;
        updateModalPrice();
        
        purchaseModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    }

    function closeModal() {
        purchaseModal.classList.remove('active');
        document.body.style.overflow = '';
        selectedCarForPurchase = null;
    }

    modalCloseBtn.addEventListener('click', closeModal);
    purchaseModal.addEventListener('click', (e) => {
        if (e.target === purchaseModal) closeModal();
    });

    btnConfirmPurchase.addEventListener('click', () => {
        if (!selectedCarForPurchase) return;

        // Generate a unique VIN for the garage item
        const vin = 'WBA' + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        const purchasedCar = {
            ...selectedCarForPurchase,
            vin: vin,
            purchaseDate: new Date().toLocaleDateString(),
            config: { ...currentConfig },
            totalPrice: modalPrice.textContent
        };

        garage.push(purchasedCar);
        localStorage.setItem('bmw_garage', JSON.stringify(garage));
        
        updateGarageView();
        closeModal();
        showToast(`Your ${selectedCarForPurchase.name} has been delivered to your garage!`);
    });

    // --- Garage Logic ---
    function updateGarageView() {
        garageCount.textContent = garage.length;

        if (garage.length === 0) {
            emptyGarage.style.display = 'block';
            garageGrid.style.display = 'none';
        } else {
            emptyGarage.style.display = 'none';
            garageGrid.style.display = 'grid';
            
            garageGrid.innerHTML = '';
            // Render backwards so newest is first
            [...garage].reverse().forEach(car => {
                const card = document.createElement('div');
                card.className = 'car-card';
                card.innerHTML = `
                    <div class="card-img-wrapper" style="height: 180px;">
                        <img src="${car.image}" alt="${car.name}" class="card-img" />
                    </div>
                    <div class="card-content">
                        <h3 class="card-title" style="font-size: 1.2rem; margin-bottom: 0.5rem;">${car.name}</h3>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px; border: 1px solid var(--border-color); margin-bottom: 1rem;">
                            <div style="margin-bottom: 3px;"><strong>Paint:</strong> ${car.config ? car.config.paint.name : 'Standard'}</div>
                            <div style="margin-bottom: 3px;"><strong>Wheels:</strong> ${car.config ? car.config.wheels.name : 'Standard'}</div>
                            <div><strong>Interior:</strong> ${car.config ? car.config.interior.name : 'Standard'}</div>
                        </div>
                        <p class="card-desc" style="font-size: 0.85rem; margin-bottom: 0.2rem; color: #fff;">Paid: <strong>${car.totalPrice || car.price}</strong></p>
                        <p class="card-desc" style="font-size: 0.8rem; margin-bottom: 0.2rem;">VIN: ${car.vin}</p>
                        <p class="card-desc" style="font-size: 0.8rem; margin-bottom: 1rem; color: var(--accent-blue-light);">Acquired: ${car.purchaseDate}</p>
                        <button class="btn btn-primary btn-large" style="padding: 10px;" onclick="alert('Starting engine for ${car.name} (Virtual Simulation)')">Start Engine</button>
                    </div>
                `;
                garageGrid.appendChild(card);
            });
        }
    }

    function showToast(message) {
        document.getElementById('toast-message').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Run
    init();
});
