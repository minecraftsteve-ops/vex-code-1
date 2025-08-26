// Robot Gear System Optimizer - Interactive JavaScript

// Global variables
let allCombinations = [];
let currentPage = 1;
const itemsPerPage = 10;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    generateAllCombinations();
    setupNavigation();
    setupFilters();
    setupCalculator();
    populateOptimizationData();
    populateStatistics();
    populatePerfectRatios();
    displayCombinations();
});

// Generate all 147 gear combinations
function generateAllCombinations() {
    const inputRPMs = [100, 200, 600];
    const gearSizes = [12, 24, 36, 48, 60, 72, 80];
    
    allCombinations = [];
    
    for (let rpm of inputRPMs) {
        for (let driving of gearSizes) {
            for (let driven of gearSizes) {
                const gearRatio = calculateGearRatio(driving, driven);
                const outputRPM = calculateOutputRPM(rpm, driving, driven);
                const category = getSpeedCategory(outputRPM);
                
                allCombinations.push({
                    inputRPM: rpm,
                    drivingGear: driving,
                    drivenGear: driven,
                    gearRatio: gearRatio,
                    outputRPM: outputRPM,
                    category: category
                });
            }
        }
    }
    
    // Sort by output RPM by default
    allCombinations.sort((a, b) => b.outputRPM - a.outputRPM);
}

// Calculate gear ratio
function calculateGearRatio(drivingGear, drivenGear) {
    return drivenGear / drivingGear;
}

// Calculate output RPM
function calculateOutputRPM(inputRPM, drivingGear, drivenGear) {
    const gearRatio = calculateGearRatio(drivingGear, drivenGear);
    return inputRPM / gearRatio;
}

// Get speed category
function getSpeedCategory(outputRPM) {
    if (outputRPM > 500) return 'High Speed';
    if (outputRPM > 100) return 'Medium Speed';
    return 'Low Speed';
}

// Setup navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Setup filters
function setupFilters() {
    const rpmFilter = document.getElementById('rpmFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    rpmFilter.addEventListener('change', filterAndDisplay);
    sortFilter.addEventListener('change', filterAndDisplay);
    
    // Setup pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayCombinations();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(allCombinations.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayCombinations();
        }
    });
}

// Filter and display combinations
function filterAndDisplay() {
    currentPage = 1;
    displayCombinations();
}

