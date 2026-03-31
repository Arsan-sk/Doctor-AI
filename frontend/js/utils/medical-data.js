// Medical Data Repository
// Contains all medical reference data for the application

export const medicalData = {
    symptoms: {
        fever: { hindi: "बुखार", category: "general", icon: "🌡️" },
        headache: { hindi: "सिर दर्द", category: "pain", icon: "🤕" },
        cough: { hindi: "खांसी", category: "respiratory", icon: "😷" },
        cold: { hindi: "सर्दी", category: "respiratory", icon: "🤧" },
        sore_throat: { hindi: "गला दुखना", category: "respiratory", icon: "😮‍💨" },
        body_ache: { hindi: "शरीर दर्द", category: "pain", icon: "💪" },
        nausea: { hindi: "जी मिचलाना", category: "gastrointestinal", icon: "🤢" },
        vomiting: { hindi: "उल्टी", category: "gastrointestinal", icon: "🤮" },
        diarrhea: { hindi: "दस्त", category: "gastrointestinal", icon: "🚽" },
        constipation: { hindi: "कब्ज", category: "gastrointestinal", icon: "😣" },
        stomach_pain: { hindi: "पेट दर्द", category: "pain", icon: "🫄" },
        chest_pain: { hindi: "छाती में दर्द", category: "cardiovascular", icon: "💔" },
        shortness_of_breath: { hindi: "सांस फूलना", category: "respiratory", icon: "😤" },
        dizziness: { hindi: "चक्कर आना", category: "neurological", icon: "😵‍💫" },
        fatigue: { hindi: "थकान", category: "general", icon: "😴" },
        weakness: { hindi: "कमजोरी", category: "general", icon: "🥱" },
        chills: { hindi: "ठंड लगना", category: "general", icon: "🥶" },
        sweating: { hindi: "पसीना आना", category: "general", icon: "💦" },
        joint_pain: { hindi: "जोड़ों का दर्द", category: "musculoskeletal", icon: "🦴" },
        back_pain: { hindi: "पीठ दर्द", category: "musculoskeletal", icon: "🫄" },
        runny_nose: { hindi: "नाक बहना", category: "respiratory", icon: "👃" },
        sneezing: { hindi: "छींक आना", category: "respiratory", icon: "🤧" },
        skin_rash: { hindi: "त्वचा पर चकत्ते", category: "dermatological", icon: "🔴" },
        itching: { hindi: "खुजली", category: "dermatological", icon: "✋" },
        burning_urination: { hindi: "पेशाब में जलन", category: "urological", icon: "🔥" },
        loss_of_appetite: { hindi: "भूख न लगना", category: "gastrointestinal", icon: "🍽️" },
        insomnia: { hindi: "नींद न आना", category: "neurological", icon: "😴" },
        confusion: { hindi: "दिमागी सुस्ती", category: "neurological", icon: "😵" },
        blurred_vision: { hindi: "धुंधला दिखना", category: "visual", icon: "👁️" },
        ear_pain: { hindi: "कान का दर्द", category: "ent", icon: "👂" }
    },

    diseases: {
        common_cold: {
            name: "Common Cold",
            hindi: "सामान्य सर्दी",
            symptoms: ["fever", "cough", "cold", "runny_nose", "sneezing", "sore_throat", "headache"],
            probability_weights: { fever: 0.7, cough: 0.9, cold: 0.95, runny_nose: 0.8, sneezing: 0.8, sore_throat: 0.6, headache: 0.5 },
            severity: "mild",
            emergency: false,
            medicines: ["paracetamol", "cetirizine"],
            homeRemedies: [
                "गर्म पानी से गरारे करें (Gargle with warm salt water)",
                "अदरक और शहद की चाय पिएं (Drink ginger honey tea)",
                "भाप लें (Steam inhalation)",
                "गर्म तरल पदार्थ पिएं (Drink warm fluids)"
            ]
        },
        flu: {
            name: "Influenza",
            hindi: "फ्लू",
            symptoms: ["fever", "headache", "body_ache", "fatigue", "cough", "chills", "weakness"],
            probability_weights: { fever: 0.9, headache: 0.8, body_ache: 0.9, fatigue: 0.8, cough: 0.7, chills: 0.7, weakness: 0.8 },
            severity: "moderate",
            emergency: false,
            medicines: ["paracetamol", "ibuprofen"],
            homeRemedies: [
                "पूरी नींद लें (Get adequate rest)",
                "हल्दी वाला दूध पिएं (Drink turmeric milk)",
                "तुलसी की चाय पिएं (Drink tulsi tea)",
                "गर्म पानी पिएं (Stay hydrated with warm water)"
            ]
        },
        gastroenteritis: {
            name: "Gastroenteritis",
            hindi: "गैस्ट्रोएंटेराइटिस",
            symptoms: ["nausea", "vomiting", "diarrhea", "stomach_pain", "fever", "headache", "weakness"],
            probability_weights: { nausea: 0.9, vomiting: 0.8, diarrhea: 0.9, stomach_pain: 0.8, fever: 0.6, headache: 0.5, weakness: 0.7 },
            severity: "moderate",
            emergency: false,
            medicines: ["omeprazole", "oral_rehydration_salts"],
            homeRemedies: [
                "BRAT डाइट लें (Follow BRAT diet - Banana, Rice, Apple, Toast)",
                "नारियल पानी पिएं (Drink coconut water)",
                "अदरक की चाय पिएं (Drink ginger tea)",
                "तरल पदार्थ ज्यादा पिएं (Stay hydrated)"
            ]
        },
        migraine: {
            name: "Migraine",
            hindi: "माइग्रेन",
            symptoms: ["headache", "nausea", "vomiting", "dizziness", "blurred_vision"],
            probability_weights: { headache: 0.95, nausea: 0.7, vomiting: 0.5, dizziness: 0.6, blurred_vision: 0.4 },
            severity: "moderate",
            emergency: false,
            medicines: ["ibuprofen", "paracetamol"],
            homeRemedies: [
                "शांत, अंधेरी जगह में बैठें (Rest in a quiet, dark room)",
                "सिर पर ठंडा पानी की पट्टी रखें (Apply cold compress)",
                "गहरी सांसें लें (Practice deep breathing)",
                "लैवेंडर की खुशबू लें (Use lavender aromatherapy)"
            ]
        },
        hypertension: {
            name: "High Blood Pressure",
            hindi: "उच्च रक्तचाप",
            symptoms: ["headache", "dizziness", "chest_pain", "shortness_of_breath", "blurred_vision"],
            probability_weights: { headache: 0.6, dizziness: 0.7, chest_pain: 0.5, shortness_of_breath: 0.6, blurred_vision: 0.4 },
            severity: "serious",
            emergency: true,
            medicines: ["paracetamol"],
            homeRemedies: [
                "नमक कम करें (Reduce salt intake)",
                "व्यायाम करें (Regular exercise)",
                "तनाव कम करें (Stress management)",
                "योग करें (Practice yoga)"
            ]
        },
        heart_attack: {
            name: "Heart Attack",
            hindi: "दिल का दौरा",
            symptoms: ["chest_pain", "shortness_of_breath", "sweating", "nausea", "dizziness", "weakness"],
            probability_weights: { chest_pain: 0.95, shortness_of_breath: 0.8, sweating: 0.7, nausea: 0.6, dizziness: 0.6, weakness: 0.7 },
            severity: "critical",
            emergency: true,
            medicines: ["paracetamol"],
            homeRemedies: [
                "तुरंत चिकित्सक को बुलाएं - यह आपातकाल है! (Call ambulance immediately - EMERGENCY!)"
            ]
        },
        asthma: {
            name: "Asthma",
            hindi: "दमा",
            symptoms: ["shortness_of_breath", "cough", "chest_pain", "fatigue"],
            probability_weights: { shortness_of_breath: 0.9, cough: 0.8, chest_pain: 0.6, fatigue: 0.5 },
            severity: "moderate",
            emergency: true,
            medicines: ["paracetamol"],
            homeRemedies: [
                "धूम्रपान से दूर रहें (Avoid smoke and allergens)",
                "गहरी सांसें लें (Practice breathing exercises)",
                "नमी युक्त वातावरण रखें (Maintain humidity)",
                "तनाव कम करें (Reduce stress)"
            ]
        },
        food_poisoning: {
            name: "Food Poisoning",
            hindi: "फूड पॉइजनिंग",
            symptoms: ["nausea", "vomiting", "diarrhea", "stomach_pain", "fever", "weakness"],
            probability_weights: { nausea: 0.9, vomiting: 0.9, diarrhea: 0.8, stomach_pain: 0.8, fever: 0.6, weakness: 0.7 },
            severity: "moderate",
            emergency: false,
            medicines: ["oral_rehydration_salts", "omeprazole"],
            homeRemedies: [
                "तरल पदार्थ बहुत पिएं (Stay well hydrated)",
                "ORS घोल पिएं (Drink ORS solution)",
                "हल्का भोजन खाएं (Eat light, bland food)",
                "आराम करें (Get plenty of rest)"
            ]
        },
        uti: {
            name: "Urinary Tract Infection",
            hindi: "मूत्र मार्ग संक्रमण",
            symptoms: ["burning_urination", "fever", "stomach_pain", "back_pain", "fatigue"],
            probability_weights: { burning_urination: 0.9, fever: 0.6, stomach_pain: 0.5, back_pain: 0.4, fatigue: 0.5 },
            severity: "moderate",
            emergency: false,
            medicines: ["paracetamol"],
            homeRemedies: [
                "ढेर सारा पानी पिएं (Drink plenty of water)",
                "क्रैनबेरी जूस पिएं (Drink cranberry juice)",
                "बिकार्बोनेट सोडा का घोल पिएं (Drink baking soda solution)",
                "गर्मी से राहत पाएं (Use heating pad for relief)"
            ]
        },
        tension_headache: {
            name: "Tension Headache",
            hindi: "तनाव सिरदर्द",
            symptoms: ["headache", "fatigue", "dizziness", "weakness"],
            probability_weights: { headache: 0.9, fatigue: 0.6, dizziness: 0.4, weakness: 0.5 },
            severity: "mild",
            emergency: false,
            medicines: ["paracetamol", "ibuprofen"],
            homeRemedies: [
                "आराम करें (Get adequate rest)",
                "तनाव कम करें (Reduce stress)",
                "गर्म पानी का स्नान करें (Take a warm bath)",
                "सिर और गर्दन में मसाज करें (Massage neck and shoulders)"
            ]
        }
    },

    medicines: {
        paracetamol: {
            name: "Paracetamol",
            hindi: "पैरासिटामोल",
            generic_names: ["Acetaminophen", "Crocin", "Dolo"],
            indications: ["fever", "headache", "body_ache", "joint_pain"],
            adult_dosage: "500-1000mg every 4-6 hours, max 4000mg per day",
            child_dosage: "10-15mg/kg every 4-6 hours",
            precautions: "Do not exceed maximum daily dose. Avoid alcohol.",
            side_effects: "Rare when used as directed. Liver damage with overdose.",
            price_range: "₹10-50",
            emergency_medicine: false
        },
        ibuprofen: {
            name: "Ibuprofen",
            hindi: "इबुप्रोफेन",
            generic_names: ["Brufen", "Advil", "Motrin"],
            indications: ["fever", "headache", "body_ache", "joint_pain", "back_pain"],
            adult_dosage: "200-400mg every 6-8 hours, max 1200mg per day",
            child_dosage: "5-10mg/kg every 6-8 hours (not under 6 months)",
            precautions: "Take with food. Avoid in pregnancy, kidney disease.",
            side_effects: "Stomach upset, increased bleeding risk",
            price_range: "₹15-60",
            emergency_medicine: false
        },
        omeprazole: {
            name: "Omeprazole",
            hindi: "ओमेप्राजोल",
            generic_names: ["Prilosec", "Omez"],
            indications: ["stomach_pain", "nausea"],
            adult_dosage: "20mg once daily before meals",
            child_dosage: "Consult doctor for pediatric dose",
            precautions: "Take 30-60 minutes before meals",
            side_effects: "Headache, nausea, diarrhea",
            price_range: "₹30-100",
            emergency_medicine: false
        },
        cetirizine: {
            name: "Cetirizine",
            hindi: "सेटिरिजिन",
            generic_names: ["Zyrtec", "Alerid"],
            indications: ["itching", "skin_rash", "runny_nose", "sneezing"],
            adult_dosage: "10mg once daily",
            child_dosage: "2.5-5mg once daily (age dependent)",
            precautions: "May cause drowsiness",
            side_effects: "Drowsiness, dry mouth",
            price_range: "₹20-80",
            emergency_medicine: false
        },
        oral_rehydration_salts: {
            name: "ORS",
            hindi: "ओआरएस",
            generic_names: ["Electral", "ORS Powder"],
            indications: ["diarrhea", "vomiting", "weakness"],
            adult_dosage: "1 sachet in 200ml water, drink slowly",
            child_dosage: "Same as adult, give in small frequent sips",
            precautions: "Use clean water, consume within 24 hours",
            side_effects: "Generally safe",
            price_range: "₹5-20",
            emergency_medicine: false
        }
    },

    home_remedies: {
        common_cold: [
            "गर्म पानी से गरारे करें (Gargle with warm salt water)",
            "अदरक और शहद की चाय पिएं (Drink ginger honey tea)",
            "भाप लें (Steam inhalation)",
            "गर्म तरल पदार्थ पिएं (Drink warm fluids)"
        ],
        flu: [
            "पूरी नींद लें (Get adequate rest)",
            "हल्दी वाला दूध पिएं (Drink turmeric milk)",
            "तुलसी की चाय पिएं (Drink tulsi tea)",
            "गर्म पानी पिएं (Stay hydrated with warm water)"
        ],
        gastroenteritis: [
            "BRAT डाइट लें (Follow BRAT diet - Banana, Rice, Apple, Toast)",
            "नारियल पानी पिएं (Drink coconut water)",
            "अदरक की चाय पिएं (Drink ginger tea)",
            "तली हुई चीजें न खाएं (Avoid fried foods)"
        ],
        headache: [
            "सिर की मालिश करें (Head massage)",
            "पेपरमिंट ऑयल लगाएं (Apply peppermint oil)",
            "आराम करें (Rest in dark room)",
            "गर्म या ठंडी सिकाई करें (Apply hot/cold compress)"
        ],
        fever: [
            "ठंडी सिकाई करें (Apply cold compress)",
            "तुलसी के पत्ते चबाएं (Chew tulsi leaves)",
            "बहुत पानी पिएं (Stay hydrated)",
            "हल्का भोजन लें (Light meals only)"
        ]
    },

    emergency_symptoms: {
        chest_pain: "Severe chest pain may indicate heart attack - seek immediate medical attention",
        shortness_of_breath: "Difficulty breathing requires immediate medical evaluation",
        confusion: "Sudden confusion or mental changes need urgent care",
        blurred_vision: "Sudden vision changes may indicate serious condition"
    }
};

export default medicalData;
