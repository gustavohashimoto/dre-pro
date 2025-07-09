import { getChartOfAccounts, getEntries, getAssumptions } from './data_manager.js';

export function projectScenario(scenarioName, historicalMonths) {
    const accounts = getChartOfAccounts();
    const historicalEntries = getEntries(scenarioName);
    const assumptions = getAssumptions(scenarioName);
    const allMonthlyValues = {};


    accounts.forEach(acc => {
        allMonthlyValues[acc.code] = Array(12).fill(0);
        if (historicalEntries[acc.code]) {
            historicalEntries[acc.code].forEach((val, i) => {
                if (i < historicalMonths) {
                    allMonthlyValues[acc.code][i] = val;
                }
            });
        }
    });


    const lastHistoricalMonth = historicalMonths - 1;
    let lastHistoricalTotalRevenue = 0;
    accounts.forEach(acc => {
        if (acc.parentCode === '1') {
            lastHistoricalTotalRevenue += allMonthlyValues[acc.code][lastHistoricalMonth];
        }
    });

    const taxHistoricalRatios = {};
    accounts.forEach(acc => {
        if (acc.parentCode === '2') {
            taxHistoricalRatios[acc.code] = lastHistoricalTotalRevenue > 0 ? (allMonthlyValues[acc.code][lastHistoricalMonth] / lastHistoricalTotalRevenue) : 0;
        }
    });


    for (let m = historicalMonths; m < 12; m++) {
        const lastMonth = m - 1;

        accounts.forEach(acc => {
            if (!acc.isGroup && acc.projectionType === 'growth') {
                const lastMonthValue = allMonthlyValues[acc.code][lastMonth];
                allMonthlyValues[acc.code][m] = lastMonthValue * (1 + assumptions.revenue_growth.value);
            }
        });

        let currentMonthTotalRevenue = 0;
        accounts.forEach(acc => {
            if (acc.isGroup && acc.code === '1') {
                acc.children.forEach(child => {
                    currentMonthTotalRevenue += allMonthlyValues[child.code][m];
                });
                allMonthlyValues[acc.code][m] = currentMonthTotalRevenue;
            }
        });
        
        accounts.forEach(acc => {

            if (acc.isGroup || acc.projectionType === 'growth') return;

            const lastMonthValue = allMonthlyValues[acc.code][lastMonth];
            let projectedValue = 0;

            switch (acc.projectionType) {
                case 'percentage_of_revenue':
                     if (acc.parentCode === '4') {
                        projectedValue = currentMonthTotalRevenue * assumptions.cogs_percentage.value;
                     } else if (acc.parentCode === '2') {
                        projectedValue = currentMonthTotalRevenue * taxHistoricalRatios[acc.code];
                     }
                    break;
                case 'inflation':
                    projectedValue = lastMonthValue * (1 + assumptions.fixed_cost_inflation.value);
                    break;
                case 'constant':
                    projectedValue = lastMonthValue;
                    break;
                default: 
                    projectedValue = lastMonthValue;
            }
            allMonthlyValues[acc.code][m] = projectedValue;
        });
    }

    return { accounts, allMonthlyValues };
}
