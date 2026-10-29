
const products = [
    {
        id: 1,
        name: "Smartphone",
        category: "Electronics",
        price: 15999,
        rating: 4.8,
        image: "https://placehold.co/300x200?text=Smartphone"
    },

    {
        id: 2,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        rating: 4.5,
        image: "https://placehold.co/300x200?text=Headphones"
    },

    {
        id: 3,
        name: "Smart Watch",
        category: "Electronics",
        price: 3299,
        rating: 4.6,
        image: "https://placehold.co/300x200?text=Smart+Watch"
    },

    {
        id: 4,
        name: "Men T-Shirt",
        category: "Fashion",
        price: 799,
        rating: 4.3,
        image: "https://placehold.co/300x200?text=T-Shirt"
    },

    {
        id: 5,
        name: "Sneakers",
        category: "Fashion",
        price: 1899,
        rating: 4.4,
        image: "https://placehold.co/300x200?text=Sneakers"
    },

    {
        id: 6,
        name: "Wrist Watch",
        category: "Accessories",
        price: 2499,
        rating: 4.7,
        image: "https://placehold.co/300x200?text=Watch"
    }
];

let cart = [];
let wishlist = [];

let responses = JSON.parse(
    localStorage.getItem("responses") || "[]"
);

let couponApplied = false;

// DISPLAY PRODUCTS

function displayProducts(items) {

    const container = document.getElementById("products");

    container.innerHTML = "";

    items.forEach(product => {

        container.innerHTML += `

            <div class="product">

                <img src="${product.image}" alt="${product.name}">

                <h3>${product.name}</h3>

                <p>${product.category}</p>

                <p class="price">₹${product.price}</p>

                <p>⭐ ${product.rating}/5</p>

                <button onclick="addToCart(${product.id})">
                    Add to Cart
                </button>

                <button onclick="addToWishlist(${product.id})">
                    ❤️ Wishlist
                </button>

            </div>

        `;

    });

}

// ADD TO CART

function addToCart(id) {

    const product = products.find(p => p.id === id);

    const existing = cart.find(p => p.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();

    alert("Product added successfully!");

}

// UPDATE CART

function updateCart() {

    const cartItems = document.getElementById("cartItems");

    cartItems.innerHTML = "";

    let total = 0;

    let count = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        count += item.quantity;

        cartItems.innerHTML += `

            <div class="cart-item">

                <span>
                    ${item.name}
                    (₹${item.price}) × ${item.quantity}
                </span>

                <div>
                    <button onclick="changeQuantity(${index}, -1)">−</button>

                    <button onclick="changeQuantity(${index}, 1)">+</button>

                    <button onclick="removeItem(${index})">Remove</button>
                </div>

            </div>

        `;

    });

    if (couponApplied) {
        total = total * 0.90;
    }

    document.getElementById("total").innerText =
        Math.round(total);

    document.getElementById("cartCount").innerText = count;

}

// CHANGE QUANTITY

function changeQuantity(index, amount) {

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();

}

// REMOVE ITEM

function removeItem(index) {

    cart.splice(index, 1);

    updateCart();

}

// SHOW CART

function showCart() {

    document.querySelector(".cart-section")
        .scrollIntoView({ behavior: "smooth" });

}

// WISHLIST

function addToWishlist(id) {

    const product = products.find(p => p.id === id);

    if (!wishlist.some(p => p.id === id)) {
        wishlist.push(product);
    }

    alert("Added to Wishlist!");

    displayWishlist();

}

function displayWishlist() {

    const container = document.getElementById("wishlistItems");

    container.innerHTML = "";

    wishlist.forEach(item => {

        container.innerHTML += `
            <div class="cart-item">
                <span>${item.name} - ₹${item.price}</span>
                <button onclick="removeWishlist(${item.id})">
                    Remove
                </button>
            </div>
        `;

    });

}

function showWishlist() {

    document.querySelector(".cart-section:nth-of-type(2)")
        .scrollIntoView({ behavior: "smooth" });

}

function removeWishlist(id) {

    wishlist = wishlist.filter(p => p.id !== id);

    displayWishlist();

}

// PRODUCT FILTER

function filterProducts(category) {

    if (category === "All") {
        displayProducts(products);
    } else {

        const filtered = products.filter(
            p => p.category === category
        );

        displayProducts(filtered);

    }

}

