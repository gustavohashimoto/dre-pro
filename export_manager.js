import { MONTHS } from './dre_calculator.js';

function formatCurrency(value) {
    if (typeof value !== 'number') return 'N/A';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatPercentage(value) {
    if (typeof value !== 'number') return 'N/A';
    return `${(value * 100).toFixed(1)}%`.replace('.', ',');
}

export function exportToPDF(state, dreData, chartInstances) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const addHeader = (pageTitle) => {
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFont('helvetica', 'bold');
        doc.text(pageTitle, 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.setFont('helvetica', 'normal');
        doc.text(`Empresa Cliente | Cenário: ${state.currentScenario} | Ano: ${state.year}`, 14, 29);
    };

    const addFooter = () => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text('Página ' + String(i) + ' de ' + String(pageCount), doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
            doc.text(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, doc.internal.pageSize.height - 10);
        }
    };
    
    addHeader("Relatório de Análise Financeira");
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Indicadores Chave (KPIs)", 14, 45);
    doc.autoTable({
        startY: 50,
        body: [
            ['Resultado Líquido (Anual)', formatCurrency(dreData.kpis.netIncome)],
            ['Margem de Contribuição', formatPercentage(dreData.kpis.contributionMargin / 100)],
            ['Margem Líquida', formatPercentage(dreData.kpis.netMargin / 100)],
            ['Ponto de Equilíbrio (Anual)', formatCurrency(dreData.kpis.breakevenPoint)],
            ['EBITDA', formatCurrency(dreData.kpis.ebitda)],
        ],
        theme: 'striped',
        styles: { font: 'helvetica' },
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: { 0: { fontStyle: 'bold' } },
    });

    let finalY = doc.lastAutoTable.finalY;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Insights Automatizados", 14, finalY + 15);
    const insightsText = dreData.insights.map(i => `- ${i.text.replace(/<[^>]*>/g, '')}`).join('\n');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(insightsText, 14, finalY + 22, { maxWidth: 180, align: 'justify' });

    doc.addPage();
    addHeader("Demonstrativo de Resultados (DRE)");
    const tableHead = [['Descrição', `Total ${state.year}`, '% Vertical']];
    const tableBody = dreData.table.map(row => [
        { content: row.desc, styles: { fontStyle: row.isGroup ? 'bold' : 'normal' } },
        formatCurrency(row.total),
        formatPercentage(row.totalVerticalAnalysis)
    ]);
    doc.autoTable({
        head: tableHead,
        body: tableBody,
        startY: 40,
        theme: 'grid',
        styles: { font: 'helvetica', fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [7, 89, 133], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    doc.addPage();
    addHeader("Análise Gráfica");
    try {
        const lineChartImg = chartInstances.lineChart.toBase64Image();
        const waterfallChartImg = chartInstances.waterfallChart.toBase64Image();
        doc.text("Projeção: Receita vs. Resultado Líquido", 14, 45);
        doc.addImage(lineChartImg, 'PNG', 14, 50, 180, 90);
        doc.text("Composição do Resultado Projetado (Dez)", 14, 150);
        doc.addImage(waterfallChartImg, 'PNG', 14, 155, 180, 90);
    } catch(e) {
        doc.text("Não foi possível renderizar os gráficos.", 14, 50);
        console.error("PDF Charting Error:", e);
    }

    addFooter();

    doc.save(`DRE_Relatorio_${state.currentScenario}_${state.year}.pdf`);
}

export function exportToCSV(allScenarioData, year) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Cenário,Código,Descrição,${MONTHS.join(',')},Total ${year}\r\n`;

    for (const scenario in allScenarioData) {
        const table = allScenarioData[scenario];
        table.forEach(row => {
            const description = `"${row.desc.replace(/"/g, '""')}"`;
            const monthlyValues = row.monthlyValues.map(v => v.toFixed(2)).join(',');
            const total = row.total.toFixed(2);
            let line = [scenario, row.code, description, monthlyValues, total].join(',');
            csvContent += line + "\r\n";
        });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DRE_Todos_Cenarios_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
