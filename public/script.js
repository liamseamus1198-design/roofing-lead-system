// BULLETPROOF Storm Maps Configuration
const stormMaps = {
    'rain': {
        title: 'Hail Damage Map of Vero Lake Estates & West Corridor',
        image: '/images/storm-maps/storm-map-1.jpg',
        data: 'Shows: 0.5-1.75" hail in Vero Lake Estates\nAffected: 2,847 homes confirmed\nDate: May 15, 2025'
    },
    'hail': {
        title: 'Hail Detection of Melbourne and Satellite Beach',
        image: '/images/storm-maps/storm-map-2.jpg',
        data: 'Shows: 0.5-1.75" hail in Melbourne area\nAffected: 1,295 homes confirmed\nDate: May 5, 2025'
    },
    'wind': {
        title: 'Hail Detection of Palm Bay',
        image: '/images/storm-maps/storm-map-3.jpg',
        data: 'Shows: 0.5-1.75" hail in Palm Bay area\nAffected: 1,295 homes confirmed\nDate: May 24, 2025'
    },
    'coverage': {
        title: 'Storm/Hail Damage Coverage of Counties and Cities',
        image: '/images/storm-maps/storm-map-4.jpg',
        data: 'Shows: Complete storm system coverage\nAffected: All target areas confirmed\nDate: May 5-24, 2025'
    }
};

