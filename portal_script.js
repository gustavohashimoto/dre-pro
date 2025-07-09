document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const manualButton = document.getElementById('download-manual');
    const reportButton = document.getElementById('download-report');

    if (manualButton) {
        manualButton.addEventListener('click', () => {
            handlePdfGeneration(manualButton, 'dre_pro_user_manual.md', 'Manual_do_Usuario_DRE_Pro.pdf');
        });
    }

    if (reportButton) {
        reportButton.addEventListener('click', () => {
            handlePdfGeneration(reportButton, 'final_project_report.md', 'Relatorio_Final_DRE_Pro.pdf');
        });
    }
});

async function handlePdfGeneration(buttonElement, markdownUrl, outputFilename) {
    const originalContent = buttonElement.innerHTML;
    
    setLoadingState(buttonElement, true);

    try {
        await generatePdfFromMarkdown(markdownUrl, outputFilename);
    } catch (error) {
        console.error('Error during PDF generation:', error);
        alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
        setLoadingState(buttonElement, false, originalContent);
    }
}

function setLoadingState(buttonElement, isLoading, originalContent = '') {
    if (isLoading) {
        buttonElement.disabled = true;
        buttonElement.innerHTML = `
            <span class="icon-container animate-spin">
                <i data-lucide="loader-2" class="w-5 h-5"></i>
            </span>
            <span>Processando...</span>
        `;
        lucide.createIcons();
    } else {
        buttonElement.disabled = false;
        buttonElement.innerHTML = originalContent;
        lucide.createIcons();
    }
}

async function generatePdfFromMarkdown(markdownUrl, outputFilename) {
    const { jsPDF } = window.jspdf;

    try {
        const response = await fetch(markdownUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch markdown file: ${response.statusText}`);
        }
        const markdownText = await response.text();
        
        const renderer = new marked.Renderer();
        const htmlContent = marked.parse(markdownText, { renderer });

        const tempContainer = document.createElement('div');
        tempContainer.className = 'hidden-for-pdf';
        tempContainer.innerHTML = htmlContent;
        document.body.appendChild(tempContainer);
        
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'pt',
            format: 'a4'
        });

        await doc.html(tempContainer, {
            callback: function(doc) {
                doc.save(outputFilename);
                document.body.removeChild(tempContainer);
            },
            margin: [40, 40, 40, 40],
            autoPaging: 'text',
            x: 0,
            y: 0,
            width: 515, // A4 width in points (595) - margins (40*2)
            windowWidth: 1000, 
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}
