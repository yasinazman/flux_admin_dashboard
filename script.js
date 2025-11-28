/* =========================================
   SECTION 1: GLOBAL VARIABLES & UTILITIES
   ========================================= */

// Global variables to help us track which row or card we are editing
let currentProductCard; 
let currentRow;

/* --- DARK MODE TOGGLE --- */
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-bs-theme');
    const icon = document.getElementById('themeIcon');
    
    // Simple if-else to switch themes
    if (currentTheme === 'dark') {
        html.setAttribute('data-bs-theme', 'light');
        // Change icon to moon
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        html.setAttribute('data-bs-theme', 'dark');
        // Change icon to sun
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

/* =========================================
    SECTION 2: CUSTOMER PAGE 
   ========================================= */

function openEditModal(button) { // Function to open the modal and fill it with data
    
    currentRow = button.closest("tr"); // Find the row (tr) that the button belongs to
    
    // Get values from the table cells
    const name = currentRow.querySelector(".fw-bold").innerText;
    const email = currentRow.cells[1].innerText;
    const phone = currentRow.cells[2].innerText;
    const status = currentRow.querySelector(".badge").innerText;

    // Set values in the form input boxes
    document.getElementById("editName").value = name;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPhone").value = phone;
    document.getElementById("editStatus").value = status;

    // Show the modal
    const myModal = new bootstrap.Modal(document.getElementById('editCustomerModal'));
    myModal.show();
}

// Function to save changes made in the modal
function saveCustomerChanges() {
    // Get new values from the form
    const newName = document.getElementById("editName").value;
    const newEmail = document.getElementById("editEmail").value;
    const newPhone = document.getElementById("editPhone").value;
    const newStatus = document.getElementById("editStatus").value;

    // Update the table row text
    currentRow.querySelector(".fw-bold").innerText = newName;
    currentRow.cells[1].innerText = newEmail;
    currentRow.cells[2].innerText = newPhone;
    
    // Update the Badge color based on status
    const badge = currentRow.querySelector(".badge");
    badge.innerText = newStatus;

    badge.className = "badge rounded-pill px-3 py-2";
    if (newStatus === "Active") {
        badge.classList.add("bg-success-subtle", "text-success");
    } else {
        badge.classList.add("bg-secondary-subtle", "text-secondary");
    }

    // Close the modal manually
    const modalElement = document.getElementById('editCustomerModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
}

// Function to add a new customer to the table
function addNewCustomer() {
    const name = document.getElementById("addName").value;
    const email = document.getElementById("addEmail").value;
    const phone = document.getElementById("addPhone").value;

    if(!name || !email) { alert("Fill required fields!"); return; }

    // Get today's date in "Mon DD, YYYY" format (Optional polish)
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newRow = `
        <tr>
            <td class="text-start">
                <div class="d-flex align-items-center justify-content-start ps-3">
                    <img src="https://ui-avatars.com/api/?name=${name}&background=random&color=fff" class="avatar-img" alt="Avatar">
                    <div class="text-start">
                        <div class="fw-bold">${name}</div>
                        <div class="text-muted small">ID: #NEW</div>
                    </div>
                </div>
            </td>
            
            <td>${email}</td>
            <td>${phone}</td>
            <td><span class="badge bg-success-subtle text-success px-3 py-2 rounded-pill">Active</span></td>
            <td>${date}</td>
            
            <td>
                <div class="d-flex justify-content-center gap-2">
                    <button class="btn btn-sm btn-outline-primary" onclick="openEditModal(this)">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteCustomer(this)">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>`;
    
    document.querySelector("tbody").insertAdjacentHTML('afterbegin', newRow);
    bootstrap.Modal.getInstance(document.getElementById('addCustomerModal')).hide();
    document.getElementById("addCustomerForm").reset();
}

function filterCustomers() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const tableRows = document.querySelectorAll("tbody tr");
    
    tableRows.forEach(function(row) {
        const rowText = row.innerText.toLowerCase();
        
        if (rowText.includes(input)) {
            row.style.display = ""; // Show row
        } else {
            row.style.display = "none"; // Hide row
        }
    });
}

/* --- DELETE FUNCTION --- */
function deleteCustomer(button) {
    if (confirm("Are you sure you want to delete this?")) {
        // Check if it is a row
        const row = button.closest("tr");
        if (row) {
            row.remove();
        } else {
            // If not a row, check if it is a card
            const card = button.closest(".col-md-6");
            if (card) {
                card.remove();
            }
        }
    }
}

/* =========================================
   SECTION 3: PRODUCT PAGE LOGIC
   ========================================= */
function openEditProductModal(button) {
    currentProductCard = button.closest(".card");
    
    const title = currentProductCard.querySelector(".card-title").innerText;
    const category = currentProductCard.querySelector(".card-text").innerText;
    const price = currentProductCard.querySelector(".price-tag").innerText.replace("RM ", ""); 
    const status = currentProductCard.querySelector(".badge").innerText;
    
    const stockElement = currentProductCard.querySelector(".stock-count");
    let stock = "0";
    
    if (stockElement) {
        stock = stockElement.innerText;
    }

    document.getElementById("editProdName").value = title;
    document.getElementById("editProdCategory").value = category;
    document.getElementById("editProdPrice").value = price;
    document.getElementById("editProdStatus").value = status;
    document.getElementById("editProdStock").value = stock;

    const myModal = new bootstrap.Modal(document.getElementById('editProductModal'));
    myModal.show();
}

function saveProductChanges() {
    const newName = document.getElementById("editProdName").value;
    const newCategory = document.getElementById("editProdCategory").value;
    const newPrice = document.getElementById("editProdPrice").value;
    const newStatus = document.getElementById("editProdStatus").value;
    const newStock = document.getElementById("editProdStock").value;

    // Update text on the card
    currentProductCard.querySelector(".card-title").innerText = newName;
    currentProductCard.querySelector(".card-text").innerText = newCategory;
    currentProductCard.querySelector(".price-tag").innerText = "RM " + newPrice;
    
    const stockElement = currentProductCard.querySelector(".stock-count");
    if (stockElement) {
        stockElement.innerText = newStock;
    }

    const badge = currentProductCard.querySelector(".badge");
    badge.innerText = newStatus;
    
    badge.className = "badge rounded-pill px-3 border"; 
    if (newStatus === "In Stock") {
        badge.classList.add("bg-success-subtle", "text-success", "border-success");
    } else if (newStatus === "Low Stock") {
        badge.classList.add("bg-warning-subtle", "text-warning", "border-warning");
    } else {
        badge.classList.add("bg-danger-subtle", "text-danger", "border-danger");
    }

    const modalElement = document.getElementById('editProductModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
}

function addNewProduct() {
    const name = document.getElementById("addProdName").value;
    const category = document.getElementById("addProdCategory").value;
    const price = document.getElementById("addProdPrice").value;
    const stock = document.getElementById("addProdStock").value;
    const status = document.getElementById("addProdStatus").value;
    const imageInput = document.getElementById('addProdImage');
    const file = imageInput.files[0];

    if (name === "" || price === "") {
        alert("Please enter a Name and Price!");
    } else {
        
        // Determine Badge Color
        let badgeClass = "bg-success-subtle text-success border border-success rounded-pill px-3";
        
        if (status === "Low Stock") {
            badgeClass = "bg-warning-subtle text-warning border border-warning rounded-pill px-3";
        } else if (status === "Out of Stock") {
            badgeClass = "bg-danger-subtle text-danger border border-danger rounded-pill px-3";
        }

        // Helper function to create the HTML
        const createCard = function(imgUrl) {
            const grid = document.getElementById("productGrid");
            const newCardHTML = `
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 shadow-sm product-card">
                        <img src="${imgUrl}" class="card-img-top" alt="Product">
                        <div class="card-body">
                            <h5 class="card-title">${name}</h5>
                            <p class="card-text text-muted">${category}</p>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="fw-bold price-tag">RM ${price}</span>
                                <span class="badge ${badgeClass}">${status}</span>
                            </div>
                            <div class="small text-muted mb-3">
                                Stock: <span class="stock-count">${stock}</span> units
                            </div>
                            <div class="d-flex gap-2 mt-3">
                                <button class="btn btn-outline-secondary flex-grow-1" onclick="openEditProductModal(this)">Edit</button>
                                <button class="btn btn-outline-danger" onclick="deleteCustomer(this)">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            grid.insertAdjacentHTML('beforeend', newCardHTML);

            const modalElement = document.getElementById('addProductModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            document.getElementById("addProductForm").reset();
        };

        // Handle Image
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                createCard(e.target.result); 
            }
            reader.readAsDataURL(file);
        } else {
            createCard("https://dummyimage.com/300x200/dee2e6/6c757d.jpg");
        }
    }
}
/* --- DELETE FUNCTION --- */
function deleteProduct(button) {
    if (confirm("Are you sure you want to delete this?")) {
        // Check if it is a row
        const row = button.closest("tr");
        if (row) {
            row.remove();
        } else {
            // If not a row, check if it is a card
            const card = button.closest(".col-md-6");
            if (card) {
                card.remove();
            }
        }
    }
}

/* =========================================
   SECTION 4: ORDERS
   ========================================= */

function viewOrder(button) {
    const row = button.closest("tr");
    const orderID = row.cells[0].innerText;
    const customerName = row.cells[2].innerText;
    alert("Viewing Order: " + orderID + "\nCustomer: " + customerName);
}

/* =========================================
   TRANSACTIONS
   ========================================= */

function filterTransactions() {
    // 1. Get values from the HTML inputs
    const searchInput = document.getElementById("trxSearch").value.toLowerCase();
    const statusFilter = document.getElementById("trxStatusFilter").value;
    
    // 2. Get all table rows
    const rows = document.querySelectorAll("tbody tr");

    rows.forEach(function(row) {
        // 3. Extract data from specific columns
        // Column 0 = ID, Column 2 = Customer Name
        const idText = row.cells[0].innerText.toLowerCase();
        const nameText = row.cells[2].innerText.toLowerCase();
        
        // Find the badge text for status
        const statusText = row.querySelector(".badge").innerText.trim();

        // 4. Check matches
        // Search Match: Does the ID OR Name contain the typed text?
        const matchesSearch = idText.includes(searchInput) || nameText.includes(searchInput);
        
        // Status Match: Is filter "All" OR does status match exactly?
        const matchesStatus = (statusFilter === "All Status") || (statusText === statusFilter);

        // 5. Show or Hide Row
        if (matchesSearch && matchesStatus) {
            row.style.display = ""; // Show
        } else {
            row.style.display = "none"; // Hide
        }
    });
}

/* =========================================
   SECTION 5: PAGE LOAD
   ========================================= */
   
document.addEventListener("DOMContentLoaded", function() {
    
    // Sidebar Active Link Highlighting
    const currentLocation = window.location.href;
    const menuItems = document.querySelectorAll('.sidebar a');
    
    menuItems.forEach(function(item) {
        if (currentLocation.includes(item.getAttribute("href"))) {
            item.classList.add("active"); 
        }
    });

    // Login.html
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const usernameInput = document.getElementById("username").value;
            const passwordInput = document.getElementById("password").value;
            const errorBox = document.getElementById("loginError");

            if (usernameInput === "admin" && passwordInput === "1234") {
                window.location.href = "dashboard.html"; 
            } else {
                errorBox.classList.remove("d-none");
            }
        });
    }

    // Order.html Tabs
    const orderTabsContainer = document.querySelector('.nav-tabs');
    if (orderTabsContainer) {
        const tabs = document.querySelectorAll('.nav-tabs .nav-link');
        const rows = document.querySelectorAll('tbody tr');

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function(e) {
                e.preventDefault();

                // 1. Visual: Update Active Tab
                tabs.forEach(function(t) {
                    t.classList.remove('active');
                });
                this.classList.add('active');

                const selectedCategory = this.innerText.trim(); // 2. Logic: Get the category name from the tab

                rows.forEach(function(row) {
                    const statusBadge = row.querySelector('.badge').innerText.trim();// Find the badge text inside this row

                    if (selectedCategory === "All Orders") { // STRICT LOGIC RULES:
                        row.style.display = ""; // Show all
                    } 
                    else if (statusBadge === selectedCategory) {
                        row.style.display = "";
                    } 
                    else {
                        row.style.display = "none"; // Hide non-matching rows
                    }
                });
            });
        });
    }

    // Dashboard.html Charts
    const salesCtx = document.getElementById('salesBarChart');
    if (salesCtx) {
        new Chart(salesCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Revenue (RM)',
                    data: [12000, 15000, 11000, 18000, 22000, 45250],
                    backgroundColor: '#0d6efd',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // <--- THIS MUST BE FALSE
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true }
                }
            }
        });
    }

    const demoCtx = document.getElementById('demographicChart');
    if (demoCtx) {
        new Chart(demoCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Selangor', 'KL', 'Johor', 'Penang', 'Sabah'],
                datasets: [{
                    label: 'Customers',
                    data: [450, 300, 200, 150, 80],
                    backgroundColor: ['#4a148c', '#6f42c1', '#d63384', '#fd7e14', '#ffc107'],
                    borderRadius: 4,
                    indexAxis: 'y'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { grid: { display: false } } }
            }
        });
    }

    // Sales_Report.html Chart
    const reportCtx = document.getElementById('salesReportChart');
    if (reportCtx) {
        new Chart(reportCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Sales 2025 (RM)',
                    data: [12000, 19000, 30000, 50000, 20000, 30000, 45000, 40000, 55000, 60000, 75000, 90000],
                    borderColor: '#4a148c', // Purple theme
                    backgroundColor: 'rgba(74, 20, 140, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4 // Smooth curve
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#f0f0f0' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // Calender - Set Date Picker to Today (extra effects)
    const datePicker = document.getElementById('dateFilter');
    if (datePicker) {
        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;
    }
});