// BULLETPROOF Storm Map Display
function showStormMap(type) {
    const map = stormMaps[type];
    if (!map) {
        console.error('Storm map type not found:', type);
        return;
    }

    // Remove any existing modal
    const existingModal = document.querySelector('.storm-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal with enhanced styling
    const modal = document.createElement('div');
    modal.className = 'storm-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        backdrop-filter: blur(5px);
    `;
    
    if (type === 'coverage') {
        // Enhanced 4-MAP LAYOUT with better responsive design
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 15px;
                width: 95%;
                height: 95%;
                max-width: 1400px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <!-- Enhanced Header -->
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px 25px;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                ">
                    <div>
                        <h3 style="margin: 0; font-size: 28px; font-weight: bold;">${map.title}</h3>
                        <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">Complete Storm Coverage Analysis</p>
                    </div>
                    <button onclick="closeStormMap()" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        font-size: 28px;
                        cursor: pointer;
                        color: white;
                        padding: 8px 12px;
                        border-radius: 8px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                </div>

                <!-- Enhanced Scrollable Content -->
                <div style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 25px;
                    background: #f8f9fa;
                ">
                    <!-- Enhanced 4-MAP GRID with better spacing -->
                    <div style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
                        gap: 25px;
                        margin-bottom: 25px;
                    ">
                        <!-- MAP 1: Vero Lake Estates -->
                        <div style="
                            background: white;
                            border: 2px solid #e9ecef;
                            border-radius: 12px;
                            padding: 20px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                            transition: transform 0.3s ease;
                        " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                            <h4 style="margin: 0 0 20px 0; text-align: center; font-size: 18px; font-weight: bold; color: #333;">
                                Hail Damage Map of Vero Lake Estates & West Corridor
                            </h4>
                            <div style="position: relative; overflow: hidden; border-radius: 8px;">
                                <img src="/images/storm-maps/storm-map-1.jpg" alt="Vero Lake Estates" 
                                     style="width: 100%; height: auto; display: block; transition: transform 0.3s ease;"
                                     onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                            <div style="margin-top: 15px; text-align: center; font-size: 14px; color: #666;">
                                <div style="background: #e3f2fd; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Hail:</strong> 0.5-1.75"</p>
                                </div>
                                <div style="background: #ffebee; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Homes:</strong> 2,847 affected</p>
                                </div>
                                <div style="background: #e8f5e8; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Date:</strong> May 15, 2025</p>
                                </div>
                            </div>
                        </div>

                        <!-- MAP 2: Melbourne & Satellite Beach -->
                        <div style="
                            background: white;
                            border: 2px solid #e9ecef;
                            border-radius: 12px;
                            padding: 20px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                            transition: transform 0.3s ease;
                        " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                            <h4 style="margin: 0 0 20px 0; text-align: center; font-size: 18px; font-weight: bold; color: #333;">
                                Hail Detection of Melbourne and Satellite Beach
                            </h4>
                            <div style="position: relative; overflow: hidden; border-radius: 8px;">
                                <img src="/images/storm-maps/storm-map-2.jpg" alt="Melbourne" 
                                     style="width: 100%; height: auto; display: block; transition: transform 0.3s ease;"
                                     onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                            <div style="margin-top: 15px; text-align: center; font-size: 14px; color: #666;">
                                <div style="background: #e3f2fd; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Hail:</strong> 0.5-1.75"</p>
                                </div>
                                <div style="background: #ffebee; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Homes:</strong> 1,295 affected</p>
                                </div>
                                <div style="background: #e8f5e8; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Date:</strong> May 5, 2025</p>
                                </div>
                            </div>
                        </div>

                        <!-- MAP 3: Palm Bay -->
                        <div style="
                            background: white;
                            border: 2px solid #e9ecef;
                            border-radius: 12px;
                            padding: 20px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                            transition: transform 0.3s ease;
                        " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                            <h4 style="margin: 0 0 20px 0; text-align: center; font-size: 18px; font-weight: bold; color: #333;">
                                Hail Detection of Palm Bay
                            </h4>
                            <div style="position: relative; overflow: hidden; border-radius: 8px;">
                                <img src="/images/storm-maps/storm-map-3.jpg" alt="Palm Bay" 
                                     style="width: 100%; height: auto; display: block; transition: transform 0.3s ease;"
                                     onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                            <div style="margin-top: 15px; text-align: center; font-size: 14px; color: #666;">
                                <div style="background: #e3f2fd; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Hail:</strong> 0.5-1.75"</p>
                                </div>
                                <div style="background: #ffebee; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Homes:</strong> 1,295 affected</p>
                                </div>
                                <div style="background: #e8f5e8; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Date:</strong> May 24, 2025</p>
                                </div>
                            </div>
                        </div>

                        <!-- MAP 4: Overall Coverage -->
                        <div style="
                            background: white;
                            border: 2px solid #e9ecef;
                            border-radius: 12px;
                            padding: 20px;
                            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                            transition: transform 0.3s ease;
                        " onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
                            <h4 style="margin: 0 0 20px 0; text-align: center; font-size: 18px; font-weight: bold; color: #333;">
                                Storm/Hail Damage Coverage of Counties and Cities
                            </h4>
                            <div style="position: relative; overflow: hidden; border-radius: 8px;">
                                <img src="/images/storm-maps/storm-map-4.jpg" alt="Overall Coverage" 
                                     style="width: 100%; height: auto; display: block; transition: transform 0.3s ease;"
                                     onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                            </div>
                            <div style="margin-top: 15px; text-align: center; font-size: 14px; color: #666;">
                                <div style="background: #e3f2fd; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Coverage:</strong> Complete system</p>
                                </div>
                                <div style="background: #ffebee; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Total:</strong> All areas affected</p>
                                </div>
                                <div style="background: #e8f5e8; padding: 8px; border-radius: 6px; margin: 5px 0;">
                                    <p style="margin: 2px 0;"><strong>Period:</strong> May 5-24, 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Summary -->
                    <div style="
                        background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
                        border: 2px solid #bbdefb;
                        border-radius: 12px;
                        padding: 25px;
                        text-align: center;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    ">
                        <h4 style="margin: 0 0 20px 0; color: #333; font-size: 22px; font-weight: bold;">Complete Storm Analysis Summary</h4>
                        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px;">
                            <div style="background: white; padding: 20px; border-radius: 8px; min-width: 120px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <p style="margin: 0; font-size: 32px; font-weight: bold; color: #2196f3;">4</p>
                                <p style="margin: 8px 0 0 0; font-size: 14px; color: #666; font-weight: bold;">Areas Analyzed</p>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 8px; min-width: 120px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <p style="margin: 0; font-size: 32px; font-weight: bold; color: #f44336;">5,437</p>
                                <p style="margin: 8px 0 0 0; font-size: 14px; color: #666; font-weight: bold;">Total Homes Affected</p>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 8px; min-width: 120px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                                <p style="margin: 0; font-size: 32px; font-weight: bold; color: #ff9800;">20 Days</p>
                                <p style="margin: 8px 0 0 0; font-size: 14px; color: #666; font-weight: bold;">Storm Period</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Enhanced single storm map display
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 15px;
                width: 95%;
                height: 95%;
                max-width: 1200px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <!-- Enhanced Header -->
                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 20px 25px;
                    border-bottom: 1px solid #dee2e6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: white;
                ">
                    <div>
                        <h3 style="margin: 0; font-size: 28px; font-weight: bold;">${map.title}</h3>
                        <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">Professional Storm Damage Assessment</p>
                    </div>
                    <button onclick="closeStormMap()" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        font-size: 28px;
                        cursor: pointer;
                        color: white;
                        padding: 8px 12px;
                        border-radius: 8px;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
                </div>

                <!-- Enhanced Content -->
                <div style="
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 25px;
                    background: #f8f9fa;
                ">
                    <div style="
                        position: relative;
                        max-width: 100%;
                        max-height: 100%;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    ">
                        <img src="${map.image}" alt="${map.title}" 
                             style="max-width: 100%; max-height: 100%; object-fit: contain; display: block;">
                    </div>
                </div>
            </div>
        `;
    }

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeStormMap();
        }
    });
}

// Close Storm Map Modal
function closeStormMap() {
    const modal = document.querySelector('.storm-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            e.target.value = value;
        });
    }

    // ZIP code formatting
    const zipInput = document.getElementById('zip');
    if (zipInput) {
        zipInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5);
            }
            e.target.value = value;
        });
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
            }
            
            // Hide any existing messages
            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';

            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                zip: formData.get('zip'),
                address: formData.get('address'),
                message: formData.get('message')
            };

            try {
                const response = await fetch('/api/leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Show success message
                    if (successMessage) {
                        successMessage.style.display = 'block';
                        successMessage.scrollIntoView({ behavior: 'smooth' });
                    }
                    form.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                    errorMessage.scrollIntoView({ behavior: 'smooth' });
                }
            } finally {
                // Reset button state
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Get Free Inspection';
                }
            }
        });
    }

    // Close messages when clicking X
    document.querySelectorAll('.close-message').forEach(button => {
        button.addEventListener('click', function() {
            this.parentElement.style.display = 'none';
        });
    });
});
