function formatCurrency(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatPercentage(value) {
    return `${(value).toFixed(1)}%`.replace('.', ',');
}

function findAccount(tableData, code) {
    return tableData.find(acc => acc.code === code);
}

export function generateInsights(dreData, historicalMonths) {
    const { table, kpis } = dreData;
    if (!kpis || !table) return [];

    const insights = [];

    if (kpis.netMargin < 0) {
        insights.push({
            type: 'negative',
            text: `O cenário projeta um prejuízo líquido anual de <strong>${formatCurrency(kpis.netIncome)}</strong>. É crucial revisar a estrutura de custos ou estratégias de precificação.`
        });
    } else if (kpis.netMargin < 5) {
        insights.push({
            type: 'neutral',
            text: `A Margem Líquida de <strong>${formatPercentage(kpis.netMargin)}</strong> está baixa. Embora haja lucro, a rentabilidade é apertada, indicando pouca margem para absorver imprevistos.`
        });
    } else {
        insights.push({
            type: 'positive',
            text: `Projeção de uma Margem Líquida saudável de <strong>${formatPercentage(kpis.netMargin)}</strong>, com um lucro líquido anual de <strong>${formatCurrency(kpis.netIncome)}</strong>.`
        });
    }

    const operatingExpensesPercentage = kpis.grossMargin - kpis.operatingMargin;
    if (operatingExpensesPercentage > 30) {
        insights.push({
            type: 'neutral',
            text: `As Despesas Operacionais consomem <strong>${formatPercentage(operatingExpensesPercentage)}</strong> da sua receita. Avalie a estrutura de custos fixos para otimizar a lucratividade.`
        });
    }

    if (kpis.breakevenPoint > kpis.rob * 0.8 && kpis.rob > 0) {
        insights.push({
            type: 'negative',
            text: `O Ponto de Equilíbrio de <strong>${formatCurrency(kpis.breakevenPoint)}</strong> está perigosamente próximo da receita total projetada (<strong>${formatCurrency(kpis.rob)}</strong>). Alto risco operacional.`
        });
    } else if (kpis.breakevenPoint > 0 && kpis.rob > kpis.breakevenPoint) {
        insights.push({
            type: 'positive',
            text: `O Ponto de Equilíbrio é de <strong>${formatCurrency(kpis.breakevenPoint)}</strong> anuais, valor atingido com segurança dentro da projeção de receita.`
        });
    }

    const revenueAccount = findAccount(table, '1');
    const cogsAccount = findAccount(table, '4');

    if (revenueAccount && cogsAccount && historicalMonths < 12) {
        const firstProjectedMonth = historicalMonths;
        const lastHistoricalMonth = historicalMonths - 1;

        if (lastHistoricalMonth >= 0) {
            const revenueGrowthStart = revenueAccount.monthlyValues[firstProjectedMonth];
            const revenueGrowthLastHist = revenueAccount.monthlyValues[lastHistoricalMonth];
            
            const cogsGrowthStart = cogsAccount.monthlyValues[firstProjectedMonth];
            const cogsGrowthLastHist = cogsAccount.monthlyValues[lastHistoricalMonth];

            if (revenueGrowthLastHist > 0 && cogsGrowthLastHist > 0) {
                const revenueGrowthRate = (revenueGrowthStart / revenueGrowthLastHist) - 1;
                const cogsGrowthRate = (cogsGrowthStart / cogsGrowthLastHist) - 1;

                if (cogsGrowthRate > revenueGrowthRate + 0.001) { 
                    insights.push({
                        type: 'negative',
                        text: `Alerta: O Custo Variável (CMV) está projetado para crescer a um ritmo maior que a receita, comprimindo suas margens.`
                    });
                }
            }
        }
    }

    if (insights.length === 0) {
        insights.push({
            type: 'neutral',
            text: 'Nenhum insight crítico detectado. A operação parece estável com base nas projeções.'
        });
    }

    return insights;
}
