// Wallpapers Page JavaScript

let allWallpapers = [];

document.addEventListener('DOMContentLoaded', function() {
    loadWallpapers();
});

function loadWallpapers() {
    const wallpapers = [
        {
            id: 101,
            name: 'Modern Geometric Pattern',
            style: 'geometric',
            price: 35.99,
            description: 'Contemporary geometric wallpaper design',
            stock: 20,
            image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
            rating: 4.5
        },
        {
            id: 102,
            name: 'Vintage Floral Elegance',
            style: 'vintage',
            price: 45.99,
            description: 'Classic floral pattern with vintage charm',
            stock: 15,
            image: 'https://images.unsplash.com/photo-1584854382692-b2dc85fc93ff?w=400&h=400&fit=crop',
            rating: 4.8
        },
        {
            id: 103,
            name: 'Minimalist Abstract',
            style: 'minimalist',
            price: 29.99,
            description: 'Clean and simple abstract design',
            stock: 25,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
            rating: 4.3
        },
        {
            id: 104,
            name: 'Nature Inspired Green',
            style: 'floral',
            price: 39.99,
            description: 'Fresh botanical design with natural colors',
            stock: 18,
            image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
            rating: 4.6
        },
        {
            id: 105,
            name: 'Industrial Modern',
            style: 'modern',
            price: 55.99,
            description: 'Contemporary industrial style wallpaper',
            stock: 12,
            image: 'https://images.unsplash.com/photo-1540932424986-b06535cf128f?w=400&h=400&fit=crop',
            rating: 4.4
        },
        {
            id: 106,
            name: 'Damask Vintage',
            style: 'vintage',
            price: 42.99,
            description: 'Traditional damask pattern',
            stock: 16,
            image: 'https://images.unsplash.com/photo-1584854382692-b2dc85fc93ff?w=400&h=400&fit=crop',
            rating: 4.7
        },
        {
            id: 107,
            name: 'Hexagon Modern',
            style: 'geometric',
            price: 38.99,
            description: 'Modern hexagonal pattern design',
            stock: 22,
            image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
            rating: 4.5
        },
        {
            id: 108,
            name: 'Tropical Paradise',
            style: 'floral',
            price: 49.99,
            description: 'Tropical plants and flowers design',
            stock: 14,
            image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop',
            rating: 4.8
        },
        {
            id: 109,
            name: 'Minimal Line Art',
            style: 'minimalist',
            price: 32.99,
            description: 'Simple line art minimalist design',
            stock: 28,
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
            rating: 4.2
        },
        {
            id: 110,
            name: 'Contemporary Stripe',
            style: 'modern',
            price: 34.99,
            description: 'Modern striped wallpaper design',
            stock: 20,
            image: 'https://images.unsplash.com/photo-1540932424986-b06535cf128f?w=400&h=400&fit=crop',
            rating: 4.4
        }
    ];
    
    allWallpapers = wallpapers;
    displayWallpapers(allWallpapers);
}

function displayWallpapers(wallpapers) {
    const grid = document.getElementById('wallpapers-grid');
    
    if (wallpapers.length === 0) {
        grid.innerHTML = '<div class="col-12 alert alert-info">No wallpapers match your filters</div>';
        return;
    }
    
    grid.innerHTML = '';
    
    wallpapers.forEach(wallpaper => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card h-100 shadow-sm hover-card">
                <div class="position-relative overflow-hidden" style="height: 250px;">
                    <img src="${wallpaper.image}" class="card-img-top w-100 h-100" style="object-fit: cover;" alt="${wallpaper.name}">
                    <div class="position-absolute top-0 end-0 p-2">
                        <span class="badge bg-success">${wallpaper.style}</span>
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${wallpaper.name}</h5>
                    <p class="card-text text-muted small">${wallpaper.description}</p>
                    
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="h5 mb-0 text-primary fw-bold">$${wallpaper.price.toFixed(2)}</span>
                            <span class="text-warning">
                                ⭐ ${wallpaper.rating}
                            </span>
                        </div>
                        <small class="text-muted d-block mb-2">In Stock: ${wallpaper.stock}</small>
                        <button class="btn btn-primary w-100" onclick="addToCart({
                            id: ${wallpaper.id},
                            name: '${wallpaper.name}',
                            price: ${wallpaper.price},
                            image: '${wallpaper.image}',
                            category: 'wallpaper'
                        })">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterWallpapers() {
    const styleFilter = document.getElementById('style-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    
    let filtered = allWallpapers;
    
    // Filter by style
    if (styleFilter) {
        filtered = filtered.filter(w => w.style === styleFilter);
    }
    
    // Filter by price
    if (priceFilter) {
        const [minStr, maxStr] = priceFilter.split('-');
        const min = parseInt(minStr);
        const max = maxStr ? parseInt(maxStr) : Infinity;
        
        filtered = filtered.filter(w => w.price >= min && w.price <= max);
    }
    
    displayWallpapers(filtered);
}

function resetFilters() {
    document.getElementById('style-filter').value = '';
    document.getElementById('price-filter').value = '';
    displayWallpapers(allWallpapers);
}
