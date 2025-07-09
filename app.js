import { initializeData, getScenarios, getAssumptions, updateAssumption } from './data_manager.js';
import { projectScenario } from './projection_engine.js';
import { calculateDRE } from './dre_calculator.js';
import { renderDRETable, updateKPIs, displayInsights, showLoading, hideLoading, renderScenarioSelector, renderAssumptionsPanel, renderCustomizationPanel, applyDashboardCustomization } from './ui_manager.js';
import { updateAllCharts, getChartInstances } from './chart_manager.js';
import { generateInsights } from './insights_engine.js';
import { exportToPDF, exportToCSV } from './export_manager.js';

let state = {
    currentScenario: 'Realista',
    year: 2025,
    historicalMonths: 3,
};

let currentDREData = null;
let customizationSettings = {};

const CUSTOMIZATION_STORAGE_KEY = 'dre_dashboard_customization';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initializeApp();
});

function initializeApp() {
    showLoading();
    initializeData(state.historicalMonths);
    
    renderScenarioSelector(getScenarios(), state.currentScenario);
    loadDashboardCustomization();
    
    setupEventListeners();
    updateDashboard();
    hideLoading();
}

function setupEventListeners() {
    document.getElementById('dre-table-body').addEventListener('change', handleTableInputChange);
    document.getElementById('scenario-selector').addEventListener('change', handleScenarioChange);
    document.getElementById('assumptions-panel').addEventListener('input', handleAssumptionChange);
    

    document.getElementById('export-btn').addEventListener('click', () => toggleDropdown('export-menu'));
    document.getElementById('customize-btn').addEventListener('click', () => toggleDropdown('customize-menu'));


    document.getElementById('export-pdf-btn').addEventListener('click', handleExportPDF);
    document.getElementById('export-csv-btn').addEventListener('click', handleExportCSV);
    

    document.getElementById('customize-options').addEventListener('change', handleCustomizationChange);


    window.addEventListener('click', (event) => {
        if (!event.target.closest('#export-btn') && !event.target.closest('#export-menu')) {
            document.getElementById('export-menu').classList.add('hidden');
        }
        if (!event.target.closest('#customize-btn') && !event.target.closest('#customize-menu')) {
            document.getElementById('customize-menu').classList.add('hidden');
        }
    });
}

function toggleDropdown(menuId) {
    const menu = document.getElementById(menuId);
    menu.classList.toggle('hidden');
}


function handleTableInputChange(event) {

}

function handleScenarioChange(event) {
    state.currentScenario = event.target.value;
    updateDashboard();
}

function handleAssumptionChange(event) {
    if (event.target.classList.contains('assumption-slider')) {
        const key = event.target.dataset.key;
        const value = parseFloat(event.target.value);
        updateAssumption(state.currentScenario, key, value);
        
        const valueSpan = document.getElementById(`assumption-value-${key}`);
        if(key === 'cogs_percentage' || key === 'fixed_cost_inflation'){
            valueSpan.textContent = `${(value * 100).toFixed(1)}%`;
        } else {
            valueSpan.textContent = `${(value * 100).toFixed(1)}% / mês`;
        }
        
        updateDashboard();
    }
}

function updateDashboard() {
    showLoading();
    const assumptions = getAssumptions(state.currentScenario);
    renderAssumptionsPanel(assumptions, state.currentScenario);

    const projectedData = projectScenario(state.currentScenario, state.historicalMonths);
    const dreData = calculateDRE(projectedData, state.year, state.historicalMonths);
    currentDREData = dreData; 
    
    renderDRETable(dreData.table, state.year, state.historicalMonths);
    updateKPIs(dreData.kpis);
    updateAllCharts(dreData, state.year);
    
    const insights = generateInsights(dreData, state.historicalMonths);
    displayInsights(insights);
    hideLoading();
}



function handleExportPDF(e) {
    e.preventDefault();
    if (currentDREData) {
        showLoading();
        setTimeout(() => {
            const chartInstances = getChartInstances();
            const insights = generateInsights(currentDREData, state.historicalMonths);
            currentDREData.insights = insights;
            exportToPDF(state, currentDREData, chartInstances);
            hideLoading();
        }, 50);
    }
    toggleDropdown('export-menu');
}

function handleExportCSV(e) {
    e.preventDefault();
    showLoading();
    setTimeout(() => {
        const allScenarios = getScenarios();
        const allScenarioData = {};
        allScenarios.forEach(scenario => {
            const projectedData = projectScenario(scenario, state.historicalMonths);
            const dreData = calculateDRE(projectedData, state.year, state.historicalMonths);
            allScenarioData[scenario] = dreData.table;
        });
        exportToCSV(allScenarioData, state.year);
        hideLoading();
    }, 50);
    toggleDropdown('export-menu');
}

function loadDashboardCustomization() {
    const savedSettings = localStorage.getItem(CUSTOMIZATION_STORAGE_KEY);
    const defaultSettings = {
        kpis: true,
        insights: true,
        lineChart: true,
        waterfallChart: true,
    };
    customizationSettings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    
    renderCustomizationPanel(customizationSettings);
    applyDashboardCustomization(customizationSettings);
}

function handleCustomizationChange(event) {
    if (event.target.type === 'checkbox') {
        const key = event.target.dataset.key;
        customizationSettings[key] = event.target.checked;
        localStorage.setItem(CUSTOMIZATION_STORAGE_KEY, JSON.stringify(customizationSettings));
        applyDashboardCustomization(customizationSettings);
    }
}
