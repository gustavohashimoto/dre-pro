const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function calculateDRE(data, year, historicalMonths) {
    const { accounts, allMonthlyValues } = data;
    const valuesByCode = {};
    const totalYearValues = {};

    accounts.forEach(account => {
        valuesByCode[account.code] = allMonthlyValues[account.code] ? [...allMonthlyValues[account.code]] : Array(12).fill(0);
    });

    accounts.forEach(account => {
        if (account.isGroup) {
            if (account.formula) {
                const [op1Code, operator, ...restCodes] = account.formula;
                for (let m = 0; m < 12; m++) {
                    let result = valuesByCode[op1Code][m];
                    restCodes.forEach(code => {
                        result -= valuesByCode[code][m];
                    });
                    valuesByCode[account.code][m] = result;
                }
            } else {
                const monthlySums = Array(12).fill(0);
                account.children.forEach(child => {
                    if (valuesByCode[child.code]) {
                        for (let m = 0; m < 12; m++) {
                            monthlySums[m] += valuesByCode[child.code][m];
                        }
                    }
                });
                valuesByCode[account.code] = monthlySums;
            }
        }
    });

    accounts.forEach(account => {
        totalYearValues[account.code] = valuesByCode[account.code].reduce((a, b) => a + b, 0);
    });

    const robValues = valuesByCode['1'];
    const tableData = accounts.map(account => {
        const monthlyValues = valuesByCode[account.code];
        const robTotal = robValues.reduce((a, b) => a + b, 0);
        const verticalAnalysis = monthlyValues.map((val, m) => (robValues[m] !== 0 ? (val / robValues[m]) : 0));
        
        return {
            ...account,
            monthlyValues,
            verticalAnalysis,
            total: totalYearValues[account.code],
            totalVerticalAnalysis: robTotal !== 0 ? (totalYearValues[account.code] / robTotal) : 0
        };
    });

    const kpis = calculateKPIs(valuesByCode, totalYearValues);

    return {
        table: tableData,
        kpis,
        months: MONTHS
    };
}

function calculateKPIs(valuesByCode, totalYearValues) {
    const robTotal = totalYearValues['1'] || 0;
    const cmvTotal = totalYearValues['4'] || 0;
    const grossProfitTotal = robTotal - cmvTotal;
    const mcTotal = totalYearValues['result_mc'] || 0;
    const netIncomeTotal = totalYearValues['result_final'] || 0;
    const opResultTotal = totalYearValues['result_op'] || 0;
    const depreciationTotal = totalYearValues['5.3'] || 0;
    const ebitdaTotal = opResultTotal + depreciationTotal;

    const grossMargin = robTotal ? (grossProfitTotal / robTotal) * 100 : 0;
    const contributionMargin = robTotal ? (mcTotal / robTotal) * 100 : 0;
    const operatingMargin = robTotal ? (opResultTotal / robTotal) * 100 : 0;
    const netMargin = robTotal ? (netIncomeTotal / robTotal) * 100 : 0;
    const ebitdaMargin = robTotal ? (ebitdaTotal / robTotal) * 100 : 0;
    
    const fixedCostsTotal = totalYearValues['5'] || 0;
    const breakevenPoint = contributionMargin > 0 ? (fixedCostsTotal / (contributionMargin / 100)) : 0;

    return {
        netIncome: netIncomeTotal,
        contributionMargin: contributionMargin,
        netMargin: netMargin,
        ebitda: ebitdaTotal,
        ebitdaMargin: ebitdaMargin,
        breakevenPoint: breakevenPoint,
        grossMargin: grossMargin,
        operatingMargin: operatingMargin,
        rob: robTotal
    };
}


export { calculateDRE, MONTHS };
