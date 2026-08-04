# Cassino Arcano — glossário canônico

> Glossário apenas. **Não** contém regras de implementação, detalhes técnicos, balanças numéricas, etapas de verificação nem decisões arquiteturais. Esses ficam em:
>
> - `docs/adr/` — decisões arquiteturais
> - `docs/specs/` — especificações de features
> - `docs/workflow.md` — processo SDD
> - `.github/workflows/` — automações

## Conceitos do domínio

**Ato** — uma rodada curta de um jogo dentro de uma expedição. Cinco atos por expedição, com meta crescente de lucro. Termo único, compartilhado pelo estado do jogo e pela interface. Ato atual, ato concluído, novo ato, fim de ato.

**Talismã** — modificador passivo que o jogador adquire na loja entre atos para alterar recompensas da rodada. Tem nome público, descrição curta, custo em fichas, regra de disparo e efeito numérico. Uma expedição carrega até três Talismãs.

**Expedição** — sequência completa de cinco atos com a mesma coleção de Talismãs, vidas, metas e regras. Termina em vitória ou derrota.

**Vida** — recurso de continuidade da expedição. Consumida quando o ato termina sem meta atingida e o jogador não pode continuar. Três vidas por expedição.

**Saldo** — quantidade de fichas virtuais da expedição. Começa em 250, varia por aposta, compra de Talismã e recompensa de evento. Não conversível.

**Aposta** — quantidade de saldo comprometida em uma rodada (mão ou giro). Risco definido pela probabilidade do jogo base; retorno definido pelo jogo base e por Talismãs aplicáveis.

**Recompensa** — saldo creditado por resultado da rodada. Calculada como `aposta + líquido`. Líquido pode ser negativo (perda) ou zero (empate).

**Loja** — modal exibido entre atos com até três Talismãs disponíveis para escolha. O jogador compra um, pula ou adquire. Escolhas são públicas e o custo é transparente.

**Catálogo de Talismãs** — conjunto estático de Talismãs possíveis na expedição. Blackjack e roleta têm catálogos próprios. Cada Talismã aparece no máximo uma vez por catálogo.

**Blackjack** — jogo de cartas. Dealer parado em 17. Ás vale 1 ou 11. Blackjack natural paga 3:2.

**Roleta** — jogo de apostas. Roleta europeia com 37 resultados equiprováveis. Apostas externas pagam 1:1, dúzias pagam 2:1, número cheio paga 35:1.

**Rodada** — unidade mínima de aposta dentro de um ato. Mão de blackjack ou giro de roleta.

**Mesa** — superfície virtual onde cartas ou roda são apresentadas. Termo neutro; ambos os jogos usam a mesma palavra.

**Jogador** — pessoa controlando a expedição. Singular, mesmo se houver interface para múltiplas.

**Casa** — oponente (dealer do blackjack) ou sistema de probabilidades (roleta). Fonte dos resultados, nunca do design do jogador.

**Quebra de resultado** — sequência de recompensas reveladas após uma rodada: base da aposta, modificadores de Talismãs, total líquido. Exibida de forma visível e textual, nunca implícita.

**Sound toggle** — controle de áudio procedural. Persistido em `localStorage`. Botão visível no topo.

**Reduced motion** — modo de acessibilidade do sistema operacional. Animações longas, shake e partículas são suprimidas quando ativo.

## Categorias de jogo

**Jogo base** — regras originais e imutáveis do blackjack e da roleta. Não modificadas por Talismãs.

**Talismã ativo** — Talismã da expedição atual cujo efeito se aplica em uma situação específica (vitória, blackjack natural, giro ímpar, etc.).

**Talismã em loja** — Talismã do catálogo ainda não adquirido na expedição atual.

**Talismã expirado** — categoria inexistente. Talismãs não expiram; ficam até o fim da expedição ou são perdidos junto dela.

## Princípios de jogo

**Sorte administrável** — o jogador pode mitigar ou amplificar risco, mas não pode eliminar sorte do jogo base. Builds mudam recompensa, não probabilidade oculta.

**Probabilidade transparente** — pagamentos e chances de cada aposta visíveis antes do comprometimento. Sem "near miss" fabricado, sem animação que sugira retorno maior do que o real.

**Recompensa visível** — qualquer retorno ≤ valor apostado é comunicado como tal, nunca como vitória.

**Decisão auditável** — toda rodada tem um histórico textual mostrando número ou cartas, aposta, retorno e líquido. Permitir que o jogador reconstrua a causa do resultado.

## Estado de jogo (nomes de propriedades)

Para referência. Implementação em código; sem regras de design aqui.

- `act` — índice 0–4 do ato atual
- `lives` — vidas restantes 0–3
- `balance` — saldo em fichas
- `actStart` — saldo capturado no início do ato (para cálculo de lucro)
- `rounds` — contador de rodadas no ato
- `relics` — lista de identificadores de Talismãs adquiridos
- `streak` — sequência de vitórias ou derrotas
- `target` — meta de lucro do ato atual (derivado de `targets[act]`)

## Verbos do domínio

**Apostar** — comprometer fichas de saldo em uma rodada.

**Distribuir** — ação específica do blackjack: dealer entrega duas cartas a si e ao jogador.

**Pedir** — ação específica do blackjack: jogador recebe mais uma carta.

**Parar** — ação específica do blackjack: jogador encerra sua mão e o dealer joga.

**Girar** — ação específica da roleta: bola é sorteada e apostas resolvidas.

**Adquirir** — comprar um Talismã na loja, debitando o custo do saldo.

**Pular** — fechar a loja sem comprar Talismã.

**Avançar** — ato atual termina com meta atingida, sistema abre loja do próximo ato.

**Recuar** — ato atual termina com meta perdida, sistema consome uma vida e reinicia o mesmo ato.

**Concluir** — expedição termina após o quinto ato bem-sucedido.

**Quebrar** — expedição termina após todas as vidas serem consumidas.

## Estilo

- Glossário canônico: termos em **negrito** ao aparecer pela primeira vez em uma seção.
- Vocabulário consistente com o jogo base quando existir (`distribuir`, `parar`, `girar`).
- Sem anglicismos quando houver equivalente em português.
- Sem nomes próprios de terceiros (sem "Jokers", "Boss Blind", etc.).
