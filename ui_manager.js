import { MONTHS } from './dre_calculator.js';

function formatCurrency(value) {
    if (typeof value !== 'number') return 'N/A';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatPercentage(value) {
    if (typeof value !== 'number') return 'N/A';
    return `${(value * 100).toFixed(1)}%`.replace('.', ',');
}

export function renderDRETable(tableData, year, historicalMonths) {
    const tableHead = document.querySelector('#dre-table thead');
    const tableBody = document.getElementById('dre-table-body');
    
    let headerHtml = `<tr class="bg-gray-100">\n        <th class="text-left sticky left-0 bg-gray-100 z-10">Descrição / Data</th>`;
    MONTHS.forEach((month, i) => {
        headerHtml += `<th class="text-right ${i >= historicalMonths ? 'projected-col' : ''}">${month}</th><th class="text-right percentage-col ${i >= historicalMonths ? 'projected-col' : ''}">%</th>`;
    });
    headerHtml += `<th class="text-right">Total ${year}</th><th class="text-right percentage-col">%</th></tr>`;
    tableHead.innerHTML = headerHtml;

    let bodyHtml = '';
    const accountMap = {};
    tableData.forEach(acc => accountMap[acc.code] = acc);
    
    const hierarchyOrder = [
        "1", "1.1", "1.2",
        "2", "2.1",
        "4", "4.1",
        "result_mc",
        "5", "5.1", "5.2", "5.3",
        "result_op",
        "11", "11.1",
        "result_final"
    ];

    const levelMap = {
        "1":0, "1.1":1, "1.2":1,
        "2":0, "2.1":1,
        "4":0, "4.1":1,
        "result_mc":0,
        "5":0, "5.1":1, "5.2":1, "5.3":1,
        "result_op":0,
        "11":0, "11.1":1,
        "result_final":0
    };

    hierarchyOrder.forEach(code => {
        const account = accountMap[code];
        if (!account) return;

        let rowClass = '';
        if (account.type === 'RESULT') rowClass = 'result-row';
        if (account.type === 'FINAL_RESULT') rowClass = 'final-result-row';
        if (account.isGroup && !rowClass) rowClass = 'group-row';
        
        let valueClass = (account.operator === '-') ? 'text-negative' : 'text-positive';
        if (account.type === 'REVENUE') valueClass = 'text-blue-600';
        if(account.desc.includes('RESULTADO')) {
             valueClass = account.total >= 0 ? 'text-positive' : 'text-negative';
        }

        bodyHtml += `<tr class="${rowClass}">`;
        bodyHtml += `<td class="font-semibold sticky left-0 bg-inherit z-10 indent-${levelMap[code] || 0}">${account.desc}</td>`;

        account.monthlyValues.forEach((value, m) => {
            const isProjected = m >= historicalMonths;
            const colClass = isProjected ? 'projected-col' : '';
            if (account.isGroup || isProjected) {
                const effectiveValueClass = account.desc.includes('RESULTADO') ? (value >= 0 ? 'text-positive' : 'text-negative') : valueClass;
                bodyHtml += `<td class="text-right ${effectiveValueClass} ${colClass}">${formatCurrency(value)}</td>`;
            } else {
                bodyHtml += `<td class="text-right ${colClass}"><input type="number" class="financial-input" data-account-id="${account.code}" data-month="${m}" value="${value}" disabled></td>`;
            }
            bodyHtml += `<td class="text-right percentage-col ${colClass}">${formatPercentage(account.verticalAnalysis[m])}</td>`;
        });
        
        bodyHtml += `<td class="text-right font-bold ${valueClass}">${formatCurrency(account.total)}</td>`;
        bodyHtml += `<td class="text-right percentage-col font-bold">${formatPercentage(account.totalVerticalAnalysis)}</td>`;
        bodyHtml += `</tr>`;
    });
    
    tableBody.innerHTML = bodyHtml;
}

export function updateKPIs(kpis) {
    const kpiContainer = document.getElementById('kpi-cards');
    const kpiData = [
        { title: 'Resultado Líquido (Anual)', value: formatCurrency(kpis.netIncome), icon: 'dollar-sign', color: kpis.netIncome >= 0 ? 'green' : 'red' },
        { title: 'Margem de Contribuição', value: formatPercentage(kpis.contributionMargin/100), icon: 'pie-chart', color: 'blue' },
        { title: 'Margem Líquida', value: formatPercentage(kpis.netMargin/100), icon: 'percent', color: 'indigo' },
        { title: 'Ponto de Equilíbrio (Anual)', value: formatCurrency(kpis.breakevenPoint), icon: 'target', color: 'yellow' },
    ];

    kpiContainer.innerHTML = kpiData.map(kpi => `
        <div class="kpi-card bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex items-start justify-between">
            <div>
                <p class="text-sm text-gray-500">${kpi.title}</p>
                <p class="kpi-value text-gray-900">${kpi.value}</p>
            </div>
            <div class="p-3 rounded-full bg-${kpi.color}-100">
                <i data-lucide="${kpi.icon}" class="w-6 h-6 text-${kpi.color}-600"></i>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

export function renderScenarioSelector(scenarios, currentScenario) {
    const selector = document.getElementById('scenario-selector');
    selector.innerHTML = scenarios.map(s => `<option value="${s}" ${s === currentScenario ? 'selected' : ''}>${s}</option>`).join('');
}

export function renderAssumptionsPanel(assumptions, scenarioName) {
    const panel = document.getElementById('assumptions-panel');
    
    let html = '';
    for (const key in assumptions) {
        const item = assumptions[key];
        let displayValue;
        if(key === 'cogs_percentage' || key === 'fixed_cost_inflation'){
            displayValue = `${(item.value * 100).toFixed(1)}%`;
        } else {
             displayValue = `${(item.value * 100).toFixed(1)}% / mês`;
        }

        html += `
            <div class="assumption-item">
                <label for="assumption-${key}">
                    <span>${item.label}</span>
                    <span id="assumption-value-${key}" class="assumption-value">${displayValue}</span>
                </label>
                <input type="range" id="assumption-${key}" data-key="${key}"
                       class="assumption-slider"
                       min="${item.min}" max="${item.max}" step="${item.step}" value="${item.value}">
            </div>
        `;
    }
    panel.innerHTML = html;
}

export function displayInsights(insights) {
    const container = document.getElementById('insights-container');
    if (!insights || insights.length === 0) {
        container.innerHTML = `<p class="text-sm text-gray-500">Nenhum insight disponível para o cenário atual.</p>`;
        return;
    }

    const iconMap = {
        positive: { icon: 'check-circle-2', color: 'green' },
        negative: { icon: 'alert-triangle', color: 'red' },
        neutral: { icon: 'info', color: 'blue' },
    };

    container.innerHTML = insights.map(insight => {
        const config = iconMap[insight.type] || iconMap.neutral;
        return `
            <div class="flex items-start space-x-3 p-1">
                <div class="flex-shrink-0 mt-0.5">
                    <div class="p-1.5 bg-${config.color}-100 rounded-full">
                         <i data-lucide="${config.icon}" class="w-5 h-5 text-${config.color}-600"></i>
                    </div>
                </div>
                <div class="flex-1">
                    <p class="text-sm text-gray-700">${insight.text}</p>
                </div>
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

export function renderCustomizationPanel(settings) {
    const container = document.getElementById('customize-options');
    const options = [
        { key: 'kpis', label: 'Cartões de KPI' },
        { key: 'insights', label: 'Insights Automáticos' },
        { key: 'lineChart', label: 'Gráfico de Projeção' },
        { key: 'waterfallChart', label: 'Gráfico Waterfall' },
    ];
    
    container.innerHTML = options.map(opt => `
        <div class="customize-item py-1">
            <label for="customize-${opt.key}">${opt.label}</label>
            <input type="checkbox" id="customize-${opt.key}" data-key="${opt.key}" 
                   class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" 
                   ${settings[opt.key] ? 'checked' : ''}>
        </div>
    `).join('');
}

export function applyDashboardCustomization(settings) {
    const components = {
        kpis: document.getElementById('kpi-cards'),
        insights: document.getElementById('insights-section'),
        lineChart: document.getElementById('line-chart-container'),
        waterfallChart: document.getElementById('waterfall-chart-container'),
    };
    for (const key in settings) {
        if (components[key]) {
            if (settings[key]) {
                components[key].style.display = '';
            } else {
                components[key].style.display = 'none';
            }
        }
    }
}

export function showLoading() {
    document.getElementById('loading-spinner').style.display = 'flex';
    document.getElementById('dre-container-wrapper').style.display = 'none';
    const mainContent = document.querySelector('main');
    mainContent.style.pointerEvents = 'none';
    mainContent.style.opacity = '0.7';

}

export function hideLoading() {
    document.getElementById('loading-spinner').style.display = 'none';
    document.getElementById('dre-container-wrapper').style.display = 'block';
    const mainContent = document.querySelector('main');
    mainContent.style.pointerEvents = 'auto';
    mainContent.style.opacity = '1';
}
