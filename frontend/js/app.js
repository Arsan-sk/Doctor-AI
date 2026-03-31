// ============================================
// AI DOCTOR - MAIN APPLICATION
// ============================================

import { authManager } from './auth.js';
import { router } from './router.js';
import { medicalData } from './utils/medical-data.js';
import * as helpers from './utils/helpers.js';
import persistentCart from './persistent-cart.js';

// ============================================
// APPLICATION STATE
// ============================================

let appState = {
    selectedSymptoms: [],
    analysisResults: null,
    cart: [],
    orders: [],
    medicineQuantities: {} // Track quantities for each medicine
};

// ============================================
// UI UPDATES
// ============================================

/**
 * Update navbar based on auth state
 */
function updateNavbar() {
    const authNav = document.getElementById('authNav');
    const userNav = document.getElementById('userNav');
    const guestNav = document.getElementById('guestNav');
    const userGreeting = document.getElementById('userGreeting');

    if (authManager.isAuthenticated()) {
        // Show authenticated navbar
        authNav?.classList.remove('hidden');
        userNav?.classList.remove('hidden');
        guestNav?.classList.add('hidden');

        // Update user greeting
        const user = authManager.getCurrentUser();
        if (user && userGreeting) {
            userGreeting.textContent = `Hello ${user.fullName || user.username}`;
        }
    } else {
        // Show guest navbar
        authNav?.classList.add('hidden');
        userNav?.classList.add('hidden');
        guestNav?.classList.remove('hidden');
    }
}

/**
 * Initialize age dropdown
 */
/**
 * Initialize age dropdown - no longer needed with number input
 * But keeping it for potential future use
 */
function initializeAgeDropdown() {
    // Age input is now a number field, no initialization needed
    console.log('Age field initialized as number input');
}

// ============================================
// AUTHENTICATION HANDLERS
// ============================================

/**
 * Handle registration
 */
async function handleRegister(event) {
    event.preventDefault();

    const fullName = document.getElementById('regFullName')?.value;
    const email = document.getElementById('regEmail')?.value;
    const password = document.getElementById('regPassword')?.value;
    const confirmPassword = document.getElementById('regConfirmPassword')?.value;
    const age = document.getElementById('regAge')?.value;
    const phone = document.getElementById('regPhone')?.value;
    const address = document.getElementById('regAddress')?.value;

    if (!fullName || !email || !password || !phone || !address) {
        helpers.showToast('Please fill all required fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        helpers.showToast('Passwords do not match', 'error');
        return;
    }

    helpers.showToast('Registering...', 'info');

    const result = await authManager.register({
        email,
        password,
        confirmPassword,
        fullName,
        age: age || null,
        phone,
        address
    });

    if (result.success) {
        helpers.showToast('Registration successful! Redirecting...', 'success');
        
        // Close modal
        document.getElementById('registerModal')?.classList.add('hidden');
        
        // Update navbar and redirect
        updateNavbar();
        setTimeout(() => {
            router.navigate('symptoms');
        }, 1000);
    } else {
        helpers.showToast(result.error, 'error');
    }
}

/**
 * Handle login
 */
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
        helpers.showToast('Please enter email and password', 'error');
        return;
    }

    helpers.showToast('Logging in...', 'info');

    const result = await authManager.login(email, password);

    if (result.success) {
        helpers.showToast('Login successful!', 'success');
        
        // Close modal
        document.getElementById('loginModal')?.classList.add('hidden');
        
        // Update navbar and redirect
        updateNavbar();
        setTimeout(() => {
            router.navigate('symptoms');
        }, 1000);
    } else {
        helpers.showToast(result.error, 'error');
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        authManager.logout();
        updateNavbar();
        router.navigate('landing');
        helpers.showToast('Logged out successfully', 'success');
    }
}

// ============================================
// NAVBAR EVENT LISTENERS
// ============================================

