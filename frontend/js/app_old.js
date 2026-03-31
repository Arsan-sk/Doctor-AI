// Medical AI Application - Complete Functionality
class MedicalApp {
    constructor() {
        this.currentUser = null;
        this.selectedSymptoms = [];
        this.diagnosisResults = [];
        this.cart = [];
        this.currentPage = 'landingPage';
        
        // Medical Data
        this.medicalData = {
            "symptoms": {
                "fever": {"hindi": "बुखार", "category": "general", "icon": "🌡️"},
                "headache": {"hindi": "सिर दर्द", "category": "pain", "icon": "🤕"},
                "cough": {"hindi": "खांसी", "category": "respiratory", "icon": "😷"},
                "cold": {"hindi": "सर्दी", "category": "respiratory", "icon": "🤧"},
                "sore_throat": {"hindi": "गला दुखना", "category": "respiratory", "icon": "😮‍💨"},
                "body_ache": {"hindi": "शरीर दर्द", "category": "pain", "icon": "💪"},
                "nausea": {"hindi": "जी मिचलाना", "category": "gastrointestinal", "icon": "🤢"},
                "vomiting": {"hindi": "उल्टी", "category": "gastrointestinal", "icon": "🤮"},
                "diarrhea": {"hindi": "दस्त", "category": "gastrointestinal", "icon": "🚽"},
                "constipation": {"hindi": "कब्ज", "category": "gastrointestinal", "icon": "😣"},
                "stomach_pain": {"hindi": "पेट दर्द", "category": "pain", "icon": "🫄"},
                "chest_pain": {"hindi": "छाती में दर्द", "category": "cardiovascular", "icon": "💔"},
                "shortness_of_breath": {"hindi": "सांस फूलना", "category": "respiratory", "icon": "😤"},
                "dizziness": {"hindi": "चक्कर आना", "category": "neurological", "icon": "😵‍💫"},
                "fatigue": {"hindi": "थकान", "category": "general", "icon": "😴"},
                "weakness": {"hindi": "कमजोरी", "category": "general", "icon": "🥱"},
                "chills": {"hindi": "ठंड लगना", "category": "general", "icon": "🥶"},
                "sweating": {"hindi": "पसीना आना", "category": "general", "icon": "💦"},
                "joint_pain": {"hindi": "जोड़ों का दर्द", "category": "musculoskeletal", "icon": "🦴"},
                "back_pain": {"hindi": "पीठ दर्द", "category": "musculoskeletal", "icon": "🫄"},
                "runny_nose": {"hindi": "नाक बहना", "category": "respiratory", "icon": "👃"},
                "sneezing": {"hindi": "छींक आना", "category": "respiratory", "icon": "🤧"},
                "skin_rash": {"hindi": "त्वचा पर चकत्ते", "category": "dermatological", "icon": "🔴"},
                "itching": {"hindi": "खुजली", "category": "dermatological", "icon": "✋"},
                "burning_urination": {"hindi": "पेशाब में जलन", "category": "urological", "icon": "🔥"},
                "loss_of_appetite": {"hindi": "भूख न लगना", "category": "gastrointestinal", "icon": "🍽️"},
                "insomnia": {"hindi": "नींद न आना", "category": "neurological", "icon": "😴"},
                "confusion": {"hindi": "दिमागी सुस्ती", "category": "neurological", "icon": "😵"},
                "blurred_vision": {"hindi": "धुंधला दिखना", "category": "visual", "icon": "👁️"},
                "ear_pain": {"hindi": "कान का दर्द", "category": "ent", "icon": "👂"}
            },
            "diseases": {
                "common_cold": {
                    "name": "Common Cold",
                    "hindi": "सामान्य सर्दी",
                    "symptoms": ["fever", "cough", "cold", "runny_nose", "sneezing", "sore_throat", "headache"],
                    "probability_weights": {"fever": 0.7, "cough": 0.9, "cold": 0.95, "runny_nose": 0.8, "sneezing": 0.8, "sore_throat": 0.6, "headache": 0.5},
                    "severity": "mild",
                    "emergency": false
                },
                "flu": {
                    "name": "Influenza",
                    "hindi": "फ्लू",
                    "symptoms": ["fever", "headache", "body_ache", "fatigue", "cough", "chills", "weakness"],
                    "probability_weights": {"fever": 0.9, "headache": 0.8, "body_ache": 0.9, "fatigue": 0.8, "cough": 0.7, "chills": 0.7, "weakness": 0.8},
                    "severity": "moderate",
                    "emergency": false
                },
                "gastroenteritis": {
                    "name": "Gastroenteritis",
                    "hindi": "गैस्ट्रोएंटेराइटिस",
                    "symptoms": ["nausea", "vomiting", "diarrhea", "stomach_pain", "fever", "headache", "weakness"],
                    "probability_weights": {"nausea": 0.9, "vomiting": 0.8, "diarrhea": 0.9, "stomach_pain": 0.8, "fever": 0.6, "headache": 0.5, "weakness": 0.7},
                    "severity": "moderate",
                    "emergency": false
                },
                "migraine": {
                    "name": "Migraine",
                    "hindi": "माइग्रेन",
                    "symptoms": ["headache", "nausea", "vomiting", "dizziness", "blurred_vision"],
                    "probability_weights": {"headache": 0.95, "nausea": 0.7, "vomiting": 0.5, "dizziness": 0.6, "blurred_vision": 0.4},
                    "severity": "moderate",
                    "emergency": false
                },
                "hypertension": {
                    "name": "High Blood Pressure",
                    "hindi": "उच्च रक्तचाप",
                    "symptoms": ["headache", "dizziness", "chest_pain", "shortness_of_breath", "blurred_vision"],
                    "probability_weights": {"headache": 0.6, "dizziness": 0.7, "chest_pain": 0.5, "shortness_of_breath": 0.6, "blurred_vision": 0.4},
                    "severity": "serious",
                    "emergency": true
                },
                "heart_attack": {
                    "name": "Heart Attack",
                    "hindi": "दिल का दौरा",
                    "symptoms": ["chest_pain", "shortness_of_breath", "sweating", "nausea", "dizziness", "weakness"],
                    "probability_weights": {"chest_pain": 0.95, "shortness_of_breath": 0.8, "sweating": 0.7, "nausea": 0.6, "dizziness": 0.6, "weakness": 0.7},
                    "severity": "critical",
                    "emergency": true
                },
                "asthma": {
                    "name": "Asthma",
                    "hindi": "दमा",
                    "symptoms": ["shortness_of_breath", "cough", "chest_pain", "fatigue"],
                    "probability_weights": {"shortness_of_breath": 0.9, "cough": 0.8, "chest_pain": 0.6, "fatigue": 0.5},
                    "severity": "moderate",
                    "emergency": true
                },
                "food_poisoning": {
                    "name": "Food Poisoning",
                    "hindi": "फूड पॉइजनिंग",
                    "symptoms": ["nausea", "vomiting", "diarrhea", "stomach_pain", "fever", "weakness"],
                    "probability_weights": {"nausea": 0.9, "vomiting": 0.9, "diarrhea": 0.8, "stomach_pain": 0.8, "fever": 0.6, "weakness": 0.7},
                    "severity": "moderate",
                    "emergency": false
                },
                "uti": {
                    "name": "Urinary Tract Infection",
                    "hindi": "मूत्र मार्ग संक्रमण",
                    "symptoms": ["burning_urination", "fever", "stomach_pain", "back_pain", "fatigue"],
                    "probability_weights": {"burning_urination": 0.9, "fever": 0.6, "stomach_pain": 0.5, "back_pain": 0.4, "fatigue": 0.5},
                    "severity": "moderate",
                    "emergency": false
                },
                "tension_headache": {
                    "name": "Tension Headache",
                    "hindi": "तनाव सिरदर्द",
                    "symptoms": ["headache", "fatigue", "dizziness", "weakness"],
                    "probability_weights": {"headache": 0.9, "fatigue": 0.6, "dizziness": 0.4, "weakness": 0.5},
                    "severity": "mild",
                    "emergency": false
                }
            },
            "medicines": {
                "paracetamol": {
                    "name": "Paracetamol",
                    "hindi": "पैरासिटामोल",
                    "generic_names": ["Acetaminophen", "Crocin", "Dolo"],
                    "indications": ["fever", "headache", "body_ache", "joint_pain"],
                    "adult_dosage": "500-1000mg every 4-6 hours, max 4000mg per day",
                    "child_dosage": "10-15mg/kg every 4-6 hours",
                    "precautions": "Do not exceed maximum daily dose. Avoid alcohol.",
                    "side_effects": "Rare when used as directed. Liver damage with overdose.",
                    "price_range": "₹10-50",
                    "emergency_medicine": false
                },
                "ibuprofen": {
                    "name": "Ibuprofen",
                    "hindi": "इबुप्रोफेन",
                    "generic_names": ["Brufen", "Advil", "Motrin"],
                    "indications": ["fever", "headache", "body_ache", "joint_pain", "back_pain"],
                    "adult_dosage": "200-400mg every 6-8 hours, max 1200mg per day",
                    "child_dosage": "5-10mg/kg every 6-8 hours (not under 6 months)",
                    "precautions": "Take with food. Avoid in pregnancy, kidney disease.",
                    "side_effects": "Stomach upset, increased bleeding risk",
                    "price_range": "₹15-60",
                    "emergency_medicine": false
                },
                "omeprazole": {
                    "name": "Omeprazole",
                    "hindi": "ओमेप्राजोल",
                    "generic_names": ["Prilosec", "Omez"],
                    "indications": ["stomach_pain", "nausea"],
                    "adult_dosage": "20mg once daily before meals",
                    "child_dosage": "Consult doctor for pediatric dose",
                    "precautions": "Take 30-60 minutes before meals",
                    "side_effects": "Headache, nausea, diarrhea",
                    "price_range": "₹30-100",
                    "emergency_medicine": false
                },
                "cetirizine": {
                    "name": "Cetirizine",
                    "hindi": "सेटिरिजिन",
                    "generic_names": ["Zyrtec", "Alerid"],
                    "indications": ["itching", "skin_rash", "runny_nose", "sneezing"],
                    "adult_dosage": "10mg once daily",
                    "child_dosage": "2.5-5mg once daily (age dependent)",
                    "precautions": "May cause drowsiness",
                    "side_effects": "Drowsiness, dry mouth",
                    "price_range": "₹20-80",
                    "emergency_medicine": false
                },
                "oral_rehydration_salts": {
                    "name": "ORS",
                    "hindi": "ओआरएस",
                    "generic_names": ["Electral", "ORS Powder"],
                    "indications": ["diarrhea", "vomiting", "weakness"],
                    "adult_dosage": "1 sachet in 200ml water, drink slowly",
                    "child_dosage": "Same as adult, give in small frequent sips",
                    "precautions": "Use clean water, consume within 24 hours",
                    "side_effects": "Generally safe",
                    "price_range": "₹5-20",
                    "emergency_medicine": false
                }
            },
            "home_remedies": {
                "common_cold": [
                    "गर्म पानी से गरारे करें (Gargle with warm salt water)",
                    "अदरक और शहद की चाय पिएं (Drink ginger honey tea)",
                    "भाप लें (Steam inhalation)",
                    "गर्म तरल पदार्थ पिएं (Drink warm fluids)"
                ],
                "flu": [
                    "पूरी नींद लें (Get adequate rest)",
                    "हल्दी वाला दूध पिएं (Drink turmeric milk)",
                    "तुलसी की चाय पिएं (Drink tulsi tea)",
                    "गर्म पानी पिएं (Stay hydrated with warm water)"
                ],
                "gastroenteritis": [
                    "BRAT डाइट लें (Follow BRAT diet - Banana, Rice, Apple, Toast)",
                    "नारियल पानी पिएं (Drink coconut water)",
                    "अदरक की चाय पिएं (Drink ginger tea)",
                    "तली हुई चीजें न खाएं (Avoid fried foods)"
                ],
                "headache": [
                    "सिर की मालिश करें (Head massage)",
                    "पेपरमिंट ऑयल लगाएं (Apply peppermint oil)",
                    "आराम करें (Rest in dark room)",
                    "गर्म या ठंडी सिकाई करें (Apply hot/cold compress)"
                ],
                "fever": [
                    "ठंडी सिकाई करें (Apply cold compress)",
                    "तुलसी के पत्ते चबाएं (Chew tulsi leaves)",
                    "बहुत पानी पिएं (Stay hydrated)",
                    "हल्का भोजन लें (Light meals only)"
                ]
            },
            "emergency_symptoms": {
                "chest_pain": "Severe chest pain may indicate heart attack - seek immediate medical attention",
                "shortness_of_breath": "Difficulty breathing requires immediate medical evaluation",
                "confusion": "Sudden confusion or mental changes need urgent care",
                "blurred_vision": "Sudden vision changes may indicate serious condition"
            }
        };
        
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.generateAgeOptions();
        this.renderSymptoms();
        this.updateCartDisplay();
        
        // Show landing page if no user, otherwise show symptoms
        if (this.currentUser) {
            this.showPage('symptomPage');
            this.updateUserGreeting();
        } else {
            this.showPage('landingPage');
        }
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('getStartedBtn').addEventListener('click', () => {
            this.showPage('registrationPage');
        });

        document.getElementById('homeBtn').addEventListener('click', () => {
            this.showPage('landingPage');
        });

        document.getElementById('symptomsBtn').addEventListener('click', () => {
            if (this.currentUser) {
                this.showPage('symptomPage');
            } else {
                this.showPage('registrationPage');
            }
        });

        document.getElementById('cartBtn').addEventListener('click', () => {
            this.showPage('cartPage');
        });

        // Registration
        document.getElementById('registrationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegistration();
        });