// SEARCH

document.getElementById("search")
    .addEventListener("input", function() {

        const value = this.value.toLowerCase();

        const filtered = products.filter(p =>
            p.name.toLowerCase().includes(value)
        );

        displayProducts(filtered);

    });

// COUPON

function applyCoupon() {

    const code = document.getElementById("coupon")
        .value.trim().toUpperCase();

    if (code === "EXPO10") {

        couponApplied = true;

        updateCart();

        alert("10% discount applied!");

    } else {

        alert("Invalid coupon code!");

    }

}

// CHECKOUT

function checkout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const total = document.getElementById("total").innerText;

    alert(
        "Demo Order Confirmed!\n" +
        "Total Amount: ₹" + total +
        "\nThank you for shopping with ShopEase."
    );

    cart = [];

    couponApplied = false;

    document.getElementById("coupon").value = "";

    updateCart();

}

// SURVEY SUBMISSION

document.getElementById("surveyForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const response = {

            rating: Number(document.getElementById("rating").value),

            factor: document.getElementById("factor").value,

            trust: document.getElementById("trust").value,

            purchase: document.getElementById("purchase").value

        };

        responses.push(response);

        localStorage.setItem(
            "responses",
            JSON.stringify(responses)
        );

        document.getElementById("feedbackMessage")
            .innerText = "Thank you! Your feedback has been recorded.";

        this.reset();

        updateDashboard();

    });

// ANALYTICS DASHBOARD

function showDashboard() {

    document.getElementById("dashboard")
        .scrollIntoView({ behavior: "smooth" });

    updateDashboard();

}

let factorChart = null;
let ratingChart = null;

function updateDashboard() {

    const totalResponses = responses.length;

    document.getElementById("responseCount")
        .innerText = totalResponses;

    let average = 0;

    if (totalResponses > 0) {

        average = responses.reduce(
            (sum, item) => sum + item.rating, 0
        ) / totalResponses;

    }

    document.getElementById("averageRating")
        .innerText = average.toFixed(1) + "/5";

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("totalSales")
        .innerText = "₹" + total;

    const factors = [
        "Price and Discounts",
        "Customer Reviews",
        "Product Quality",
        "Brand Reputation",
        "Easy Application"
    ];

    const factorCounts = factors.map(factor =>
        responses.filter(r => r.factor === factor).length
    );

    const ratings = [1, 2, 3, 4, 5].map(rating =>
        responses.filter(r => r.rating === rating).length
    );

    if (factorChart) factorChart.destroy();

    if (ratingChart) ratingChart.destroy();

    if (typeof Chart === "undefined") return;

    factorChart = new Chart(
        document.getElementById("factorChart"),
        {
            type: "bar",

            data: {
                labels: factors,

                datasets: [{
                    label: "Customer Responses",

                    data: factorCounts,

                    backgroundColor: "#2563eb"
                }]
            },

            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                    }
                }
            }
        }
    );

    ratingChart = new Chart(
        document.getElementById("ratingChart"),
        {
            type: "doughnut",

            data: {
                labels: [
                    "1 Star",
                    "2 Stars",
                    "3 Stars",
                    "4 Stars",
                    "5 Stars"
                ],

                datasets: [{
                    data: ratings,

                    backgroundColor: [
                        "#ef4444",
                        "#f97316",
                        "#eab308",
                        "#22c55e",
                        "#15803d"
                    ]
                }]
            },

            options: {
                responsive: true
            }
        }
    );

}

// EXPORT DATA TO CSV

function exportData() {

    if (responses.length === 0) {
        alert("No survey responses available.");
        return;
    }

    let csv = "Rating,Purchase Factor,Trust,Purchase Intention\n";

    responses.forEach(r => {

        csv += [
            r.rating,
            r.factor,
            r.trust,
            r.purchase
        ].map(value =>
            '"' + String(value).replaceAll('"', '""') + '"'
        ).join(",") + "\n";

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "ShopEase-Survey-Data.csv";

    link.click();

    URL.revokeObjectURL(link.href);

}

// SCROLL TO PRODUCTS

function scrollToProducts() {

    document.getElementById("shopSection")
        .scrollIntoView({ behavior: "smooth" });

}

// INITIAL LOAD

displayProducts(products);

updateCart();

displayWishlist();

updateDashboard();