function initializeNavbar() {
    console.log('🎯 Initializing navbar event listeners...');
    
    // Mobile menu toggle would go here if needed

    // Symptoms button
    document.getElementById('symptomsBtn')?.addEventListener('click', () => {
        console.log('✅ Symptoms button clicked');
        router.navigate('symptoms');
    });

    // Cart button
    document.getElementById('cartBtn')?.addEventListener('click', () => {
        console.log('✅ Cart button clicked');
        router.navigate('cart');
    });

    // Logout button
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);

    // Login/Register modals from navbar
    const loginButtons = document.querySelectorAll('[data-action="login"]');
    console.log(`📍 Found ${loginButtons.length} login buttons`);
    
    loginButtons.forEach((btn, idx) => {
        console.log(`➕ Attaching login click handler to button ${idx}`);
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ LOGIN button clicked!');
            const regModal = document.getElementById('registerModal');
            const logModal = document.getElementById('loginModal');
            console.log(`📦 RegisterModal: ${regModal ? 'found' : 'NOT FOUND'}, LoginModal: ${logModal ? 'found' : 'NOT FOUND'}`);
            regModal?.classList.add('hidden');
            logModal?.classList.remove('hidden');
            console.log('✅ Modal toggle complete');
        });
    });

    const registerButtons = document.querySelectorAll('[data-action="register"]');
    console.log(`📍 Found ${registerButtons.length} register buttons`);
    
    registerButtons.forEach((btn, idx) => {
        console.log(`➕ Attaching register click handler to button ${idx}`);
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('✅ REGISTER button clicked!');
            const regModal = document.getElementById('registerModal');
            const logModal = document.getElementById('loginModal');
            console.log(`📦 RegisterModal: ${regModal ? 'found' : 'NOT FOUND'}, LoginModal: ${logModal ? 'found' : 'NOT FOUND'}`);
            logModal?.classList.add('hidden');
            regModal?.classList.remove('hidden');
            console.log('✅ Modal toggle complete');
        });
    });
    
    console.log('✅ Navbar initialization complete');
}

// ============================================
// MODAL EVENT LISTENERS
// ============================================

function initializeModals() {
    // Register form
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);

    // Login form
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);

    // Close modal buttons
    document.querySelector('.close-register-modal')?.addEventListener('click', () => {
        document.getElementById('registerModal')?.classList.add('hidden');
    });
    document.querySelector('.close-login-modal')?.addEventListener('click', () => {
        document.getElementById('loginModal')?.classList.add('hidden');
    });

    // Modal switch links
    document.querySelector('.switch-to-login')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('registerModal')?.classList.add('hidden');
        document.getElementById('loginModal')?.classList.remove('hidden');
    });
    document.querySelector('.switch-to-register')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginModal')?.classList.add('hidden');
        document.getElementById('registerModal')?.classList.remove('hidden');
    });

    // Close modals on overlay click
    document.getElementById('registerModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'registerModal') {
            document.getElementById('registerModal')?.classList.add('hidden');
        }
    });
    
    document.getElementById('loginModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'loginModal') {
            document.getElementById('loginModal')?.classList.add('hidden');
        }
    });

    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('registerModal')?.classList.add('hidden');
            document.getElementById('loginModal')?.classList.add('hidden');
        }
    });
}

// ============================================
// SYMPTOMS PAGE HANDLERS
// ============================================

/**
 * Initialize symptoms page interactions
 */
