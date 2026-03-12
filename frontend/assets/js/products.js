// Products Page JavaScript

let allProducts = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupFilters();
});

function loadProducts() {
    // Load products from backend API
    fetch(`${API_URL}/products`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                allProducts = data;
            } else {
                // Fallback to sample data if API returns unexpected format
                allProducts = data || [];
            }
            filteredProducts = [...allProducts];
            displayProducts();
        })
        .catch(error => {
            console.error('Error loading products:', error);
            // Fallback to sample products if API is unavailable
            allProducts = [
                {
                    id: 1,
                    name: 'Modern Dining Table',
                    category: 'table',
                    price: 45000,
                    description: 'Sleek modern dining table with glass top',
                    image: 'https://m.media-amazon.com/images/I/912KbGW-BiL.jpg'
                },
                {
                    id: 2,
                    name: 'Executive Desk',
                    category: 'table',
                    price: 68000,
                    description: 'Premium wood desk for home office',
                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjxKgZ6oYPkpoEpM1BlyBEMuXQLzXUW6W21w&s'
                },
                {
                    id: 3,
                    name: 'Coffee Table',
                    category: 'table',
                    price: 22000,
                    description: 'Minimalist coffee table with metal legs',
                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBTl7lA9bLD3zWV8meHHshkAccZnAM8eMMKA&s'
                },
                {
                    id: 4,
                    name: 'Leather Office Chair',
                    category: 'chair',
                    price: 30000,
                    description: 'Ergonomic leather chair with lumbar support',
                    image: 'https://m.media-amazon.com/images/I/81gKsqmM9gL._AC_UF894,1000_QL80_.jpg'
                },
                {
                    id: 5,
                    name: 'Dining Chair Set',
                    category: 'chair',
                    price: 19500,
                    description: 'Set of 4 modern dining chairs',
                    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOnd4KTRwTjgGNAvL-nnuAMRtYPrV3OVJ43w&s'
                },
                {
                    id: 6,
                    name: 'Lounge Chair',
                    category: 'chair',
                    price: 37500,
                    description: 'Comfortable lounge chair with ottoman',
                    image: 'https://m.media-amazon.com/images/I/61NFXfH3BBL._AC_UF894,1000_QL80_.jpg'
                }
            ];
            filteredProducts = [...allProducts];
            displayProducts();
        });
}

function displayProducts() {
    const container = document.getElementById('products-list');
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="alert alert-info">No products found.</p></div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-6 col-lg-4 mb-4';
        productCard.innerHTML = `
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted">${product.description}</p>
                    <p class="card-text fw-bold">${formatCurrency(product.price)}</p>
                    <button class="btn btn-primary btn-sm" onclick="addToCart({id: ${product.id}, name: '${product.name}', price: ${product.price}, image: '${product.image}'})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

function setupFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-category');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const selectedCategories = [];
    document.querySelectorAll('.filter-category:checked').forEach(checkbox => {
        selectedCategories.push(checkbox.value);
    });
    
    if (selectedCategories.length === 0) {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }
    
    displayProducts();
}

function clearFilters() {
    document.querySelectorAll('.filter-category').forEach(checkbox => {
        checkbox.checked = false;
    });
    filteredProducts = [...allProducts];
    displayProducts();
}
