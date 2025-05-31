// PriceHistoryChart class definition
class PriceHistoryChart {
    constructor(elementId) {
        this.elementId = elementId;
        this.chart = null;
        this.colors = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2'];
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    initChart(routesData) {
        try {
            const container = document.getElementById(this.elementId);
            if (!container) {
                throw new Error(`Container '${this.elementId}' not found`);
            }

            // Clear and create new canvas
            container.innerHTML = '<canvas></canvas>';
            const ctx = container.querySelector('canvas').getContext('2d');

            // Prepare datasets - ensure dates are properly parsed
            const datasets = routesData.map((route, i) => {
                const color = this.colors[i % this.colors.length];
                return {
                    label: `${route.route.origin} to ${route.route.destination}`,
                    data: route.prices.map(p => ({
                        x: new Date(p.recorded_at).getTime(),
                        y: p.price
                    })),
                    borderColor: color,
                    backgroundColor: color + '33', // Add some transparency
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.1,
                    fill: false
                };
            });

            // Create chart with proper date adapter
            this.chart = new Chart(ctx, {
                type: 'line',
                data: { datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                tooltipFormat: 'PP', // Localized date format
                                displayFormats: {
                                    day: 'MMM d'
                                }
                            },
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Price ($)'
                            }
                        }
                    }
                }
            });

            return true;
        } catch (error) {
            console.error('Error initializing chart:', error);
            return false;
        }
    }
}

// Register globally
window.PriceHistoryChart = PriceHistoryChart;