function initializeSymptomsPageInteractions() {
    // Add category filter listeners
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all buttons
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            e.target.classList.add('active');
            
            // Filter symptoms by category
            const selectedCategory = e.target.dataset.category;
            const symptomCards = document.querySelectorAll('.symptom-card');
            
            symptomCards.forEach(card => {
                const checkbox = card.querySelector('.symptom-check');
                const symptomKey = checkbox.value;
                const symptom = medicalData.symptoms[symptomKey];
                
                if (selectedCategory === 'all' || symptom.category === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Add search functionality
    const searchInput = document.getElementById('symptomSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const symptomCards = document.querySelectorAll('.symptom-card');
            
            symptomCards.forEach(card => {
                const checkbox = card.querySelector('.symptom-check');
                const symptomKey = checkbox.value;
                const symptomName = symptomKey
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                const symptom = medicalData.symptoms[symptomKey];
                const hindi = symptom.hindi || '';
                
                // Search in both English and Hindi names
                const matches = symptomName.toLowerCase().includes(searchTerm) || 
                               hindi.toLowerCase().includes(searchTerm);
                
                card.style.display = matches ? 'block' : 'none';
            });
        });
    }
}

function initializeSymptomsPage() {
    // Initialize symptoms grid from medical data
    const symptomsGrid = document.getElementById('symptomsGrid');
    if (!symptomsGrid) return;

    symptomsGrid.innerHTML = '';

    // Get all symptoms
    const allSymptoms = medicalData.symptoms || {};

    Object.entries(allSymptoms).forEach(([key, symptom]) => {
        // Convert key to readable name (fever -> Fever, body_ache -> Body Ache)
        const symptomName = key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        const card = document.createElement('div');
        card.className = 'symptom-card';
        card.innerHTML = `
            <input type="checkbox" class="symptom-check" value="${key}" id="symptom-${key}">
            <label for="symptom-${key}" class="symptom-label">
                <span class="symptom-icon">${symptom.icon || '🏥'}</span>
                <span class="symptom-name">${symptomName}</span>
            </label>
        `;

        symptomsGrid.appendChild(card);

        // Make entire card clickable
        card.addEventListener('click', (e) => {
            // Prevent double-toggle if clicking checkbox directly
            if (e.target.tagName === 'INPUT') return;
            
            const checkbox = card.querySelector('.symptom-check');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                // Trigger change event manually
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Add change listener to checkbox
        const checkbox = card.querySelector('.symptom-check');
        checkbox?.addEventListener('change', (e) => {
            if (e.target.checked) {
                if (!appState.selectedSymptoms.includes(key)) {
                    appState.selectedSymptoms.push(key);
                }
            } else {
                appState.selectedSymptoms = appState.selectedSymptoms.filter(s => s !== key);
            }

            updateSelectedSymptoms();
        });
    });

    // Enable/disable analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.disabled = appState.selectedSymptoms.length === 0;
        analyzeBtn.addEventListener('click', handleAnalyzeSymptoms);
    }
}

/**
 * Update selected symptoms display
 */
function updateSelectedSymptoms() {
    const selectedCount = document.getElementById('selectedCount');
    const selectedList = document.getElementById('selectedSymptoms');
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (selectedCount) {
        selectedCount.textContent = appState.selectedSymptoms.length;
    }

    if (analyzeBtn) {
        analyzeBtn.disabled = appState.selectedSymptoms.length === 0;
    }

    if (selectedList && medicalData.symptoms) {
        selectedList.innerHTML = '';
        appState.selectedSymptoms.forEach(symptomKey => {
            const symptomName = symptomKey
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            const symptom = medicalData.symptoms[symptomKey];
            if (symptom) {
                const tag = document.createElement('span');
                tag.className = 'symptom-tag';
                tag.innerHTML = `
                    ${symptomName}
                    <button class="tag-close" data-symptom="${symptomKey}">×</button>
                `;
                
                // Add event listener to close button
                const closeBtn = tag.querySelector('.tag-close');
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeSymptomFromSelection(symptomKey);
                });
                
                selectedList.appendChild(tag);
            }
        });
    }
}

/**
 * Remove symptom from selection
 */
function removeSymptomFromSelection(symptomKey) {
    appState.selectedSymptoms = appState.selectedSymptoms.filter(s => s !== symptomKey);
    const checkbox = document.getElementById(`symptom-${symptomKey}`);
    if (checkbox) {
        checkbox.checked = false;
    }
    updateSelectedSymptoms();
}

/**
 * Handle analyze symptoms button click
 */
async function handleAnalyzeSymptoms() {
    if (appState.selectedSymptoms.length === 0) {
        helpers.showToast('Please select at least one symptom', 'error');
        return;
    }

    // Show loading page with animation
    router.navigate('loading');
    
    // Simulate analysis delay (show loading UI)
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        // Perform AI analysis based on selected symptoms
        const analysisResults = performAIAnalysis(appState.selectedSymptoms);
        
        // Store results in appState
        appState.analysisResults = analysisResults;

        // Save analysis to backend
        await saveAnalysisToBackend(analysisResults);

        // Display results
        displayAnalysisResults(analysisResults);

        // Navigate to results page
        router.navigate('results');
        
        helpers.showToast('Analysis complete! ✅', 'success');

    } catch (error) {
        console.error('Analysis error:', error);
        helpers.showToast('Error during analysis: ' + error.message, 'error');
        router.navigate('symptoms');
    }
}

/**
 * Perform AI analysis on selected symptoms
 */
function performAIAnalysis(selectedSymptomKeys) {
    const diseases = medicalData.diseases || {};
    const symptoms = medicalData.symptoms || {};

    // Calculate disease scores based on symptom matches
    const diseaseScores = {};
    
    Object.entries(diseases).forEach(([diseaseKey, disease]) => {
        let score = 0;
        let matchedSymptoms = 0;

        // Check how many selected symptoms match this disease
        disease.symptoms.forEach(symptom => {
            if (selectedSymptomKeys.includes(symptom)) {
                matchedSymptoms++;
                // Use probability weight if available
                const weight = disease.probability_weights?.[symptom] || 0.5;
                score += weight;
            }
        });

        // Calculate final score (0-100)
        if (matchedSymptoms > 0) {
            diseaseScores[diseaseKey] = {
                disease: disease,
                score: Math.min(100, (score / disease.symptoms.length) * 100),
                matchedSymptoms: matchedSymptoms,
                confidence: Math.min(100, (matchedSymptoms / disease.symptoms.length) * 100)
            };
        }
    });

    // Sort by score and get top 5
    const topDiseases = Object.entries(diseaseScores)
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, 5)
        .map(([key, data]) => ({
            key: key,
            ...data.disease,
            matchScore: Math.round(data.score),
            confidence: Math.round(data.confidence)
        }));

    // Check for emergency conditions
    const emergencySymptoms = ['chest_pain', 'shortness_of_breath', 'confusion'];
    const hasEmergency = selectedSymptomKeys.some(s => emergencySymptoms.includes(s));

    return {
        symptoms: selectedSymptomKeys,
        diagnosis: topDiseases,
        emergency: hasEmergency,
        emergencyMessage: hasEmergency ? '⚠️ Symptoms suggest a serious condition. Please seek immediate medical attention!' : null,
        timestamp: new Date().toISOString()
    };
}

