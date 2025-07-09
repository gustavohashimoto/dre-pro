# Manual do Usuário: DRE Pro - Análise Financeira Estratégica

Bem-vindo ao DRE Pro, a sua plataforma completa para análise financeira, projeção de cenários e tomada de decisão estratégica. Este manual foi projetado para guiá-lo, passo a passo, por todas as funcionalidades da ferramenta, transformando dados brutos em inteligência para o seu negócio.

---

### **1. Visão Geral**

O DRE Pro é mais do que uma simples ferramenta de visualização de resultados; é um centro de análise estratégica. Nosso objetivo é capacitar gestores e empresários a irem além da contabilidade tradicional, permitindo:

*   **Analisar a performance financeira** de forma dinâmica e intuitiva.
*   **Projetar o futuro** com base em diferentes cenários (otimista, pessimista, realista).
*   **Entender o impacto de decisões** antes de tomá-las.
*   **Receber insights automáticos** para identificar riscos e oportunidades.

A ferramenta utiliza uma estrutura de **DRE Gerencial**, que separa custos e despesas em variáveis e fixos para calcular a Margem de Contribuição, um indicador vital para a gestão.

**Fluxo de Trabalho da Aplicação**


---

### **2. Primeiros Passos: Inserindo Seus Dados**

Para começar a análise, o primeiro passo é alimentar a ferramenta com os dados financeiros mensais da sua empresa. Você pode fazer isso de duas maneiras:

**Opção A: Inserção Manual (Recomendado para ajustes rápidos)**

1.  Na tela principal, a tabela da Demonstração do Resultado do Exercício (DRE) exibe os meses do ano.
2.  As células dos meses históricos (geralmente os primeiros do período) estarão habilitadas para edição.
3.  Clique em uma célula de uma conta de entrada (ex: "Receita de Produtos") e digite o valor correspondente para aquele mês.
4.  As contas de grupo (em negrito, como "RECEITA OPERACIONAL BRUTA") e as linhas de resultado (como "MARGEM DE CONTRIBUIÇÃO") são calculadas automaticamente e não podem ser editadas.

**Opção B: Importação via CSV (Recomendado para o carregamento inicial)**

1.  Clique no botão "Configurações" na barra lateral.
2.  Procure pela opção "Importar Dados" e baixe o nosso template CSV.
3.  Preencha o template com seus dados mensais. As colunas essenciais são:
    *   `data` (no formato AAAA-MM-01)
    *   `codigo_conta` (o código da conta, ex: "1.1" para Receita de Produtos)
    *   `valor` (o valor financeiro)
4.  Salve o arquivo e faça o upload na mesma seção. A plataforma processará os dados e preencherá a DRE automaticamente.

---

### **3. Análise Interativa: Explorando a Tabela de DRE**

A tabela de DRE é o coração da ferramenta. Ela é totalmente interativa para facilitar sua análise.

*   **Estrutura Hierárquica:** Contas principais (grupos) podem ser expandidas ou recolhidas para mostrar ou ocultar os detalhes das sub-contas, permitindo que você alterne entre uma visão macro e micro.
*   **Análise Vertical (% Receita):** Ao lado de cada valor mensal, há uma coluna `%` que mostra o peso daquela conta em relação à Receita Bruta do mesmo mês. Isso é crucial para entender a estrutura de custos e a rentabilidade.
*   **Cores e Destaques:**
    *   **Azul:** Valores de receita.
    *   **Vermelho:** Custos e despesas.
    *   **Verde/Vermelho (Resultados):** Linhas como "Resultado Líquido" são verdes se positivas e vermelhas se negativas.
    *   **Colunas de Projeção:** Os meses futuros, calculados pelo motor de projeção, têm um fundo azul claro para se diferenciarem dos dados históricos.

---

### **4. Projeções e Cenários: Planejando o Futuro**

Esta é a funcionalidade mais poderosa do DRE Pro. Simule o futuro financeiro da sua empresa com base em diferentes realidades de mercado.

1.  **Seleção de Cenário:** No topo da página, use o seletor para alternar entre os cenários:
    *   **Realista:** Baseado em dados históricos e projeções conservadoras.
    *   **Otimista:** Simula um crescimento de receita mais agressivo e custos controlados.
    *   **Pessimista:** Simula uma queda nas vendas ou aumento de custos.

