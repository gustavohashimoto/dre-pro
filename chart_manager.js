import { MONTHS } from './dre_calculator.js';

let lineChart, waterfallChart;

function getChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        family: "'Open Sans', sans-serif"
                    }
                }
            },
            title: {
                display: false,
                text: title
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value) {
                        return (value / 1000) + 'k';
                    }
                }
            }
        }
    };
}

function updateLineChart(data) {
    const ctx = document.getElementById('lineChart').getContext('2d');
    const robData = data.table.find(d => d.code === '1').monthlyValues;
    const netIncomeData = data.table.find(d => d.code === 'result_final').monthlyValues;

    if (lineChart) {
        lineChart.data.datasets[0].data = robData;
        lineChart.data.datasets[1].data = netIncomeData;
        lineChart.update();
        return;
    }

    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: MONTHS,
            datasets: [{
                label: 'Receita Bruta',
                data: robData,
                borderColor: '#3b82f6',
                backgroundColor: '#3b82f620',
                fill: true,
                tension: 0.3
            }, {
                label: 'Resultado Líquido',
                data: netIncomeData,
                borderColor: '#10b981',
                backgroundColor: '#10b98120',
                fill: true,
                tension: 0.3
            }]
        },
        options: getChartOptions('Projeção: Receita vs. Resultado Líquido')
    });
}

function updateWaterfallChart(data) {
    const ctx = document.getElementById('waterfallChart').getContext('2d');
    const month = 11; // December (projected)
    
    const getData = (code) => data.table.find(d => d.code === code)?.monthlyValues[month] || 0;

    const rob = getData('1');
    const varCosts = getData('2') + getData('4');
    const mc = getData('result_mc');
    const fixedCosts = getData('5');
    const opResult = getData('result_op');
    const finCosts = getData('11');
    const netResult = getData('result_final');
    
    const chartData = {
        labels: ['Receita', 'Custos Var.', 'Margem Contrib.', 'Custos Fixos', 'Resultado Op.', 'Desp. Fin.', 'Resultado Líq.'],
        datasets: [{
            data: [
                [0, rob],
                [rob, rob - varCosts],
                [0, mc],
                [mc, mc - fixedCosts],
                [0, opResult],
                [opResult, opResult - finCosts],
                [0, netResult]
            ],
            backgroundColor: [
                '#3b82f6',
                '#ef4444',
                '#2563eb',
                '#dc2626',
                '#1d4ed8',
                '#b91c1c',
                netResult >= 0 ? '#10b981' : '#ef4444'
            ],
            barPercentage: 0.8,
            categoryPercentage: 1.0
        }]
    };
    
    if (waterfallChart) {
        waterfallChart.data = chartData;
        waterfallChart.update();
        return;
    }
    
    const options = getChartOptions('Composição do Resultado (Waterfall)');
    options.plugins.legend.display = false;
    options.type = 'bar';
    options.options = {
        indexAxis: 'y',
    };

    waterfallChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: options
    });
}

export function updateAllCharts(data, year) {
    updateLineChart(data);
    updateWaterfallChart(data);
}

export function getChartInstances() {
    return { lineChart, waterfallChart };
}