/**
 * Save analysis to backend
 */
async function saveAnalysisToBackend(analysisResults) {
    try {
        // Extract medicines and remedies from diagnosis
        const medicines = new Map();
        const remedies = new Set();

        analysisResults.diagnosis.forEach(diagnosis => {
            // Collect medicines
            if (diagnosis.medicines) {
                diagnosis.medicines.forEach(med => {
                    medicines.set(med.name, med);
                });
            }

            // Collect home remedies
            if (diagnosis.homeRemedies) {
                diagnosis.homeRemedies.forEach(r => remedies.add(r));
            }
        });

        const analysisData = {
            symptoms: analysisResults.symptoms,
            diagnosisResults: analysisResults.diagnosis.map(d => ({
                disease: d.name,
                hindi: d.hindi,
                severity: d.severity,
                matchScore: d.matchScore,
                confidence: d.confidence
            })),
            recommendedMedicines: Array.from(medicines.values()),
            homeRemedies: Array.from(remedies),
            emergencyFlag: analysisResults.emergency,
            emergencyMessage: analysisResults.emergencyMessage
        };

        // Call backend API
        const response = await fetch('http://localhost:3000/api/analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authManager.getToken()}`
            },
            body: JSON.stringify(analysisData)
        });

        if (!response.ok) {
            console.warn('Failed to save analysis to backend, displaying results locally');
        }

    } catch (error) {
        console.warn('Analysis save error (local display will continue):', error);
    }
}

/**
 * Display analysis results on the results page
 */
