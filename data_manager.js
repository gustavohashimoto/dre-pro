let chartOfAccounts = [];
let scenarios = {};

const DRE_STRUCTURE_RAW = [
    {"code": "1", "desc": "RECEITA OPERACIONAL BRUTA (ROB)", "type": "REVENUE", "isGroup": true, "operator": "+", projectionType: 'growth'},
    {"code": "1.1", "desc": "Receita de Produtos", "parentCode": "1", "type": "REVENUE", "operator": "+", projectionType: 'growth', weight: 0.6},
    {"code": "1.2", "desc": "Receita de Serviços", "parentCode": "1", "type": "REVENUE", "operator": "+", projectionType: 'growth', weight: 0.4},
    {"code": "2", "desc": "Impostos sobre Vendas", "type": "VARIABLE_EXPENSE", "isGroup": true, "operator": "-", projectionType: 'percentage_of_revenue'},
    {"code": "2.1", "desc": "Simples Nacional", "parentCode": "2", "type": "VARIABLE_EXPENSE", "operator": "-", projectionType: 'percentage_of_revenue'},
    {"code": "4", "desc": "Custo da Mercadoria Vendida (CMV)", "type": "VARIABLE_COST", "isGroup": true, "operator": "-", projectionType: 'percentage_of_revenue'},
    {"code": "4.1", "desc": "Matéria-prima", "parentCode": "4", "type": "VARIABLE_COST", "operator": "-", projectionType: 'percentage_of_revenue'},
    {"code": "result_mc", "desc": "(=) MARGEM DE CONTRIBUIÇÃO", "type": "RESULT", "isGroup": true, "formula": ["1", "-", "2", "-", "4"]},
    {"code": "5", "desc": "Custos e Despesas Fixas", "type": "FIXED_COST", "isGroup": true, "operator": "-", projectionType: 'inflation'},
    {"code": "5.1", "desc": "Folha de pagamento", "parentCode": "5", "type": "FIXED_COST", "operator": "-", projectionType: 'inflation'},
    {"code": "5.2", "desc": "Aluguel", "parentCode": "5", "type": "FIXED_COST", "operator": "-", projectionType: 'inflation'},
    {"code": "5.3", "desc": "Depreciação", "parentCode": "5", "type": "FIXED_EXPENSE", "operator": "-", "isDepreciation": true, projectionType: 'constant'},
    {"code": "result_op", "desc": "(=) RESULTADO OPERACIONAL", "type": "RESULT", "isGroup": true, "formula": ["result_mc", "-", "5"]},
    {"code": "11", "desc": "Despesas Financeiras", "type": "FINANCIAL_EXPENSE", "isGroup": true, "operator": "-", projectionType: 'constant'},
    {"code": "11.1", "desc": "Juros de Empréstimos", "parentCode": "11", "type": "FINANCIAL_EXPENSE", "operator": "-", projectionType: 'constant'},
    {"code": "result_final", "desc": "(=) RESULTADO LÍQUIDO", "type": "FINAL_RESULT", "isGroup": true, "formula": ["result_op", "-", "11"]}
];

function buildHierarchy(items) {
    const itemsByCode = {};
    const flatList = [];
    
    items.forEach(item => {
        itemsByCode[item.code] = { ...item, children: [] };
        flatList.push(itemsByCode[item.code]);
    });
    
    flatList.forEach(item => {
        if (item.parentCode && itemsByCode[item.parentCode]) {
            itemsByCode[item.parentCode].children.push(item);
        }
    });

    return flatList;
}

export function initializeData(historicalMonths) {
    chartOfAccounts = buildHierarchy(DRE_STRUCTURE_RAW);
    
    const baseEntries = {
        "1.1": [45000, 48000, 52000], 
        "1.2": [85000, 92000, 98000],
        "2.1": [7800, 8400, 9000],
        "4.1": [39000, 42000, 45000],
        "5.1": [32000, 32000, 33000],
        "5.2": [4500, 4500, 4500],
        "5.3": [1500, 1500, 1500],
        "11.1": [800, 750, 700]
    };

    scenarios = {
        'Realista': {
            entries: { ...baseEntries },
            assumptions: {
                revenue_growth: { label: 'Crescimento da Receita', value: 0.02, min: -0.05, max: 0.1, step: 0.005 },
                cogs_percentage: { label: '% Custo sobre Receita (CMV)', value: 0.35, min: 0.2, max: 0.6, step: 0.01 },
                fixed_cost_inflation: { label: 'Inflação Custos Fixos', value: 0.005, min: 0, max: 0.05, step: 0.001 },
            }
        },
        'Otimista': {
            entries: { ...baseEntries },
            assumptions: {
                revenue_growth: { label: 'Crescimento da Receita', value: 0.05, min: -0.05, max: 0.1, step: 0.005 },
                cogs_percentage: { label: '% Custo sobre Receita (CMV)', value: 0.33, min: 0.2, max: 0.6, step: 0.01 },
                fixed_cost_inflation: { label: 'Inflação Custos Fixos', value: 0.005, min: 0, max: 0.05, step: 0.001 },
            }
        },
        'Pessimista': {
            entries: { ...baseEntries },
            assumptions: {
                revenue_growth: { label: 'Crescimento da Receita', value: -0.01, min: -0.05, max: 0.1, step: 0.005 },
                cogs_percentage: { label: '% Custo sobre Receita (CMV)', value: 0.40, min: 0.2, max: 0.6, step: 0.01 },
                fixed_cost_inflation: { label: 'Inflação Custos Fixos', value: 0.01, min: 0, max: 0.05, step: 0.001 },
            }
        }
    };
}

export function getChartOfAccounts() {
    return chartOfAccounts;
}

export function getEntries(scenario) {
    return scenarios[scenario].entries;
}

export function getAssumptions(scenario) {
    return scenarios[scenario] ? scenarios[scenario].assumptions : {};
}

export function updateAssumption(scenario, key, value) {
    if (scenarios[scenario] && scenarios[scenario].assumptions[key]) {
        scenarios[scenario].assumptions[key].value = value;
    }
}

export function getScenarios() {
    return Object.keys(scenarios);
}
