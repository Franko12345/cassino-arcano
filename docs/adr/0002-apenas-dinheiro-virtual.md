# Dinheiro exclusivamente virtual

- **Status:** Aceito
- **Data:** 2026-08-04
- **Contexto:** Cassino Arcano

## Contexto e problema

O cassino é jogado em um ambiente regulatório ambíguo. Estudos sobre migração de social casino para gambling real (Kim et al., 2015) mostram que a existência de compra de créditos virtuais é o preditor mais forte de migração para jogo de dinheiro real. Estudos de neuroimagem (Clark et al., 2009) mostram que "near misses" ativam as mesmas regiões cerebrais que vitórias reais. O UKGC proíbe explícita e formalmente features de "illusion of control" e celebração de retorno ≤ custo em produtos licenciados.

## Decisão

O Cassino Arcano usa exclusivamente créditos virtuais sem compra, sem saque e sem mercado secundário. Talismãs mudam recompensas visíveis; nunca alteram a probabilidade do jogo base. Retorno igual à aposta nunca é celebrado como vitória. Sem autoplay, sem "double or nothing" após perda, sem mensagem "você estava ganhando!".

## Alternativas consideradas

- **Microtransação cosmética opcional** — pacotes visuais pagos, sem alterar odds. Mitigaria pressão de migração mas não elimina. Adiciona IAP, KYC, balanceamento de "cofre" e revisão legal.
- **Venda direta de créditos** — violaria decisão. Mesmo com disclaimer virtual, expõe o jogador a estudos de migração.
- **"Free-to-play" com anúncios** — intromete o operador entre o jogador e a roleta em momentos sensíveis. Documentado como redutor de "foco", pior para game feel.

## Consequências

**Positivas:**

- Sem pressão regulatória direta. Moeda virtual não-conversível escapa da definição de gambling em várias jurisdições (Holanda, UK 2019).
- Sem necessidade de KYC, balanceamento de conta, auto-exclusão, time limits ou audit trail de gastos.
- Game feel honesto: retorno igual à aposta é texto neutro, "você recuperou sua aposta", nunca confete.

**Negativas:**

- Sem monetização. Reposiciona o projeto como demonstração técnica ou portfólio, não como produto.
- Se um dia virar produto, a infra de dinheiro real precisa ser reconstruída do zero, sem reaproveitar o motor atual.

## Quando reconsiderar

1. O projeto ganhar uma camada de monetização explícita com auditoria legal.
2. Surgir evidência nova sobre game design responsável que sugira ajustes no modelo de recompensa.

## Referências

- Kim et al., 2015 — "Social casino games and their links to gambling"
- Clark et al., 2009 — "Pathological gamblers recruit the same neural substrates for winning as for near-misses"
- UKGC 2024 — "Safer by design: changes to online games"
- W3C WAI 2.1 SC 2.2.2, 2.3.1, 1.4.2 — acessibilidade de animação