function displayAnalysisResults(analysisResults) {
    // Show emergency alert if needed
    const emergencyAlert = document.getElementById('emergencyAlert');
    const emergencyMessage = document.getElementById('emergencyMessage');
    
    if (analysisResults.emergency) {
        if (emergencyAlert) emergencyAlert.classList.remove('hidden');
        if (emergencyMessage) emergencyMessage.textContent = analysisResults.emergencyMessage;
    } else {
        if (emergencyAlert) emergencyAlert.classList.add('hidden');
    }

    // Display diagnosis results
    const diagnosisResults = document.getElementById('diagnosisResults');
    if (diagnosisResults) {
        diagnosisResults.innerHTML = '';
        
        analysisResults.diagnosis.forEach((diagnosis, index) => {
            const diagnosisCard = document.createElement('div');
            diagnosisCard.className = `diagnosis-card ${index === 0 ? 'primary' : ''}`;
            diagnosisCard.innerHTML = `
                <div class="diagnosis-header">
                    <div class="diagnosis-rank">#${index + 1}</div>
                    <div class="diagnosis-info">
                        <h4>${diagnosis.name}</h4>
                        <p class="diagnosis-hindi">${diagnosis.hindi}</p>
                    </div>
                    <div class="diagnosis-score">
                        <div class="score-circle" style="background: conic-gradient(#4a9eff ${diagnosis.matchScore * 3.6}deg, #ccc 0)">
                            <div class="score-text" style="color: #1a1a1a;">${diagnosis.matchScore}%</div>
                        </div>
                    </div>
                </div>
                <div class="diagnosis-meta">
                    <div class="meta-item">
                        <span>Severity:</span>
                        <span class="severity-badge severity-${diagnosis.severity}">${diagnosis.severity}</span>
                    </div>
                    <div class="meta-item">
                        <span>Confidence:</span>
                        <span>${diagnosis.confidence}%</span>
                    </div>
                </div>
                ${diagnosis.description ? `<p class="diagnosis-description">${diagnosis.description}</p>` : ''}
            `;
            diagnosisResults.appendChild(diagnosisCard);
        });
    }

    // Display medicines
    const medicineGrid = document.getElementById('medicineGrid');
    if (medicineGrid) {
        medicineGrid.innerHTML = '';
        const medicinesSet = new Set();
        
        // Collect all medicine keys from diagnosis results
        analysisResults.diagnosis.forEach(diagnosis => {
            if (diagnosis.medicines && Array.isArray(diagnosis.medicines)) {
                diagnosis.medicines.forEach(medKey => {
                    medicinesSet.add(medKey);
                });
            }
        });

        if (medicinesSet.size === 0) {
            medicineGrid.innerHTML = '<p class="no-results">No specific medicines recommended</p>';
        } else {
            medicinesSet.forEach(medKey => {
                const medicine = medicalData.medicines?.[medKey];
                if (medicine) {
                    // Initialize quantity if not exists
                    if (!appState.medicineQuantities[medicine.name]) {
                        appState.medicineQuantities[medicine.name] = 1;
                    }
                    
                    const medCard = document.createElement('div');
                    medCard.className = 'medicine-card';
                    const currentQty = appState.medicineQuantities[medicine.name];
                    medCard.innerHTML = `
                        <div class="medicine-header">
                            <h5>${medicine.name}</h5>
                            <span class="medicine-type">${medicine.generic_names?.[0] || 'Medicine'}</span>
                        </div>
                        <p class="medicine-dosage"><strong>Dosage:</strong> ${medicine.adult_dosage || 'As prescribed'}</p>
                        <p class="medicine-description"><strong>₹${medicine.price_range}</strong></p>
                        <p class="medicine-precautions"><small>${medicine.precautions || ''}</small></p>
                        <div class="medicine-actions">
                            <div class="quantity-selector">
                                <button class="qty-btn qty-dec-med" data-medicine="${medicine.name}">−</button>
                                <span class="qty-display" data-medicine="${medicine.name}">${currentQty}</span>
                                <button class="qty-btn qty-inc-med" data-medicine="${medicine.name}">+</button>
                            </div>
                            <button class="btn btn--small add-med-btn" data-medicine="${medicine.name}" data-price="100">
                                Add to Cart
                            </button>
                        </div>
                    `;
                    medicineGrid.appendChild(medCard);
                    
                    // Attach event listeners to avoid CSP violations
                    medCard.querySelector('.qty-dec-med')?.addEventListener('click', () => {
                        decrementMedicineQuantity(medicine.name);
                    });
                    medCard.querySelector('.qty-inc-med')?.addEventListener('click', () => {
                        incrementMedicineQuantity(medicine.name);
                    });
                    medCard.querySelector('.add-med-btn')?.addEventListener('click', () => {
                        addMedicineToCart(medicine.name, 100);
                    });
                }
            });
        }
    }

    // Display home remedies
    const remedyList = document.getElementById('remedyList');
    if (remedyList) {
        remedyList.innerHTML = '';
        const remediesSet = new Set();
        
        analysisResults.diagnosis.forEach(diagnosis => {
            if (diagnosis.homeRemedies && Array.isArray(diagnosis.homeRemedies)) {
                diagnosis.homeRemedies.forEach(r => remediesSet.add(r));
            }
        });

        if (remediesSet.size === 0) {
            remedyList.innerHTML = '<p class="no-results">No home remedies available</p>';
        } else {
            remediesSet.forEach(remedy => {
                const remedyItem = document.createElement('div');
                remedyItem.className = 'remedy-item';
                remedyItem.innerHTML = `
                    <div class="remedy-icon">🏠</div>
                    <div class="remedy-content">
                        <h5>${remedy}</h5>
                    </div>
                    <div class="remedy-check">✓</div>
                `;
                remedyList.appendChild(remedyItem);
            });
        }
    }

    // Update cart count display - show total quantity
    const cartItemCount = document.getElementById('cartItemCount');
    if (cartItemCount) {
        cartItemCount.textContent = persistentCart.persistentCartState.items.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    // Update Review & Place Order button visibility
    updateReviewOrderButton();

    // Add event listeners to action buttons - use proper event handling
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');
    if (newAnalysisBtn) {
        // Remove old listener by cloning
        const newBtn = newAnalysisBtn.cloneNode(true);
        newAnalysisBtn.parentNode.replaceChild(newBtn, newAnalysisBtn);
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNewAnalysis();
        });
    }

    const viewCartBtn = document.getElementById('viewCartBtn');
    if (viewCartBtn) {
        const newViewCartBtn = viewCartBtn.cloneNode(true);
        viewCartBtn.parentNode.replaceChild(newViewCartBtn, viewCartBtn);
        newViewCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleViewCart();
        });
    }

    const reviewOrderBtn = document.getElementById('reviewOrderBtn');
    if (reviewOrderBtn) {
        const newReviewBtn = reviewOrderBtn.cloneNode(true);
        reviewOrderBtn.parentNode.replaceChild(newReviewBtn, reviewOrderBtn);
        newReviewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleViewCart();
        });
    }
}

