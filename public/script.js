document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    const successModal = document.getElementById('successModal');

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
        submitBtn.disabled = true;

        // Collect form data
        const formData = new FormData(form);
        const leadData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData)
            });

            if (response.ok) {
                const result = await response.json();
                showSuccessModal();
                form.reset();
                
                // Track conversion (you can add Google Analytics or other tracking here)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'lead_submission', {
                        'event_category': 'roofing_leads',
                        'event_label': leadData.city
                    });
                }
            } else {
                throw new Error('Failed to submit lead');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('There was an error submitting your request. Please try again or call us directly at (772) 555-0123');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Phone number formatting
    const phoneInput = form.querySelector('input[name="phone"]');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        e.target.value = value;
    });

    // Zip code formatting
    const zipInput = form.querySelector('input[name="zip_code"]');
    zipInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 5) {
            value = value.substring(0, 5);
        }
        e.target.value = value;
    });

    // Auto-populate city based on zip code (basic Florida zip codes)
    zipInput.addEventListener('blur', function(e) {
        const zip = e.target.value;
        const citySelect = form.querySelector('select[name="city"]');
        
        // Basic zip code mapping for your target areas
        const zipToCity = {
            '32958': 'Sebastian',
            '32960': 'Sebastian',
            '32962': 'Sebastian',
            '32963': 'Sebastian',
            '32966': 'Vero Beach',
            '32967': 'Vero Beach',
            '32968': 'Vero Beach',
            '32969': 'Vero Beach',
            '32905': 'Palm Bay',
            '32906': 'Palm Bay',
            '32907': 'Palm Bay',
            '32908': 'Palm Bay',
            '32909': 'Palm Bay',
            '32937': 'Satellite Beach',
            '32951': 'Satellite Beach',
            '32901': 'Melbourne',
            '32902': 'Melbourne',
            '32903': 'Melbourne',
            '32904': 'Melbourne',
            '32934': 'Melbourne',
            '32935': 'Melbourne',
            '32940': 'Melbourne',
            '32941': 'Melbourne',
            '32952': 'Melbourne',
            '32953': 'Melbourne',
            '32954': 'Melbourne',
            '32955': 'Melbourne'
        };

        if (zipToCity[zip]) {
            citySelect.value = zipToCity[zip];
        }
    });

    // Add urgency to form based on user behavior
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage += 1;
        // If user spends more than 2 minutes on page, increase urgency
        if (timeOnPage > 120) {
            const urgencySelect = form.querySelector('select[name="urgency_level"]');
            if (urgencySelect.value === 'Low - Within this month') {
                urgencySelect.value = 'Medium - Within this week';
            }
        }
    }, 1000);

    // Track form engagement
    let formEngagement = 0;
    form.addEventListener('input', function() {
        formEngagement++;
        if (formEngagement > 5) {
            // User is actively engaging with form
            document.querySelector('.urgent-pulse').style.animation = 'pulse-glow 1s infinite';
        }
    });



    // Storm Maps functionality
    window.showStormMap = function(type) {
        const stormMaps = {
            'rain': {
                title: 'Hail Damage Map of Vero Lake Estates & West Corridor',
                image: '/images/storm-maps/storm-map-1.jpg',
                data: 'Shows: 1.00" rain/hour in Vero Lake Estates\nAffected: 1,295 homes in the area\nDate: May 24, 2025'
            },
            'hail': {
                title: 'Hail Detection of Melbourne and Satellite Beach',
                image: '/images/storm-maps/storm-map-2.jpg',
                data: 'Shows: 0.5" hail in Melbourne area\nAffected: 1,295 homes confirmed\nDate: May 5, 2025'
            },
            'wind': {
                title: 'Hail Detection of Palm Bay',
                image: '/images/storm-maps/storm-map-3.jpg',
                data: 'Shows: 0.5" hail in Palm Bay area\nAffected: 1,295 homes confirmed\nDate: May 24, 2025'
            },
            'coverage': {
                title: 'Storm/Hail Damage Coverage of Counties and Cities',
                image: '/images/storm-maps/storm-map-4.jpg',
                data: 'Shows: Complete storm system coverage\nAffected: All target areas confirmed\nDate: May 5-24, 2025'
            }
        };

        const map = stormMaps[type];
        if (!map) return;

        // Remove any existing modal
        const existingModal = document.querySelector('.fixed.inset-0.bg-black');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full h-full max-w-[98vw] max-h-[99vh] overflow-hidden border border-gray-200">
                <div class="h-full flex flex-col">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 border-b border-gray-200">
                        <div class="flex justify-between items-center">
                            <div>
                                <h3 class="text-2xl font-bold text-gray-800 tracking-tight">${map.title}</h3>
                                <p class="text-sm text-gray-600 mt-1">Professional Storm Damage Assessment</p>
                            </div>
                            <button onclick="closeStormMap()" class="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-full hover:bg-gray-200">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 flex flex-col p-2">
                        <!-- Info Bar -->
                        <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-800 p-2 rounded-lg mb-2">
                            <div class="flex items-center">
                                <i class="fas fa-satellite text-blue-600 mr-3 text-lg"></i>
                                <div>
                                    <h4 class="font-semibold text-blue-900">Live Storm Tracking Data</h4>
                                    <p class="text-sm text-blue-700">Real-time weather data from advanced tracking systems</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Map Container -->
                        <div class="flex-1 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                            <div class="relative w-full h-full p-1">
                                ${type === 'coverage' ? `
                                <!-- All 4 Storm Maps Grid for Coverage -->
                                <div class="grid grid-cols-2 gap-4 w-full h-full p-1">
                                    <div class="bg-white rounded-lg p-2 shadow-2xl border-2 border-gray-200">
                                        <h5 class="text-lg font-bold text-gray-800 mb-2 text-center">Vero Lake Estates</h5>
                                        <img src="/images/storm-maps/storm-map-1.jpg" alt="Hail Damage Map" 
                                             class="w-full h-full object-scale-down rounded" 
                                             style="min-height: 45vh; object-fit: contain; transform: scale(1.1);">
                                    </div>
                                    <div class="bg-white rounded-lg p-2 shadow-2xl border-2 border-gray-200">
                                        <h5 class="text-lg font-bold text-gray-800 mb-2 text-center">Melbourne & Satellite Beach</h5>
                                        <img src="/images/storm-maps/storm-map-2.jpg" alt="Hail Detection Map" 
                                             class="w-full h-full object-scale-down rounded" 
                                             style="min-height: 45vh; object-fit: contain; transform: scale(1.1);">
                                    </div>
                                    <div class="bg-white rounded-lg p-2 shadow-2xl border-2 border-gray-200">
                                        <h5 class="text-lg font-bold text-gray-800 mb-2 text-center">Palm Bay</h5>
                                        <img src="/images/storm-maps/storm-map-3.jpg" alt="Hail Detection Map" 
                                             class="w-full h-full object-scale-down rounded" 
                                             style="min-height: 45vh; object-fit: contain; transform: scale(1.1);">
                                    </div>
                                    <div class="bg-white rounded-lg p-2 shadow-2xl border-2 border-gray-200">
                                        <h5 class="text-lg font-bold text-gray-800 mb-2 text-center">Complete Coverage</h5>
                                        <img src="/images/storm-maps/storm-map-4.jpg" alt="Storm Coverage Map" 
                                             class="w-full h-full object-scale-down rounded" 
                                             style="min-height: 45vh; object-fit: contain; transform: scale(1.1);">
                                    </div>
                                </div>
                                ` : `
                                <!-- Single Storm Map Image -->
                                <img src="${map.image}" alt="${map.title}" class="w-full h-full object-scale-down rounded-lg shadow-2xl" 
                                     style="min-height: 100vh; object-fit: contain; max-width: 100%; transform: scale(1.3); margin: -10%;"
                                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                
                                <!-- Fallback if image doesn't load -->
                                <div class="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                    <div class="text-white text-center p-8">
                                        <i class="fas fa-image text-5xl mb-4 opacity-50"></i>
                                        <p class="font-bold text-xl mb-2">Storm Map Image</p>
                                        <p class="text-sm mb-4">Save your Storm Map as:</p>
                                        <p class="text-xs font-mono bg-white/20 p-2 rounded mb-4">${map.image}</p>
                                        <div class="bg-white/20 rounded-lg p-4">
                                            <p class="text-sm font-semibold mb-1">${map.data.split('\n')[0]}</p>
                                            <p class="text-sm font-semibold mb-1">${map.data.split('\n')[1]}</p>
                                            <p class="text-sm font-semibold">${map.data.split('\n')[2]}</p>
                                        </div>
                                    </div>
                                </div>
                                `}
                            </div>
                        </div>
                        
                        <!-- Footer -->
                        <div class="mt-6 text-center">
                            <p class="text-sm text-gray-500 mb-4 font-medium">Live storm tracking data from May 5-24, 2025</p>
                            <div class="flex justify-center space-x-4">
                                <button onclick="closeStormMap()" class="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium shadow-sm">
                                    <i class="fas fa-times mr-2"></i>Close
                                </button>
                                <button onclick="scheduleInspection()" class="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium shadow-sm">
                                    <i class="fas fa-calendar-check mr-2"></i>Schedule Inspection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    };

    window.closeStormMap = function() {
        const modal = document.querySelector('.fixed.inset-0.bg-black');
        if (modal) {
            modal.remove();
        }
    };

    window.scheduleInspection = function() {
        closeStormMap();
        document.getElementById('leadForm').scrollIntoView({ behavior: 'smooth' });
    };


});

// Success modal functions
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Close modal when clicking outside
document.getElementById('successModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add form validation
function validateForm() {
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'zip_code'];
    let isValid = true;

    requiredFields.forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field.value.trim()) {
            field.classList.add('border-red-500');
            isValid = false;
        } else {
            field.classList.remove('border-red-500');
        }
    });

    // Email validation
    const emailField = document.querySelector('input[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        emailField.classList.add('border-red-500');
        isValid = false;
    }

    return isValid;
}

// Add real-time validation
document.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.classList.add('border-red-500');
        } else {
            this.classList.remove('border-red-500');
        }
    });
}); 