2.  **Ajuste das Premissas:** Ao selecionar um cenário (exceto o Realista, que não usa premissas ajustáveis), o painel **"Premissas do Cenário"** à direita torna-se ativo. Nele, você pode usar os controles deslizantes (*sliders*) para ajustar as variáveis-chave da sua projeção:
    *   **Crescimento da Receita:** A taxa de crescimento mensal esperada para as vendas.
    *   **% Custo sobre Receita (CMV):** O percentual da receita que será consumido pelos custos variáveis dos produtos/serviços.
    *   **Inflação Custos Fixos:** A taxa de aumento mensal para despesas como aluguel e salários.

3.  **Análise em Tempo Real:** Cada vez que você ajusta uma premissa, a tabela de DRE, os KPIs e os gráficos são **recalculados instantaneamente**. Observe como uma mudança no crescimento da receita ou no custo impacta diretamente seu lucro líquido projetado para os próximos meses.

---

### **5. Insights Automáticos: Interpretando os Resultados**

O DRE Pro analisa seus dados e projeções para fornecer diagnósticos e recomendações automáticas.

#### **Indicadores Chave de Performance (KPIs)**

No topo do dashboard, você encontrará os principais KPIs, calculados com base no cenário selecionado:

| KPI | O que significa? | Por que é importante? |
| :--- | :--- | :--- |
| **Resultado Líquido** | O lucro ou prejuízo final da empresa no período, após todas as deduções. | O indicador final de rentabilidade e saúde financeira. |
| **Margem de Contribuição** | O percentual da receita que sobra após pagar os custos variáveis. | Mostra o quanto cada venda contribui para pagar os custos fixos e gerar lucro. |
| **Margem Líquida** | O percentual da receita que se transforma em lucro líquido. | Mede a eficiência geral da empresa em converter vendas em lucro. |
| **Ponto de Equilíbrio** | O faturamento anual necessário para cobrir todos os custos e despesas. | Define a meta mínima de vendas para não ter prejuízo. Acima deste ponto, a empresa começa a lucrar. |
| **EBITDA** | Lucro antes de juros, impostos, depreciação e amortização. | Mede a capacidade de geração de caixa puramente operacional da empresa. |

#### **Painel de Insights**

À direita, no painel **"Insights Automatizados"**, a ferramenta apresenta análises textuais baseadas nos seus dados. Os ícones indicam a natureza do insight:

*   <i data-lucide="check-circle-2"></i> **Positivo:** Um ponto forte ou uma tendência favorável foi identificado.
*   <i data-lucide="alert-triangle"></i> **Negativo:** Um ponto de atenção, risco ou tendência desfavorável.
*   <i data-lucide="info"></i> **Neutro:** Uma observação informativa sobre a estrutura financeira.

> *Exemplo de insight:* "Alerta: O Ponto de Equilíbrio de R$ 1.200.000,00 está perigosamente próximo da receita total projetada (R$ 1.350.000,00). Alto risco operacional."

---

### **6. Dashboard Personalizável**

Adapte a visualização do dashboard às suas necessidades.

1.  Clique no botão **"Personalizar"** no canto superior direito.
2.  Um menu aparecerá com opções para exibir ou ocultar diferentes componentes do dashboard.
3.  Marque ou desmarque as caixas de seleção para:
    *   **Cartões de KPI**
    *   **Insights Automáticos**
    *   **Gráfico de Projeção**
    *   **Gráfico Waterfall**
4.  Suas preferências são salvas automaticamente no seu navegador para futuras sessões.

---

### **7. Exportação de Dados e Relatórios**

Compartilhe suas análises ou trabalhe com os dados em outras ferramentas.

1.  Clique no botão **"Exportar"** no canto superior direito.
2.  Escolha uma das opções:

    *   **Exportar PDF:**
        *   Gera um relatório profissional e completo do **cenário atualmente selecionado**.
        *   O PDF inclui: um cabeçalho com o nome do cenário, os KPIs, a tabela de DRE anualizada, os gráficos de projeção e a lista de insights.
        *   Ideal para apresentar a sócios, investidores ou para reuniões gerenciais.

    *   **Exportar CSV:**
        *   Gera um arquivo de planilha contendo os dados mensais detalhados de **todos os cenários** (Realista, Otimista e Pessimista).
        *   Ideal para importar os dados em outras ferramentas de análise (como Excel ou Google Sheets) ou para fazer backup das suas projeções.
---