// Display combinations with pagination
function displayCombinations() {
    const rpmFilter = document.getElementById('rpmFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    const tbody = document.getElementById('combinationsBody');
    
    // Filter combinations
    let filteredCombinations = allCombinations.filter(combo => {
        if (rpmFilter === 'all') return true;
        return combo.inputRPM === parseInt(rpmFilter);
    });
    
    // Sort combinations
    switch (sortFilter) {
        case 'output':
            filteredCombinations.sort((a, b) => b.outputRPM - a.outputRPM);
            break;
        case 'ratio':
            filteredCombinations.sort((a, b) => b.gearRatio - a.gearRatio);
            break;
        case 'input':
            filteredCombinations.sort((a, b) => a.inputRPM - b.inputRPM);
            break;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageCombinations = filteredCombinations.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredCombinations.length / itemsPerPage);
    
    // Update page info
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    
    // Update pagination buttons
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
    
    // Clear table
    tbody.innerHTML = '';
    
    // Populate table
    pageCombinations.forEach(combo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${combo.inputRPM} RPM</td>
            <td>${combo.drivingGear}T</td>
            <td>${combo.drivenGear}T</td>
            <td>${combo.gearRatio.toFixed(2)}:1</td>
            <td>${combo.outputRPM.toFixed(1)} RPM</td>
            <td><span class="category-badge ${combo.category.toLowerCase().replace(' ', '-')}">${combo.category}</span></td>
        `;
        tbody.appendChild(row);
    });
}

// Populate optimization data
function populateOptimizationData() {
    // Find fastest setup
    const fastest = allCombinations.reduce((max, combo) => 
        combo.outputRPM > max.outputRPM ? combo : max
    );
    
    // Find slowest setup
    const slowest = allCombinations.reduce((min, combo) => 
        combo.outputRPM < min.outputRPM ? combo : min
    );
    
    // Find balanced setup (closest to 300 RPM)
    const targetRPM = 300;
    const balanced = allCombinations.reduce((closest, combo) => {
        const closestDiff = Math.abs(closest.outputRPM - targetRPM);
        const currentDiff = Math.abs(combo.outputRPM - targetRPM);
        return currentDiff < closestDiff ? combo : closest;
    });
    
    // Update fastest setup
    document.getElementById('fastestInput').textContent = `${fastest.inputRPM} RPM`;
    document.getElementById('fastestGears').textContent = `${fastest.drivingGear}T → ${fastest.drivenGear}T`;
    document.getElementById('fastestRatio').textContent = `${fastest.gearRatio.toFixed(2)}:1`;
    document.getElementById('fastestOutput').textContent = `${fastest.outputRPM.toFixed(1)} RPM`;
    
    // Update slowest setup
    document.getElementById('slowestInput').textContent = `${slowest.inputRPM} RPM`;
    document.getElementById('slowestGears').textContent = `${slowest.drivingGear}T → ${slowest.drivenGear}T`;
    document.getElementById('slowestRatio').textContent = `${slowest.gearRatio.toFixed(2)}:1`;
    document.getElementById('slowestOutput').textContent = `${slowest.outputRPM.toFixed(1)} RPM`;
    
    // Update balanced setup
    document.getElementById('balancedGears').textContent = `${balanced.drivingGear}T → ${balanced.drivenGear}T`;
    document.getElementById('balancedRatio').textContent = `${balanced.gearRatio.toFixed(2)}:1`;
    document.getElementById('balancedOutput').textContent = `${balanced.outputRPM.toFixed(1)} RPM`;
}

// Populate statistics
function populateStatistics() {
    const totalCombinations = allCombinations.length;
    const maxOutput = Math.max(...allCombinations.map(c => c.outputRPM));
    const minOutput = Math.min(...allCombinations.map(c => c.outputRPM));
    const avgOutput = allCombinations.reduce((sum, c) => sum + c.outputRPM, 0) / totalCombinations;
    const speedRange = maxOutput - minOutput;
    
    // Count speed categories
    const highSpeed = allCombinations.filter(c => c.category === 'High Speed').length;
    const mediumSpeed = allCombinations.filter(c => c.category === 'Medium Speed').length;
    const lowSpeed = allCombinations.filter(c => c.category === 'Low Speed').length;
    
    // Update statistics
    document.getElementById('speedRange').textContent = `${speedRange.toFixed(1)} RPM`;
    document.getElementById('avgSpeed').textContent = `${avgOutput.toFixed(1)} RPM`;
    
    // Update chart
    const highSpeedBar = document.querySelector('.chart-bar.high-speed');
    const mediumSpeedBar = document.querySelector('.chart-bar.medium-speed');
    const lowSpeedBar = document.querySelector('.chart-bar.low-speed');
    
    const highSpeedPercent = (highSpeed / totalCombinations * 100).toFixed(1);
    const mediumSpeedPercent = (mediumSpeed / totalCombinations * 100).toFixed(1);
    const lowSpeedPercent = (lowSpeed / totalCombinations * 100).toFixed(1);
    
    highSpeedBar.style.width = `${highSpeedPercent}%`;
    mediumSpeedBar.style.width = `${mediumSpeedPercent}%`;
    lowSpeedBar.style.width = `${lowSpeedPercent}%`;
    
    highSpeedBar.querySelector('.count').textContent = highSpeed;
    mediumSpeedBar.querySelector('.count').textContent = mediumSpeed;
    lowSpeedBar.querySelector('.count').textContent = lowSpeed;
}

// Populate perfect ratios
function populatePerfectRatios() {
    const perfectRatios = allCombinations.filter(combo => 
        Math.abs(combo.gearRatio - Math.round(combo.gearRatio)) < 0.001
    );
    
    const perfectCount = perfectRatios.length;
    const perfectPercent = (perfectCount / allCombinations.length * 100).toFixed(1);
    
    document.getElementById('perfectCount').textContent = perfectCount;
    document.getElementById('perfectPercent').textContent = `${perfectPercent}%`;
    
    // Display first 10 perfect ratios
    const perfectList = document.getElementById('perfectRatiosList');
    perfectList.innerHTML = '';
    
    perfectRatios.slice(0, 10).forEach(combo => {
        const div = document.createElement('div');
        div.className = 'perfect-ratio-item';
        div.innerHTML = `
            <strong>${combo.inputRPM} RPM</strong> | 
            ${combo.drivingGear}T → ${combo.drivenGear}T | 
            Ratio: <strong>${Math.round(combo.gearRatio)}:1</strong> | 
            Output: <strong>${combo.outputRPM.toFixed(1)} RPM</strong>
        `;
        perfectList.appendChild(div);
    });
    
    if (perfectCount > 10) {
        const moreDiv = document.createElement('div');
        moreDiv.className = 'perfect-ratio-more';
        moreDiv.textContent = `... and ${perfectCount - 10} more perfect ratios`;
        perfectList.appendChild(moreDiv);
    }
}

// Setup calculator
function setupCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateGearSetup);
    
    // Also calculate on input changes
    document.getElementById('calcInputRPM').addEventListener('input', calculateGearSetup);
    document.getElementById('calcDrivingGear').addEventListener('change', calculateGearSetup);
    document.getElementById('calcDrivenGear').addEventListener('change', calculateGearSetup);
    
    // Initial calculation
    calculateGearSetup();
}

// Calculate gear setup
function calculateGearSetup() {
    const inputRPM = parseFloat(document.getElementById('calcInputRPM').value) || 200;
    const drivingGear = parseInt(document.getElementById('calcDrivingGear').value) || 24;
    const drivenGear = parseInt(document.getElementById('calcDrivenGear').value) || 48;
    
    const gearRatio = calculateGearRatio(drivingGear, drivenGear);
    const outputRPM = calculateOutputRPM(inputRPM, drivingGear, drivenGear);
    const speedFactor = 1 / gearRatio;
    const torqueFactor = gearRatio;
    
    // Update results
    document.getElementById('calcRatio').textContent = `${gearRatio.toFixed(2)}:1`;
    document.getElementById('calcOutput').textContent = `${outputRPM.toFixed(1)} RPM`;
    document.getElementById('calcSpeedFactor').textContent = `${speedFactor.toFixed(2)}x`;
    document.getElementById('calcTorqueFactor').textContent = `${torqueFactor.toFixed(2)}x`;
}

// Add some CSS for category badges
const style = document.createElement('style');
style.textContent = `
    .category-badge {
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        color: white;
    }
    
    .category-badge.high-speed {
        background: linear-gradient(90deg, #ff6b6b, #ee5a24);
    }
    
    .category-badge.medium-speed {
        background: linear-gradient(90deg, #feca57, #ff9ff3);
        color: #333;
    }
    
    .category-badge.low-speed {
        background: linear-gradient(90deg, #4834d4, #686de0);
    }
    
    .perfect-ratio-item {
        background: #f8f9fa;
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.9rem;
        border-left: 4px solid #667eea;
    }
    
    .perfect-ratio-more {
        text-align: center;
        color: #6c757d;
        font-style: italic;
        margin-top: 1rem;
    }
    
    button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    button:disabled:hover {
        transform: none;
        box-shadow: none;
    }
`;
document.head.appendChild(style);
