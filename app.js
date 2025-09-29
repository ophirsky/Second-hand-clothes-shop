// Application state
let isAuthenticated = false;
let currentUser = null;
let items = [];
let currentEditingId = null;

// Hebrew texts and messages
const texts = {
    login: "התחברות",
    username: "שם משתמש",
    password: "סיסמה",
    loginButton: "התחבר",
    logout: "התנתק",
    addItem: "הוספת פריט",
    editItem: "עריכת פריט",
    itemName: "שם הפריט",
    category: "קטגוריה",
    price: "מחיר (₪)",
    description: "תיאור",
    size: "מידה",
    uploadPhoto: "העלאת תמונה",
    save: "שמור",
    cancel: "ביטול",
    delete: "מחק",
    edit: "ערוך",
    search: "חיפוש",
    allCategories: "כל הקטגוריות",
    contactUs: "ליצירת קשר",
    adminPanel: "פאנל ניהול",
    storeView: "תצוגת חנות",
    itemsList: "רשימת פריטים",
    noItems: "אין פריטים להצגה",
    invalidLogin: "פרטי התחברות שגויים",
    itemAdded: "הפריט נוסף בהצלחה",
    itemUpdated: "הפריט עודכן בהצלחה",
    itemDeleted: "הפריט נמחק בהצלחה",
    fillAllFields: "יש למלא את כל השדות הנדרשים",
    confirmDelete: "האם אתה בטוח שברצונך למחוק את הפריט?",
    noImage: "אין תמונה"
};

// Categories
const categories = [
    "חולצות",
    "מכנסיים", 
    "שמלות",
    "חצאיות",
    "מעילים",
    "נעליים",
    "אקססוריז"
];

// Sample data
const sampleItems = [
    {
        id: 1,
        name: "חולצה לבנה קלאסית",
        category: "חולצות",
        price: "45",
        description: "חולצה לבנה יפה במצב מעולה, מידה M",
        size: "M",
        image: ""
    },
    {
        id: 2,
        name: "ג'ינס כחול",
        category: "מכנסיים",
        price: "80",
        description: "מכנסי ג'ינס כחולים במצב טוב, מידה 32",
        size: "32",
        image: ""
    },
    {
        id: 3,
        name: "שמלת ערב שחורה",
        category: "שמלות",
        price: "150",
        description: "שמלת ערב אלגנטית בצבע שחור, מידה S",
        size: "S",
        image: ""
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    populateCategories();
    
    // Initialize with sample data
    items = [...sampleItems];
    
    // Show initial view
    showStoreView();
});

function initializeApp() {
    // Initialize category selectors
    const categorySelects = ['itemCategory', 'categoryFilter'];
    categorySelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select && selectId === 'itemCategory') {
            select.innerHTML = '<option value="">בחר קטגוריה</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                select.appendChild(option);
            });
        } else if (select && selectId === 'categoryFilter') {
            select.innerHTML = '<option value="">כל הקטגוריות</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                select.appendChild(option);
            });
        }
    });
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Item form
    const itemForm = document.getElementById('itemFormElement');
    if (itemForm) {
        itemForm.addEventListener('submit', handleItemSubmit);
    }
    
    // Photo upload
    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }
    
    // Search and filter
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterStoreItems);
    }
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterStoreItems);
    }
}

function populateCategories() {
    // This is already handled in initializeApp
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('loginError');
    
    if (username === 'Mayavishi' && password === 'opn4jvMotgIZQmp') {
        isAuthenticated = true;
        currentUser = username;
        hideElement('loginError');
        showAdminView();
        showSuccessMessage(texts.itemAdded);
    } else {
        errorElement.textContent = texts.invalidLogin;
        showElement('loginError');
    }
}

function logout() {
    isAuthenticated = false;
    currentUser = null;
    document.getElementById('loginForm').reset();
    showLoginView();
}

// View management
function showLoginView() {
    hideAllViews();
    showElement('loginView');
}

function showAdminView() {
    if (!isAuthenticated) {
        showLoginView();
        return;
    }
    
    hideAllViews();
    showElement('adminView');
    renderAdminItems();
}

function showStoreView() {
    hideAllViews();
    showElement('storeView');
    renderStoreItems();
}

function hideAllViews() {
    const views = ['loginView', 'adminView', 'storeView'];
    views.forEach(viewId => {
        const view = document.getElementById(viewId);
        if (view) {
            view.classList.remove('active');
            view.classList.add('hidden');
        }
    });
}

function showElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('hidden');
        element.classList.add('active');
    }
}

function hideElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
        element.classList.remove('active');
    }
}

// Item management functions
function showAddItemForm() {
    currentEditingId = null;
    document.getElementById('formTitle').textContent = texts.addItem;
    document.getElementById('itemFormElement').reset();
    document.getElementById('itemId').value = '';
    hidePhotoPreview();
    showElement('itemForm');
}

function hideItemForm() {
    hideElement('itemForm');
    currentEditingId = null;
}

function handleItemSubmit(e) {
    e.preventDefault();
    
    const formData = getFormData();
    
    if (!validateFormData(formData)) {
        showErrorMessage(texts.fillAllFields);
        return;
    }
    
    if (currentEditingId) {
        updateItem(currentEditingId, formData);
        showSuccessMessage(texts.itemUpdated);
    } else {
        addItem(formData);
        showSuccessMessage(texts.itemAdded);
    }
    
    hideItemForm();
    renderAdminItems();
    renderStoreItems();
}

