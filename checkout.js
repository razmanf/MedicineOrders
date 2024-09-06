document.addEventListener('DOMContentLoaded', function() {
    // Load order details from localStorage (or other storage)
    const order = JSON.parse(localStorage.getItem('order'));
    const orderSummaryDiv = document.getElementById('orderSummary');
    const orderTotalElement = document.getElementById('orderTotal');

    let total = 0;

    // Populate the order summary
    order.items.forEach(function(item) {
        const orderItem = document.createElement('div');
        orderItem.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>$${(item.totalPrice).toFixed(2)}</span>
        `;
        orderSummaryDiv.appendChild(orderItem);
        total += item.totalPrice;
    });

    // Update total price
    orderTotalElement.textContent = `Total: $${total.toFixed(2)}`;

    // Handle form submission and payment
    const checkoutForm = document.getElementById('checkoutForm');
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validate form fields
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        if (name && email && address && cardNumber && expiryDate && cvv) {
            // Hide the form and show the thank you message
            checkoutForm.style.display = 'none';
            const thankYouMessage = document.getElementById('thankYouMessage');
            thankYouMessage.style.display = 'block';

            // Generate a random delivery date (3-5 days from now)
            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            document.getElementById('deliveryDate').textContent = deliveryDate.toLocaleDateString(undefined, options);
        } else {
            alert('Please fill out all fields.');
        }
    });
});