/**
 * Increment medicine quantity
 */
function incrementMedicineQuantity(medicineName) {
    if (!appState.medicineQuantities[medicineName]) {
        appState.medicineQuantities[medicineName] = 1;
    }
    appState.medicineQuantities[medicineName]++;
    updateMedicineQuantityDisplay(medicineName);
}

/**
 * Decrement medicine quantity
 */
function decrementMedicineQuantity(medicineName) {
    if (!appState.medicineQuantities[medicineName]) {
        appState.medicineQuantities[medicineName] = 1;
    }
    if (appState.medicineQuantities[medicineName] > 1) {
        appState.medicineQuantities[medicineName]--;
        updateMedicineQuantityDisplay(medicineName);
    }
}

/**
 * Update medicine quantity display
 */
function updateMedicineQuantityDisplay(medicineName) {
    const qtyDisplay = document.querySelector(`span[data-medicine="${medicineName}"]`);
    if (qtyDisplay) {
        qtyDisplay.textContent = appState.medicineQuantities[medicineName];
    }
}

/**
 * Add medicine to persistent cart (API-backed)
 */
async function addMedicineToCart(medicineName, price) {
    const quantity = appState.medicineQuantities[medicineName] || 1;
    
    try {
        // Add to persistent cart via API
        await persistentCart.addToCartPersistent(medicineName, quantity, price);
        
        // Reset quantity selector to 1
        appState.medicineQuantities[medicineName] = 1;
        updateMedicineQuantityDisplay(medicineName);
        
        // Update cart UI
        persistentCart.updateCartUI();
        
        // Update Review & Place Order button visibility
        updateReviewOrderButton();
    } catch (error) {
        console.error('Error adding to cart:', error);
        helpers.showToast('Failed to add to cart', 'error');
    }
}

/**
 * Handle new analysis button
 */
function handleNewAnalysis() {
    // Reset selected symptoms
    appState.selectedSymptoms = [];
    appState.analysisResults = null;

    // Uncheck all checkboxes and un-highlight symptom cards
    document.querySelectorAll('.symptom-check').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.symptom-card.selected').forEach(card => {
        card.classList.remove('selected');
    });

    // Reset selected symptoms display
    updateSelectedSymptoms();
    
    // Update review button visibility
    updateReviewOrderButton();

    // Navigate to symptoms page
    router.navigate('symptoms');
    
    helpers.showToast('Ready for new analysis! ✅', 'info');
}

async function displayCart() {
    console.log('📦 Loading cart from database...');
    
    try {
        // Load cart from database
        await persistentCart.loadCartFromDB();
        
        // Render the My Cart tab
        persistentCart.renderMyCart();
        
        // Update cart count everywhere
        const totalQty = persistentCart.persistentCartState.items.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartItemCount = document.getElementById('cartItemCount');
        if (cartItemCount) {
            cartItemCount.textContent = totalQty;
        }
        
        // Update Review & Place Order button visibility
        updateReviewOrderButton();
    } catch (error) {
        console.error('Error displaying cart:', error);
        helpers.showToast('Failed to load cart', 'error');
    }
}

function updateCartItemQuantity(i, c) {
    if (appState.cart[i]) {
        appState.cart[i].quantity += c;
        if (appState.cart[i].quantity <= 0) removeFromCart(i);
        else {
            displayCart();
            updateReviewOrderButton();
        }
    }
}

async function removeFromCart(itemId) {
    try {
        await persistentCart.removeFromCartPersistent(itemId);
        persistentCart.renderMyCart();
        updateReviewOrderButton();
    } catch (error) {
        console.error('Error removing item:', error);
    }
}

