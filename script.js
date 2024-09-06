// scripts.js

// Function to update the cart with selected medicines
function updateCart() {
    const form = document.getElementById('orderForm');
    const cartTableBody = document.querySelector('#cartTable tbody');
    const totalPriceElement = document.getElementById('totalPrice');
    
    cartTableBody.innerHTML = ''; // Clear previous cart items

    const selectedMedicines = form.querySelectorAll('input[name="medicine"]:checked');
    let totalPrice = 0; // Initialize total price

    selectedMedicines.forEach(function(medicine) {
        const medicineName = medicine.value;
        const medicinePrice = parseFloat(medicine.dataset.price);
        const quantityInput = form.querySelector(`input[name="${medicineName}_qty"]`);
        const quantity = parseInt(quantityInput.value);

        if (!isNaN(quantity) && quantity > 0) {
            const itemTotalPrice = medicinePrice * quantity;
            totalPrice += itemTotalPrice; // Add to total price

            // Add row to cart table
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${medicineName}</td>
                <td>${quantity}</td>
                <td>$${itemTotalPrice.toFixed(2)}</td>
            `;
            cartTableBody.appendChild(row);
        }
    });

    // Update total price in the table
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Add items to cart when "Add to Cart" button is clicked
document.getElementById('addToCartBtn').addEventListener('click', updateCart);

// Save current order as a favorite
document.getElementById('addToFavoritesBtn').addEventListener('click', function() {
    const form = document.getElementById('orderForm');
    const selectedMedicines = form.querySelectorAll('input[name="medicine"]:checked');

    const favoriteOrder = [];
    selectedMedicines.forEach(function(medicine) {
        const medicineName = medicine.value;
        const medicinePrice = parseFloat(medicine.dataset.price);
        const quantityInput = form.querySelector(`input[name="${medicineName}_qty"]`);
        const quantity = parseInt(quantityInput.value);

        if (!isNaN(quantity) && quantity > 0) {
            favoriteOrder.push({
                name: medicineName,
                price: medicinePrice,
                quantity: quantity
            });
        }
    });

    // Save favorite order in localStorage
    localStorage.setItem('favoriteOrder', JSON.stringify(favoriteOrder));
    alert('Order has been added to favorites.');
});

// Apply favorite order to form and cart
document.getElementById('applyFavoritesBtn').addEventListener('click', function() {
    const favoriteOrder = JSON.parse(localStorage.getItem('favoriteOrder'));

    if (favoriteOrder) {
        // Clear current selections
        const form = document.getElementById('orderForm');
        form.reset(); // Uncheck all boxes and clear quantities

        // Set the form and cart based on the favorite order
        favoriteOrder.forEach(function(item) {
            const checkbox = form.querySelector(`input[name="medicine"][value="${item.name}"]`);
            const quantityInput = form.querySelector(`input[name="${item.name}_qty"]`);

            if (checkbox && quantityInput) {
                checkbox.checked = true;
                quantityInput.value = item.quantity;
            }
        });

        // Update the cart based on the favorite order
        updateCart();
    } else {
        alert('No favorite order found.');
    }
});

// Checkout functionality
document.getElementById('checkoutBtn').addEventListener('click', function() {
    const cartTableBody = document.querySelector('#cartTable tbody');
    if (cartTableBody.children.length === 0) {
        alert('Your cart is empty! Please add items to the cart before checking out.');
    } else {
        const selectedItems = [];
        const rows = cartTableBody.querySelectorAll('tr');
        
        rows.forEach(function(row) {
            const name = row.cells[0].textContent;
            const quantity = parseInt(row.cells[1].textContent);
            const totalPrice = parseFloat(row.cells[2].textContent.replace('$', ''));
            selectedItems.push({ name, quantity, totalPrice });
        });

        const totalPrice = document.getElementById('totalPrice').textContent.replace('$', '');
        
        // Save the order details in localStorage
        const order = {
            items: selectedItems,
            totalPrice: parseFloat(totalPrice)
        };

        localStorage.setItem('order', JSON.stringify(order));

        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }
});
