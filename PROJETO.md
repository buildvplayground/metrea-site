# PROJETO — Métrea (site institucional)

**Cliente:** Métrea (Global Partitions do Brasil / Grupo ASI). Sistemas construtivos a seco de
alto padrão: **Fachadas Ventiladas em HPL (Trespa®)**, **Divisórias Sanitárias**,
**Revestimento de Paredes em HPL** e **Lockers**. São Paulo/SP.
**Tagline:** *Precisão do início ao fim.*

**Origem do material:** Google Drive
`158mVG2B2ENTokcDgcia9vOqMaTo1bXH3` (via rclone `gdrive:`).

## Conceito de design (variação vs. ledger)
Setor adjacente ao de engenharia/construção que domina o ledger. Diferenciação:
linguagem de **METROLOGIA / MÉTRICA** (o próprio nome = métrica + precisão) — linhas de cota,
ticks de coordenada, marcas de registro e a **malha triangular modular** derivada da
construção da marca (quadrado de 4 triângulos). Cor **real da marca**: ciano #00BAC8 +
azul-profundo #054C72 sobre off-white arquitetônico e navy. Evita o clichê reprovado
"dark + serifada + brilho teal". Tipografia técnica (DIN/engenharia) + mono para cotas.

## Checklist de etapas
- [x] 1. Extrair do Drive (marca, copy, fotos curadas) — via rclone/MCP
- [x] 2. Organizar pastas + PROJETO.md/state.json
- [x] 2b. Repositório GitHub `dev-buildv/metrea-site` (privado)
- [x] 3. Design system (paleta/tipografia/tokens + direcao-estilo)
- [x] 4. Copy estruturada (fonte: apresentação comercial + ebook fachada + projetos)
- [x] 5. Front-end (Site/) + revisão adversarial
- [x] 6. Tratar imagens (webp) + auditar responsividade (overflow 0)
- [x] 7. Módulos LGPD (banner + política) / tags (sem IDs → pendência)
- [ ] 8. Revisão humana
- [ ] 9. Deploy (deploy-vercel/ + public_html/) — gate humano

## Inventário do material (Drive)
- **Marca:** manual de marca (PDF, mar/2020) + arte final (marca_metrea_af.pdf, 9 pág vetor).
  Logo reconstruído em PNG transparente (icon + horizontal, versões teal e branca) em `Marca/logo/`.
- **Copy:** Apresentação Comercial (PDF), E-book Fachadas Ventiladas (gdoc), Manual Produtos,
  PROJETOS-SITE (portfólio com 14+ obras).
- **Fotos:** `FOTOS/SITE/` curado por página (carrossel, fundos, sobre, revestimentos, lockers,
  projetos) — processadas para webp pelo agente de imagens.

## Pendências (ver state.json)
- WhatsApp real (placeholder 5511XXXXXXXXX). Telefone fixo conhecido: (11) 2548-1555.
- GTM/GA4/Pixel IDs (não fornecidos → tags puladas).
- Domínio / secrets de deploy.