async function handleCheckout() {
    // Get user data from auth manager
    const userData = authManager.user;
    
    // Get form values with fallback to user data from registration
    let deliveryAddress = document.getElementById('deliveryAddress')?.value?.trim();
    let phone = document.getElementById('phone')?.value?.trim();
    let fullName = document.getElementById('checkoutName')?.value?.trim();
    
    // Use registered data as fallback
    if (!fullName && userData?.fullName) {
        fullName = userData.fullName;
    }
    if (!deliveryAddress && userData?.address) {
        deliveryAddress = userData.address;
    }
    if (!phone && userData?.phone) {
        phone = userData.phone;
    }
    
    // Validate inputs
    if (!fullName) {
        helpers.showToast('Please enter your full name', 'error');
        document.getElementById('checkoutName')?.focus();
        return;
    }
    
    if (!phone) {
        helpers.showToast('Please enter your phone number', 'error');
        document.getElementById('phone')?.focus();
        return;
    }
    
    if (!deliveryAddress || deliveryAddress === '') {
        helpers.showToast('Please enter delivery address', 'error');
        document.getElementById('deliveryAddress')?.focus();
        return;
    }
    
    // Check if store is selected
    const selectedStore = document.querySelector('input[name="store"]:checked');
    if (!selectedStore) {
        helpers.showToast('Please select a medical store', 'error');
        return;
    }
    
    try {
        helpers.showToast('Placing order...', 'info');
        
        // Create order with persistent cart
        const order = await persistentCart.createOrderFromCart(
            deliveryAddress,
            phone,
            selectedStore.value
        );
        
        if (order) {
            // Display order placed page
            persistentCart.displayOrderPlaced(order);
            
            // Clear local appState cart
            appState.cart = [];
            appState.medicineQuantities = {};
            
            // Navigate to order placed page
            router.navigate('orderPlaced');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        helpers.showToast('Failed to place order', 'error');
    }
}

/**
 * Initialize confirmation page buttons
 */
function initializeConfirmationPage() {
    console.log('Initializing confirmation page...');
    
    // New Analysis button
    const newOrderBtn = document.getElementById('newOrderBtn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', () => {
            handleNewAnalysis();
        });
    }
    
    // Track Order button
    const trackOrderBtn = document.getElementById('trackOrderBtn');
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', () => {
            console.log('Track Order clicked');
            helpers.showToast('Orders tracking coming soon!', 'info');
            // TODO: Implement order tracking feature
        });
    }
}

/**
 * Handle view cart button
 */
function handleViewCart() {
    console.log('🛒 View Cart clicked. Current cart state:', appState.cart);
    // Force immediate display of current cart state
    requestAnimationFrame(() => {
        displayCart();
        router.navigate('cart');
    });
}

function updateReviewOrderButton() {
    const proceedSection = document.getElementById('proceedToCartSection');
    if (proceedSection) {
        const hasItems = persistentCart.persistentCartState.items.length > 0;
        if (hasItems) {
            proceedSection.classList.remove('hidden');
        } else {
            proceedSection.classList.add('hidden');
        }
    }
}

/**
 * Update cart count display everywhere
 */
function updateCartCountDisplay() {
    const totalQty = persistentCart.persistentCartState.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update in results page
    const cartItemCount = document.getElementById('cartItemCount');
    if (cartItemCount) {
        cartItemCount.textContent = totalQty;
    }
    
    // Update in navbar
    const navCartCount = document.getElementById('cartCount');
    if (navCartCount) {
        navCartCount.textContent = totalQty;
    }
}

/**
 * Display checkout summary
 */
async function displayCheckoutSummary() {
    persistentCart.renderCheckoutSummary();
    persistentCart.renderStoreSelection();
}

/**
 * Initialize checkout page with store selection and form prefilling
 */
async function initializeCheckoutPageWithStores() {
    console.log('Initializing checkout page with stores...');
    
    // Prefill form with user's registered information
    const userData = authManager.user;
    if (userData) {
        if (userData.fullName) {
            const nameField = document.getElementById('checkoutName');
            if (nameField) nameField.value = userData.fullName;
        }
        if (userData.phone) {
            const phoneField = document.getElementById('phone');
            if (phoneField) phoneField.value = userData.phone;
        }
        if (userData.address) {
            const addressField = document.getElementById('deliveryAddress');
            if (addressField) addressField.value = userData.address;
        }
    }
    
    // Render checkout summary and store selection
    await displayCheckoutSummary();
    
    // Setup place order button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handleCheckout);
    }
}

/**
 * Switch between cart tabs (My Cart / Order History)
 */
function switchCartTab(tabName) {
    const myCartContent = document.getElementById('my-cart');
    const orderHistoryContent = document.getElementById('order-history');
    const tabBtns = document.querySelectorAll('.cart-tabs .tab-btn');
    
    // Remove active class from all tab buttons and content
    tabBtns.forEach(btn => btn.classList.remove('active'));
    if (myCartContent) {
        myCartContent.classList.remove('active');
        myCartContent.style.display = 'none';
    }
    if (orderHistoryContent) {
        orderHistoryContent.classList.remove('active');
        orderHistoryContent.style.display = 'none';
    }
    
    if (tabName === 'my-cart') {
        // Activate My Cart tab
        document.querySelector('.tab-btn[data-tab="my-cart"]')?.classList.add('active');
        if (myCartContent) {
            myCartContent.classList.add('active');
            myCartContent.style.display = 'block';
        }
        displayCart();
    } else if (tabName === 'order-history') {
        // Activate Order History tab
        document.querySelector('.tab-btn[data-tab="order-history"]')?.classList.add('active');
        if (orderHistoryContent) {
            orderHistoryContent.classList.add('active');
            orderHistoryContent.style.display = 'block';
        }
        // Render order history asynchronously
        persistentCart.renderOrderHistory().catch(err => {
            console.error('Error rendering order history:', err);
            helpers.showToast('Failed to load order history', 'error');
        });
    }
}