        // Symptom search and analysis
        document.getElementById('symptomSearch').addEventListener('input', (e) => {
            this.filterSymptoms(e.target.value);
        });

        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeSymptoms();
        });

        // Category filters
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Cart and checkout
        document.getElementById('newAnalysisBtn').addEventListener('click', () => {
            this.resetAnalysis();
        });

        document.getElementById('viewCartBtn').addEventListener('click', () => {
            this.showPage('cartPage');
        });

        document.getElementById('backToSymptomsBtn').addEventListener('click', () => {
            this.showPage('symptomPage');
        });

        document.getElementById('checkoutBtn').addEventListener('click', () => {
            this.showPage('checkoutPage');
            this.setupCheckout();
        });

        document.getElementById('editAddressBtn').addEventListener('click', () => {
            this.showAddressModal();
        });

        document.getElementById('placeOrderBtn').addEventListener('click', () => {
            this.placeOrder();
        });

        // Order actions
        document.getElementById('newOrderBtn').addEventListener('click', () => {
            this.resetAnalysis();
        });

        document.getElementById('trackOrderBtn').addEventListener('click', () => {
            alert('Order tracking feature will be available soon!');
        });

        // Modal handling
        document.getElementById('cancelAddressBtn').addEventListener('click', () => {
            this.hideAddressModal();
        });

        document.querySelector('.modal-close').addEventListener('click', () => {
            this.hideAddressModal();
        });

        document.getElementById('addressForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateAddress();
        });
    }

    generateAgeOptions() {
        const ageSelect = document.getElementById('userAge');
        for (let i = 1; i <= 100; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            ageSelect.appendChild(option);
        }
    }

    handleRegistration() {
        const name = document.getElementById('userName').value.trim();
        const age = document.getElementById('userAge').value;
        const mobile = document.getElementById('userMobile').value.trim();
        const address = document.getElementById('userAddress').value.trim();

        // Validation
        if (!name || !age || !mobile || !address) {
            alert('Please fill all fields');
            return;
        }

        if (mobile.length !== 10 || !/^[0-9]+$/.test(mobile)) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }

        this.currentUser = { name, age: parseInt(age), mobile, address };
        this.saveUserData();
        this.updateUserGreeting();
        this.showPage('symptomPage');
    }

    renderSymptoms() {
        const grid = document.getElementById('symptomsGrid');
        grid.innerHTML = '';

        Object.entries(this.medicalData.symptoms).forEach(([key, symptom]) => {
            const card = document.createElement('div');
            card.className = 'symptom-card';
            card.dataset.symptom = key;
            card.dataset.category = symptom.category;
            
            card.innerHTML = `
                <div class="symptom-icon">${symptom.icon}</div>
                <div class="symptom-info">
                    <div class="symptom-name">${this.capitalizeWords(key.replace('_', ' '))}</div>
                    <div class="symptom-hindi">${symptom.hindi}</div>
                </div>
                <div class="symptom-checkbox"></div>
            `;

            card.addEventListener('click', () => {
                this.toggleSymptom(key, card);
            });

            grid.appendChild(card);
        });
    }

    toggleSymptom(symptomKey, cardElement) {
        const index = this.selectedSymptoms.indexOf(symptomKey);
        
        if (index > -1) {
            this.selectedSymptoms.splice(index, 1);
            cardElement.classList.remove('selected');
        } else {
            this.selectedSymptoms.push(symptomKey);
            cardElement.classList.add('selected');
        }

        this.updateSelectedSymptoms();
    }

    updateSelectedSymptoms() {
        const container = document.getElementById('selectedSymptoms');
        const countElement = document.getElementById('selectedCount');
        const analyzeBtn = document.getElementById('analyzeBtn');

        countElement.textContent = this.selectedSymptoms.length;
        
        container.innerHTML = '';
        this.selectedSymptoms.forEach(symptomKey => {
            const symptom = this.medicalData.symptoms[symptomKey];
            const tag = document.createElement('div');
            tag.className = 'selected-tag';
            tag.innerHTML = `
                ${symptom.icon} ${this.capitalizeWords(symptomKey.replace('_', ' '))}
                <button class="remove-tag" onclick="app.removeSymptom('${symptomKey}')">&times;</button>
            `;
            container.appendChild(tag);
        });

        analyzeBtn.disabled = this.selectedSymptoms.length === 0;
    }

    removeSymptom(symptomKey) {
        const index = this.selectedSymptoms.indexOf(symptomKey);
        if (index > -1) {
            this.selectedSymptoms.splice(index, 1);
            const card = document.querySelector(`[data-symptom="${symptomKey}"]`);
            if (card) card.classList.remove('selected');
            this.updateSelectedSymptoms();
        }
    }

    filterSymptoms(searchTerm) {
        const cards = document.querySelectorAll('.symptom-card');
        
        cards.forEach(card => {
            const symptomKey = card.dataset.symptom;
            const symptom = this.medicalData.symptoms[symptomKey];
            const englishName = symptomKey.replace('_', ' ').toLowerCase();
            const hindiName = symptom.hindi.toLowerCase();
            const search = searchTerm.toLowerCase();

            const matches = englishName.includes(search) || hindiName.includes(search);
            card.style.display = matches ? 'flex' : 'none';
        });
    }

    filterByCategory(category) {
        const cards = document.querySelectorAll('.symptom-card');
        
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    analyzeSymptoms() {
        if (this.selectedSymptoms.length === 0) return;

        this.showPage('loadingPage');
        this.animateLoadingSteps();

        setTimeout(() => {
            this.diagnosisResults = this.calculateDiagnosis();
            this.showPage('resultsPage');
            this.displayResults();
        }, 3000);
    }

    animateLoadingSteps() {
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => step.classList.remove('active'));
        
        steps[0].classList.add('active');
        setTimeout(() => {
            steps[0].classList.remove('active');
            steps[1].classList.add('active');
        }, 1000);
        
        setTimeout(() => {
            steps[1].classList.remove('active');
            steps[2].classList.add('active');
        }, 2000);
    }

    calculateDiagnosis() {
        const results = [];

        Object.entries(this.medicalData.diseases).forEach(([diseaseKey, disease]) => {
            let totalScore = 0;
            let maxScore = 0;
            let matchingSymptoms = 0;

            disease.symptoms.forEach(symptom => {
                const weight = disease.probability_weights[symptom] || 0;
                maxScore += weight;
                
                if (this.selectedSymptoms.includes(symptom)) {
                    totalScore += weight;
                    matchingSymptoms++;
                }
            });

            if (matchingSymptoms > 0) {
                const probability = Math.round((totalScore / maxScore) * 100);
                if (probability > 20) { // Only show diseases with reasonable probability
                    results.push({
                        disease: diseaseKey,
                        data: disease,
                        probability: probability,
                        matchingSymptoms: matchingSymptoms
                    });
                }
            }
        });

        // Sort by probability and return top 3
        return results.sort((a, b) => b.probability - a.probability).slice(0, 3);
    }

    displayResults() {
        this.checkForEmergencySymptoms();
        this.renderDiagnosisResults();
        this.renderMedicineRecommendations();
        this.renderHomeRemedies();
    }

    checkForEmergencySymptoms() {
        const emergencyAlert = document.getElementById('emergencyAlert');
        const emergencyMessage = document.getElementById('emergencyMessage');
        
        const emergencySymptoms = Object.keys(this.medicalData.emergency_symptoms);
        const hasEmergency = this.selectedSymptoms.some(symptom => emergencySymptoms.includes(symptom));
        
        if (hasEmergency) {
            const emergencySymptom = this.selectedSymptoms.find(symptom => emergencySymptoms.includes(symptom));
            emergencyMessage.textContent = this.medicalData.emergency_symptoms[emergencySymptom];
            emergencyAlert.classList.remove('hidden');
        } else {
            emergencyAlert.classList.add('hidden');
        }
    }

    renderDiagnosisResults() {
        const container = document.getElementById('diagnosisResults');
        container.innerHTML = '<h3>🩺 Possible Conditions</h3>';

        this.diagnosisResults.forEach(result => {
            const card = document.createElement('div');
            card.className = 'disease-card';
            
            card.innerHTML = `
                <div class="disease-header">
                    <div>
                        <h4 class="disease-name">${result.data.name}</h4>
                        <div class="disease-hindi">${result.data.hindi}</div>
                    </div>
                    <div class="probability-badge">${result.probability}%</div>
                </div>
                <div class="probability-bar">
                    <div class="probability-fill" style="width: ${result.probability}%"></div>
                </div>
                <div class="severity-indicator severity-${result.data.severity}">
                    ${this.getSeverityIcon(result.data.severity)} ${this.capitalizeWords(result.data.severity)}
                </div>
            `;

            container.appendChild(card);
        });
    }

    renderMedicineRecommendations() {
        const container = document.getElementById('medicineGrid');
        container.innerHTML = '';

        const recommendedMedicines = this.getRecommendedMedicines();
        
        recommendedMedicines.forEach(([medicineKey, medicine]) => {
            const card = document.createElement('div');
            card.className = 'medicine-card';
            
            card.innerHTML = `
                <div class="medicine-header">
                    <div class="medicine-info">
                        <h4>${medicine.name}</h4>
                        <div class="medicine-hindi">${medicine.hindi}</div>
                    </div>
                    <div class="medicine-price">${medicine.price_range}</div>
                </div>
                <div class="medicine-details">
                    <div class="dosage-info">
                        <h5>Adult Dosage:</h5>
                        <p>${medicine.adult_dosage}</p>
                    </div>
                    <div class="dosage-info">
                        <h5>Precautions:</h5>
                        <p>${medicine.precautions}</p>
                    </div>
                </div>
                <div class="medicine-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="app.updateQuantity('${medicineKey}', -1)">-</button>
                        <input type="number" class="quantity-input" id="qty-${medicineKey}" value="1" min="1" max="10">
                        <button class="quantity-btn" onclick="app.updateQuantity('${medicineKey}', 1)">+</button>
                    </div>
                    <button class="add-to-cart" onclick="app.addToCart('${medicineKey}')">
                        Add to Cart 🛒
                    </button>
                </div>
            `;

            container.appendChild(card);
        });
    }

    getRecommendedMedicines() {
        const medicineSet = new Set();
        
        this.selectedSymptoms.forEach(symptom => {
            Object.entries(this.medicalData.medicines).forEach(([medicineKey, medicine]) => {
                if (medicine.indications.includes(symptom)) {
                    medicineSet.add(medicineKey);
                }
            });
        });

        return Array.from(medicineSet).map(key => [key, this.medicalData.medicines[key]]);
    }

    renderHomeRemedies() {
        const container = document.getElementById('remedyList');
        container.innerHTML = '';

        const remedies = new Set();
        
        // Get remedies based on diagnosis results
        this.diagnosisResults.forEach(result => {
            const diseaseRemedies = this.medicalData.home_remedies[result.disease];
            if (diseaseRemedies) {
                diseaseRemedies.forEach(remedy => remedies.add(remedy));
            }
        });

        // Add general remedies based on symptoms
        if (this.selectedSymptoms.includes('headache')) {
            this.medicalData.home_remedies.headache?.forEach(remedy => remedies.add(remedy));
        }
        if (this.selectedSymptoms.includes('fever')) {
            this.medicalData.home_remedies.fever?.forEach(remedy => remedies.add(remedy));
        }

        Array.from(remedies).forEach(remedy => {
            const item = document.createElement('div');
            item.className = 'remedy-item';
            item.innerHTML = `
                <div class="remedy-icon">🏠</div>
                <p class="remedy-text">${remedy}</p>
            `;
            container.appendChild(item);
        });
    }

    updateQuantity(medicineKey, change) {
        const input = document.getElementById(`qty-${medicineKey}`);
        const currentValue = parseInt(input.value);
        const newValue = Math.max(1, Math.min(10, currentValue + change));
        input.value = newValue;
    }

    addToCart(medicineKey) {
        const quantityInput = document.getElementById(`qty-${medicineKey}`);
        const quantity = parseInt(quantityInput.value);
        const medicine = this.medicalData.medicines[medicineKey];

        const existingItem = this.cart.find(item => item.id === medicineKey);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: medicineKey,
                name: medicine.name,
                hindi: medicine.hindi,
                price: this.extractPrice(medicine.price_range),
                quantity: quantity
            });
        }

        this.saveCartData();
        this.updateCartDisplay();
        this.showCartNotification();
    }

    extractPrice(priceRange) {
        // Extract average price from range like "₹10-50"
        const matches = priceRange.match(/₹(\d+)-(\d+)/);
        if (matches) {
            const min = parseInt(matches[1]);
            const max = parseInt(matches[2]);
            return Math.round((min + max) / 2);
        }
        return 25; // Default price
    }

    showCartNotification() {
        // Simple notification could be enhanced
        const btn = document.querySelector('.add-to-cart:hover');
        if (btn) {
            btn.textContent = 'Added! ✓';
            setTimeout(() => {
                btn.textContent = 'Add to Cart 🛒';
            }, 2000);
        }
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItemCount = document.getElementById('cartItemCount');
        
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        if (cartItemCount) cartItemCount.textContent = totalItems;

        this.renderCartPage();
    }

    renderCartPage() {
        const cartItems = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartSummary = document.getElementById('cartSummary');

        if (this.cart.length === 0) {
            cartItems.innerHTML = '';
            emptyCart.classList.remove('hidden');
            cartSummary.classList.add('hidden');
            return;
        }

        emptyCart.classList.add('hidden');
        cartSummary.classList.remove('hidden');

        cartItems.innerHTML = '';
        let totalAmount = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-details">
                        ${item.hindi} | ₹${item.price} each
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="app.updateCartQuantity('${item.id}', -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="app.updateCartQuantity('${item.id}', 1)">+</button>
                    </div>
                    <div class="item-total">₹${itemTotal}</div>
                    <button class="remove-item" onclick="app.removeFromCart('${item.id}')">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });

        document.getElementById('totalItems').textContent = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('totalAmount').textContent = `₹${totalAmount}`;
    }

    updateCartQuantity(itemId, change) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity = Math.max(1, item.quantity + change);
            this.saveCartData();
            this.updateCartDisplay();
        }
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCartData();
        this.updateCartDisplay();
    }

    setupCheckout() {
        this.displayDeliveryInfo();
        this.displayCheckoutItems();
    }

    displayDeliveryInfo() {
        const deliveryDetails = document.getElementById('deliveryDetails');
        if (this.currentUser) {
            deliveryDetails.innerHTML = `
                <div><strong>Name:</strong> ${this.currentUser.name}</div>
                <div><strong>Age:</strong> ${this.currentUser.age}</div>
                <div><strong>Mobile:</strong> ${this.currentUser.mobile}</div>
                <div><strong>Address:</strong> ${this.currentUser.address}</div>
            `;
        }
    }

    displayCheckoutItems() {
        const container = document.getElementById('checkoutItems');
        const subtotalElement = document.getElementById('checkoutSubtotal');
        const totalElement = document.getElementById('checkoutTotal');

        container.innerHTML = '';
        let subtotal = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const checkoutItem = document.createElement('div');
            checkoutItem.className = 'checkout-item';
            checkoutItem.innerHTML = `
                <div class="item-details">
                    <strong>${item.name}</strong> (${item.hindi})
                    <div>Quantity: ${item.quantity} × ₹${item.price}</div>
                </div>
                <div class="item-price">₹${itemTotal}</div>
            `;
            container.appendChild(checkoutItem);
        });

        subtotalElement.textContent = `₹${subtotal}`;
        totalElement.textContent = `₹${subtotal}`;
    }

    showAddressModal() {
        const modal = document.getElementById('addressModal');
        const addressInput = document.getElementById('newAddress');
        addressInput.value = this.currentUser.address;
        modal.classList.remove('hidden');
    }

    hideAddressModal() {
        document.getElementById('addressModal').classList.add('hidden');
    }

    updateAddress() {
        const newAddress = document.getElementById('newAddress').value.trim();
        if (newAddress) {
            this.currentUser.address = newAddress;
            this.saveUserData();
            this.displayDeliveryInfo();
            this.hideAddressModal();
        }
    }

    placeOrder() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Generate order summary
        const orderDetails = {
            items: [...this.cart],
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            orderDate: new Date().toLocaleDateString('en-IN'),
            deliveryDate: this.calculateDeliveryDate(),
            userInfo: {...this.currentUser}
        };

        // Clear cart and show confirmation
        this.cart = [];
        this.saveCartData();
        this.updateCartDisplay();
        
        this.showOrderConfirmation(orderDetails);
        this.showPage('confirmationPage');
    }

    calculateDeliveryDate() {
        const today = new Date();
        const deliveryDate = new Date(today.getTime() + (2 * 24 * 60 * 60 * 1000)); // 2 days from now
        return deliveryDate.toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    showOrderConfirmation(orderDetails) {
        const orderSummary = document.getElementById('orderSummary');
        const deliveryDate = document.getElementById('deliveryDate');

        deliveryDate.textContent = orderDetails.deliveryDate;

        orderSummary.innerHTML = `
            <div class="order-info">
                <h4>Order Items:</h4>
                ${orderDetails.items.map(item => `
                    <div class="order-item">
                        ${item.name} (${item.hindi}) - Qty: ${item.quantity} - ₹${item.price * item.quantity}
                    </div>
                `).join('')}
                <div class="order-total">
                    <strong>Total Amount: ₹${orderDetails.total}</strong>
                </div>
                <div class="order-payment">
                    Payment Method: Cash on Delivery (COD)
                </div>
            </div>
        `;
    }

    resetAnalysis() {
        this.selectedSymptoms = [];
        this.diagnosisResults = [];
        this.updateSelectedSymptoms();
        
        // Reset symptom cards
        document.querySelectorAll('.symptom-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Reset search and category
        document.getElementById('symptomSearch').value = '';
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.category-btn[data-category="all"]').classList.add('active');
        
        this.showPage('symptomPage');
    }

    // Utility functions
    capitalizeWords(str) {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    }

    getSeverityIcon(severity) {
        const icons = {
            mild: '🟢',
            moderate: '🟡',
            serious: '🟠',
            critical: '🔴'
        };
        return icons[severity] || '⚪';
    }

    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');
        this.currentPage = pageId;

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (pageId === 'landingPage') {
            document.getElementById('homeBtn').classList.add('active');
        } else if (pageId === 'symptomPage') {
            document.getElementById('symptomsBtn').classList.add('active');
        } else if (pageId === 'cartPage' || pageId === 'checkoutPage') {
            document.getElementById('cartBtn').classList.add('active');
        }
    }

    updateUserGreeting() {
        const greeting = document.getElementById('userGreeting');
        if (this.currentUser) {
            greeting.textContent = `Hello, ${this.currentUser.name}!`;
            greeting.classList.remove('hidden');
        } else {
            greeting.classList.add('hidden');
        }
    }

    // Data persistence (using localStorage)
    saveUserData() {
        localStorage.setItem('medicalApp_user', JSON.stringify(this.currentUser));
    }

    loadUserData() {
        const userData = localStorage.getItem('medicalApp_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
        
        const cartData = localStorage.getItem('medicalApp_cart');
        if (cartData) {
            this.cart = JSON.parse(cartData);
        }
    }

    saveCartData() {
        localStorage.setItem('medicalApp_cart', JSON.stringify(this.cart));
    }
}

// Initialize the application
const app = new MedicalApp();