function getFormData() {
    return {
        name: document.getElementById('itemName').value.trim(),
        category: document.getElementById('itemCategory').value,
        price: document.getElementById('itemPrice').value.trim(),
        size: document.getElementById('itemSize').value.trim(),
        description: document.getElementById('itemDescription').value.trim(),
        image: document.getElementById('previewImage').src || ''
    };
}

function validateFormData(data) {
    return data.name && data.category && data.price && data.size;
}

function addItem(data) {
    const newId = Math.max(...items.map(item => item.id), 0) + 1;
    const newItem = {
        id: newId,
        ...data
    };
    items.push(newItem);
}

function updateItem(id, data) {
    const index = items.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
        items[index] = { ...items[index], ...data };
    }
}

function deleteItem(id) {
    if (confirm(texts.confirmDelete)) {
        items = items.filter(item => item.id !== parseInt(id));
        renderAdminItems();
        renderStoreItems();
        showSuccessMessage(texts.itemDeleted);
    }
}

function editItem(id) {
    const item = items.find(item => item.id === parseInt(id));
    if (!item) return;
    
    currentEditingId = id;
    document.getElementById('formTitle').textContent = texts.editItem;
    document.getElementById('itemId').value = id;
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemSize').value = item.size;
    document.getElementById('itemDescription').value = item.description;
    
    if (item.image) {
        showPhotoPreview(item.image);
    } else {
        hidePhotoPreview();
    }
    
    showElement('itemForm');
}

// Photo upload functions
function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            showPhotoPreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function showPhotoPreview(imageSrc) {
    const previewImage = document.getElementById('previewImage');
    const photoPreview = document.getElementById('photoPreview');
    const uploadArea = document.getElementById('photoUploadArea');
    
    previewImage.src = imageSrc;
    showElement('photoPreview');
    hideElement('photoUploadArea');
}

function hidePhotoPreview() {
    const previewImage = document.getElementById('previewImage');
    const photoPreview = document.getElementById('photoPreview');
    const uploadArea = document.getElementById('photoUploadArea');
    
    previewImage.src = '';
    hideElement('photoPreview');
    showElement('photoUploadArea');
}

function removePhoto() {
    document.getElementById('photoInput').value = '';
    hidePhotoPreview();
}

// Rendering functions
function renderAdminItems() {
    const container = document.getElementById('adminItemsList');
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = `<p class="no-items-message">${texts.noItems}</p>`;
        return;
    }
    
    container.innerHTML = items.map(item => `
        <div class="admin-item-card">
            <div class="admin-item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : `<span>${texts.noImage}</span>`}
            </div>
            <div class="admin-item-content">
                <div class="admin-item-header">
                    <h4 class="admin-item-name">${item.name}</h4>
                    <span class="admin-item-price">${item.price}₪</span>
                </div>
                <div class="admin-item-details">
                    <span class="admin-item-category">${item.category}</span>
                    <span class="admin-item-size">מידה ${item.size}</span>
                </div>
                <p class="admin-item-description">${item.description}</p>
                <div class="admin-item-actions">
                    <button onclick="editItem(${item.id})" class="btn btn--primary btn-sm">${texts.edit}</button>
                    <button onclick="deleteItem(${item.id})" class="btn btn--secondary btn-sm">${texts.delete}</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderStoreItems(filteredItems = null) {
    const container = document.getElementById('storeItemsList');
    const noItemsMsg = document.getElementById('noItemsMessage');
    
    if (!container) return;
    
    const itemsToRender = filteredItems || items;
    
    if (itemsToRender.length === 0) {
        container.innerHTML = '';
        showElement('noItemsMessage');
        return;
    }
    
    hideElement('noItemsMessage');
    
    container.innerHTML = itemsToRender.map(item => `
        <div class="store-item-card">
            <div class="store-item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : `<span>${texts.noImage}</span>`}
            </div>
            <div class="store-item-content">
                <div class="store-item-header">
                    <h3 class="store-item-name">${item.name}</h3>
                    <span class="store-item-price">${item.price}₪</span>
                </div>
                <div class="store-item-tags">
                    <span class="store-item-category">${item.category}</span>
                    <span class="store-item-size">מידה ${item.size}</span>
                </div>
                <p class="store-item-description">${item.description}</p>
            </div>
        </div>
    `).join('');
}

// Search and filter functions
function filterStoreItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    let filteredItems = items;
    
    // Filter by search term
    if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by category
    if (selectedCategory) {
        filteredItems = filteredItems.filter(item => item.category === selectedCategory);
    }
    
    renderStoreItems(filteredItems);
}

// Message functions
function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    const messageElement = document.getElementById(type === 'success' ? 'successMessage' : 'errorMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.classList.remove('hidden');
        
        setTimeout(() => {
            messageElement.classList.add('hidden');
        }, 3000);
    }
}

// Global utility functions for HTML onclick handlers
window.showLoginView = showLoginView;
window.showAdminView = showAdminView;
window.showStoreView = showStoreView;
window.logout = logout;
window.showAddItemForm = showAddItemForm;
window.hideItemForm = hideItemForm;
window.editItem = editItem;
window.deleteItem = deleteItem;
window.removePhoto = removePhoto;