/**
 * Initialize cart page (tabs and event handlers)
 */
async function initializeCartPage() {
    console.log('Initializing cart page...');
    
    // Load cart from database
    await displayCart();
    
    // Setup tab buttons with correct data-tab attributes
    const tabButtons = document.querySelectorAll('.cart-tabs .tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab; // Get data-tab attribute value
            switchCartTab(tabName);
        });
    });
    
    // Initialize My Cart tab as active and render stores
    switchCartTab('my-cart');
    
    // Setup checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            router.navigate('checkout');
        });
    }

    // Setup analyze symptoms button from empty cart
    const backToSymptomsBtn = document.getElementById('backToSymptomsBtn');
    if (backToSymptomsBtn) {
        backToSymptomsBtn.addEventListener('click', () => {
            router.navigate('symptoms');
        });
    }
}

/**
 * Initialize order placed page
 */
function initializeOrderPlacedPageUI() {
    console.log('Initializing order placed page...');
    
    // New Analysis button (id is "newOrderBtn" based on HTML)
    const newOrderBtn = document.getElementById('newOrderBtn');
    if (newOrderBtn) {
        newOrderBtn.addEventListener('click', handleNewAnalysis);
    }
    
    // Track Order button
    const trackOrderBtn = document.getElementById('trackOrderBtn');
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', () => {
            const currentOrder = persistentCart.persistentCartState.currentOrder;
            if (currentOrder) {
                persistentCart.displayOrderTracking(currentOrder);
                router.navigate('orderTracking');
            }
        });
    }
}

/**
 * Initialize order tracking page
 */
function initializeOrderTrackingPageUI() {
    console.log('Initializing order tracking page...');
    
    // Back to cart button
    const backToCartBtn = document.getElementById('backToCartFromTrackingBtn');
    if (backToCartBtn) {
        backToCartBtn.addEventListener('click', () => {
            router.navigate('cart');
        });
    }
}

/**
 * Initialize checkout page buttons
 */
function initializeCheckoutPage() {
    console.log('Initializing checkout page...');
    
    // Place Order button - ensure event listener is attached
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        // Remove any existing event listeners by cloning and replacing
        const newBtn = placeOrderBtn.cloneNode(true);
        placeOrderBtn.parentNode.replaceChild(newBtn, placeOrderBtn);
        
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Place Order clicked');
            handleCheckout();
        });
    }
    
    // Back to Cart button
    const backBtn = document.getElementById('backToCartFromCheckoutBtn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate('cart');
        });
    }
    
    // Populate checkout items and summary
    displayCheckoutSummary();
}

// ============================================
// INITIALIZATION
// ============================================

async function initializeApp() {
    console.log('🚀 Initializing AI Doctor Application...');

    // Check authentication status
    const authStatus = await authManager.checkAuthentication();
    
    // Update navbar
    updateNavbar();

    // Initialize age dropdown
    initializeAgeDropdown();

    // Initialize navbar listeners
    initializeNavbar();

    // Initialize modal listeners
    initializeModals();
    
    // Initialize symptoms page interactions
    initializeSymptomsPage();
    initializeSymptomsPageInteractions();

    // Initialize checkout button (navigate to checkout, not place order directly)
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            router.navigate('checkout');
        });
    }

    // Load persistent cart if user is authenticated
    if (authStatus.isAuthenticated) {
        console.log('✅ Loading persistent cart for authenticated user...');
        try {
            await persistentCart.loadCartFromDB();
        } catch (error) {
            console.warn('Could not load cart on init:', error);
        }
    }

    // Determine which page to show
    if (authStatus.isAuthenticated) {
        console.log('✅ User authenticated, redirecting to symptoms page');
        router.navigate('symptoms');
    } else {
        console.log('ℹ️ User not authenticated, showing landing page');
        router.navigate('landing');
    }

    console.log('✅ Application initialized successfully');
}

// ============================================
// START APP ON DOCUMENT READY
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for debugging
window.appState = appState;
window.authManager = authManager;
window.router = router;
window.initializeCartPage = initializeCartPage;
window.initializeCheckoutPageWithStores = initializeCheckoutPageWithStores;
window.initializeOrderPlacedPageUI = initializeOrderPlacedPageUI;
window.initializeOrderTrackingPageUI = initializeOrderTrackingPageUI;

