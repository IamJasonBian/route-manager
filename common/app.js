document.addEventListener('DOMContentLoaded', function() {
    console.log('Application initialized');
    
    // Get DOM elements
    const originSelect = document.getElementById('origin-select');
    const destinationSelect = document.getElementById('destination-select');
    const addRouteBtn = document.getElementById('add-route');
    const clearRoutesBtn = document.getElementById('clear-routes');
    const selectedRoutesDiv = document.getElementById('selected-routes');
    const chartContainer = document.getElementById('price-chart');
    
    // Initialize chart
    const chart = new window.PriceHistoryChart('price-chart');
    let currentRoutes = [];
    
    // Fetch price history from the API
    async function fetchPriceHistory(origin, destination) {
        try {
            const response = await fetch(`/.netlify/functions/flight-prices?from=${origin}&to=${destination}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Not a JSON response');
            }
            const data = await response.json();
            return {
                route: { origin, destination },
                prices: data.prices.map(item => ({
                    price: item.price,
                    recorded_at: item.date
                }))
            };
        } catch (error) {
            console.error('Error fetching price history:', error);
            return generateMockPriceData(origin, destination);
        }
    }
    
    // Generate mock price data (fallback)
    function generateMockPriceData(origin, destination) {
        const basePrice = 200 + (origin.charCodeAt(0) + destination.charCodeAt(0)) % 100;
        const prices = [];
        const today = new Date();
        
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            
            prices.push({
                price: Math.round((basePrice + (Math.random() * 100 - 20)) * 100) / 100,
                recorded_at: date.toISOString().split('T')[0]
            });
        }
        
        return {
            route: { origin, destination },
            prices: prices.sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at))
        };
    }
    
    // Function to update add button state
    function updateAddButtonState() {
        const origin = originSelect.value;
        const destination = destinationSelect.value;
        addRouteBtn.disabled = !(origin && destination && origin !== destination);
    }
    
    // Function to add a route
    async function addRoute() {
        const origin = originSelect.value;
        const destination = destinationSelect.value;
        const routeKey = `${origin}-${destination}`;
        
        // Check if route already exists
        if (currentRoutes.some(route => route.key === routeKey)) {
            alert('This route is already added');
            return;
        }
        
        // Disable button and show loading state
        addRouteBtn.disabled = true;
        addRouteBtn.textContent = 'Loading...';
        
        try {
            // Fetch price history data
            const priceData = await fetchPriceHistory(origin, destination);
            
            // Add to current routes
            currentRoutes.push({
                key: routeKey,
                origin,
                destination,
                priceData
            });
            
            // Update UI
            updateRoutesList();
            updateChart();
            
            // Reset selects
            originSelect.value = '';
            destinationSelect.value = '';
        } catch (error) {
            console.error('Error adding route:', error);
            alert('Failed to fetch price history. Please try again.');
        } finally {
            // Reset button state
            updateAddButtonState();
            addRouteBtn.textContent = 'Add Route';
        }
    }
    
    // Function to update routes list
    function updateRoutesList() {
        if (currentRoutes.length === 0) {
            selectedRoutesDiv.innerHTML = '<p>No routes selected. Add routes to compare price history.</p>';
            return;
        }
        
        let html = '<div class="routes-list"><h3>Selected Routes:</h3><ul>';
        currentRoutes.forEach((route, index) => {
            html += `
                <li>
                    ${route.origin} to ${route.destination}
                    <button class="remove-route" data-index="${index}">×</button>
                </li>
            `;
        });
        html += '</ul></div>';
        selectedRoutesDiv.innerHTML = html;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-route').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeRoute(index);
            });
        });
    }
    
    // Function to remove a route
    function removeRoute(index) {
        currentRoutes.splice(index, 1);
        updateRoutesList();
        updateChart();
    }
    
    // Function to update the chart
    function updateChart() {
        if (currentRoutes.length === 0) {
            chartContainer.innerHTML = '<p>Please add routes to see the price history chart.</p>';
            return;
        }
        
        // Prepare chart data
        const chartData = currentRoutes.map(route => route.priceData);
        
        // Update chart with new data
        chart.initChart(chartData);
    }
    
    // Event listeners
    originSelect.addEventListener('change', updateAddButtonState);
    destinationSelect.addEventListener('change', updateAddButtonState);
    addRouteBtn.addEventListener('click', addRoute);
    clearRoutesBtn.addEventListener('click', () => {
        currentRoutes = [];
        updateRoutesList();
        updateChart();
    });
    
    // Initialize
    updateAddButtonState();
    updateRoutesList();
    updateChart();
});