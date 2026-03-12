// Custom Table Order Management
let currentConfig = {
    size: null,
    basePrice: 0,
    topColor: null,
    legColor: null,
    wireHoles: 'no',
    frontCover: 'no',
    coverPrice: 0,
    deliveryType: 'colombo',
    deliveryPrice: 2000
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    setupColorSelectors();
    setupEventListeners();
    updatePriceSummary();
    
    // Auto-fill customer details if logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('customer-name').value = currentUser.name || '';
        document.getElementById('customer-contact').value = currentUser.phone || '';
    }
});

// Setup color selector interactions
function setupColorSelectors() {
    // Table top color
    document.querySelectorAll('.color-option[data-color]').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option[data-color]').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            currentConfig.topColor = this.dataset.color;
            document.getElementById('table-top-color').value = this.dataset.color;
            updatePriceSummary();
        });
    });

    // Table leg color
    document.querySelectorAll('.color-option[data-leg-color]').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.color-option[data-leg-color]').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            currentConfig.legColor = this.dataset.legColor;
            document.getElementById('table-leg-color').value = this.dataset.legColor;
            updatePriceSummary();
        });
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Table size
    document.getElementById('table-size').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        currentConfig.size = this.value;
        currentConfig.basePrice = parseInt(selectedOption.dataset.price) || 0;
        updatePriceSummary();
    });

    // Wire holes
    document.querySelectorAll('input[name="wire-holes"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentConfig.wireHoles = this.value;
            updatePriceSummary();
        });
    });

    // Front cover
    document.querySelectorAll('input[name="front-cover"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentConfig.frontCover = this.value;
            currentConfig.coverPrice = parseInt(this.dataset.price) || 0;
            updatePriceSummary();
        });
    });

    // Delivery type
    document.querySelectorAll('input[name="delivery-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            currentConfig.deliveryType = this.value;
            currentConfig.deliveryPrice = parseInt(this.dataset.price) || 0;
            updatePriceSummary();
        });
    });

    // Form submission
    document.getElementById('custom-table-form').addEventListener('submit', handleFormSubmit);
}

// Update price summary
function updatePriceSummary() {
    const basePrice = currentConfig.basePrice;
    const coverPrice = currentConfig.coverPrice;
    const deliveryPrice = currentConfig.deliveryPrice;
    const totalPrice = basePrice + coverPrice + deliveryPrice;

    document.getElementById('base-price').textContent = basePrice.toLocaleString();
    document.getElementById('cover-price').textContent = coverPrice.toLocaleString();
    document.getElementById('delivery-price').textContent = deliveryPrice.toLocaleString();
    document.getElementById('total-price').textContent = totalPrice.toLocaleString();
    document.getElementById('final-price').textContent = totalPrice.toLocaleString();

    updateConfigSummary();
}

// Update configuration summary
function updateConfigSummary() {
    const summaryDiv = document.getElementById('config-summary');
    
    if (!currentConfig.size || !currentConfig.topColor || !currentConfig.legColor) {
        summaryDiv.innerHTML = '<em>Select all required options to see your configuration</em>';
        return;
    }

    const colorNames = {
        'jungle-teak': 'Jungle Teak',
        'white': 'White',
        'black': 'Black',
        'american-white': 'American White'
    };

    const deliveryNames = {
        'colombo': 'Colombo District (Rs 2,000)',
        'other-district': 'Other Districts (Rs 4,000)',
        'factory-pickup': 'Factory Pickup (Free)'
    };

    let summary = `
        <div class="small">
            <strong>Size:</strong> ${currentConfig.size}<br>
            <strong>Top Color:</strong> ${colorNames[currentConfig.topColor]}<br>
            <strong>Leg Color:</strong> ${colorNames[currentConfig.legColor]}<br>
            <strong>Wire Holes:</strong> ${currentConfig.wireHoles === 'yes' ? 'Yes' : 'No'}<br>
            <strong>Front Cover:</strong> ${currentConfig.frontCover === 'no' ? 'No' : currentConfig.frontCover + ' inch'}<br>
            <strong>Delivery:</strong> ${deliveryNames[currentConfig.deliveryType]}
        </div>
    `;
    
    summaryDiv.innerHTML = summary;
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate required fields
    if (!currentConfig.size) {
        alert('Please select a table size');
        return;
    }
    if (!currentConfig.topColor) {
        alert('Please select a table top color');
        return;
    }
    if (!currentConfig.legColor) {
        alert('Please select a table leg color');
        return;
    }

    const customerName = document.getElementById('customer-name').value.trim();
    const customerContact = document.getElementById('customer-contact').value.trim();
    const customerAddress = document.getElementById('customer-address').value.trim();
    const description = document.getElementById('description').value.trim();

    if (!customerName || !customerContact || !customerAddress) {
        alert('Please fill in all customer details');
        return;
    }

    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Please login to place a custom order');
        window.location.href = 'login.html';
        return;
    }

    // Create custom order object
    const colorNames = {
        'jungle-teak': 'Jungle Teak',
        'white': 'White',
        'black': 'Black',
        'american-white': 'American White'
    };

    const customOrder = {
        orderId: 'CUSTOM-' + Date.now(),
        orderType: 'custom-table',
        customerName: customerName,
        customerContact: customerContact,
        customerAddress: customerAddress,
        userEmail: currentUser.email,
        configuration: {
            size: currentConfig.size,
            topColor: colorNames[currentConfig.topColor],
            legColor: colorNames[currentConfig.legColor],
            wireHoles: currentConfig.wireHoles,
            frontCover: currentConfig.frontCover,
            deliveryType: currentConfig.deliveryType,
            description: description
        },
        pricing: {
            basePrice: currentConfig.basePrice,
            coverPrice: currentConfig.coverPrice,
            deliveryPrice: currentConfig.deliveryPrice,
            total: currentConfig.basePrice + currentConfig.coverPrice + currentConfig.deliveryPrice
        },
        status: 'pending',
        orderDate: new Date().toISOString()
    };

    // Save to localStorage (you can also send to backend)
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(customOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Also save to backend if server is running
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerName: customerName,
                email: currentUser.email,
                phone: customerContact,
                address: customerAddress,
                city: 'Custom Order',
                zipcode: '00000',
                items: [{
                    productId: 'CUSTOM',
                    name: `Custom Table (${currentConfig.size})`,
                    price: customOrder.pricing.total,
                    quantity: 1
                }],
                total: customOrder.pricing.total,
                orderDetails: JSON.stringify(customOrder.configuration)
            })
        });

        if (response.ok) {
            console.log('Order saved to backend');
        }
    } catch (error) {
        console.log('Backend not available, order saved locally only');
    }

    // Show success message
    alert(`Custom table order placed successfully!\n\nOrder ID: ${customOrder.orderId}\nTotal: Rs ${customOrder.pricing.total.toLocaleString()}\n\nYou can track your order in the Orders page.`);

    // Redirect to orders page
    window.location.href = 'orders.html';
}

// Get current user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}
