# Pesquisa: Design de jogo de azar + salvaguardas de jogo responsável para roguelite de cassino com moeda virtual

> **TL;DR.** Um roguelite de cassino com **moeda puramente virtual, não conversível, sem mercado secundário** fica juridicamente fora do enquadramento de "loteria/jogo de azar" na maioria das jurisdições (teste de "integração ao jogo de habilidade" do Conselho de Estado da Holanda, 2022; silêncio do UKGC sobre loot boxes não-conversíveis). Mas isso **não elimina risco de dano**: a literatura de dark patterns + reinforcement de razão variável + near-miss dopaminérgico + migração para cassino real (Kim et al., 2015) mostra que a mecânica em si é de risco. A saída é adotar, *por desenho* (não só por termo legal), as guardrails do RTS 14 do UKGC + taxonomia de Gray et al. (2024) de dark patterns, e converter mecânicas de cassino puro em sistemas roguelite onde a habilidade do jogador determina o desfecho em janelas curtas, com falhas claras, sem "quase-acertos" enganosos.
>
> **Referência viva (este artefato).** Salvo em `/home/hermes/pesquisa-roguelite-casino/sintese.md`.

---

## 1. Enquadramento jurídico: quando "moeda virtual" ainda é jogo de azar?

### 1.1. Quatro elementos clássicos da definição de jogo de azar
Quase toda jurisdição adota a fórmula do *Belgian Gaming Act* (1999) — "componente de jogo + aposta + chance + ganho/perda". Basta que **um** deles falhe para o produto cair fora da regulação de jogos de azar. Lojas de loot boxes não-conversíveis geralmente **não** satisfazem "aposta de valor pecuniário" — e por isso escapam. Mas há exceções perigosas.

| Jurisdição | Posição (2024-2026) | Risco para o projeto |
|---|---|---|
| **Bélgica** | Proibição de *todas* loot boxes pagas (mesmo sem valor de revenda). **Multa até €800k + prisão de até 5 anos**. Belgian Gaming Commission admite informalmente que a proibição é "desproporcional" mas não a revogou. | **GEO-BLOQUEIO obrigatório** se o jogo tiver qualquer mecânica de loot box paga e for distribuído na Bélgica. Não há defesa viável. Fonte: [Video Games Federation Belgium](https://vgfb.be/loot-boxes-in-belgium/), [Promise Legal](https://blog.promise.legal/loot-box-laws-game-developers/). |
| **Holanda** | Decisão de 2022 do *Administrative Jurisdiction Division* (caso EA/FIFA): loot boxes integradas a um jogo maior de habilidade **não** são jogo de azar — desde que (a) façam parte de um jogo mais amplo, (b) o jogo seja de habilidade, (c) sejam obtidas predominantemente por jogar, e (d) não sejam operadas em plataforma separada. | Fortemente a favor do modelo roguelite, se o jogador ganhar moeda virtual *jogando* e não *comprando diretamente*. Fonte: [Dentons, 2023](https://www.dentons.com/en/insights/guides-reports-and-whitepapers/2023/june/28/loot-box-regulation-in-the-eu-loading-status). |
| **Reino Unido** | UKGC considera loot boxes não-pagas como não-jogo de azar (resposta oficial em 2019; reafirmada em 2024). Mas o RTS 14 do *Remote Gambling and Software Technical Standards* **se aplica a qualquer produto de jogo** licenciado, e tem sido usado como referência informal de "design responsável". | Boa fronteira. Se a webapp for roteada por KYC leve e considerar-se "jogo social" (sem saque), pode-se apoiar no UKGC por meio de *Industry Group Codes* (BGC, 2024). Fonte: [Gambling Commission RTS 14](https://www.gamblingcommission.gov.uk/manual/guidance-to-licensing-authorities/rts-14-responsible-product-design). |
| **PEGI (UE)** | A partir de junho/2026, jogos com itens aleatórios pagos (loot boxes) recebem classificação **PEGI 16** automaticamente. EA FC 26 saltou de PEGI 3 para 16 nesse critério. | Se houver qualquer mecânica de "abrir pacote por fichas virtuais compradas com dinheiro", o jogo é **PEGI 16**. Sem exceção para jogabilidade sandbox/grátis. Fonte: [GamesIndustry.biz](https://www.gamesindustry.biz/games-with-loot-boxes-will-be-rated-pegi-16-from-june-as-part-of-sweeping-changes-to-the-age-rating-system). |
| **China continental** | Exigência legal de **probabilidade visível em todo drop pago** + compras limitadas por mensalidade. Lei desde 2017; taxa de compliance 95,6%. | Se algum dia houver IAP com saque dentro do jogo, é obrigatório mostrar probabilidades. Fonte: [Xiao et al., 2023, PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286681). |
| **Brasil** | Não há regulação específica de loot box. Classificação Indicativa (DECJ/CGI.br) usa o framework da Convenção sobre os Direitos da Criança. Publicidade de jogos de azar é restrita pela Lei 13.756/2018. | Zona cinza. Defensável juridicamente, mas exposta a classificação etária restritiva e à pressão crescente da PL das "fake bets" e similares. |

### 1.2. Teste recomendado de "conformidade-por-designo"

```
Para cada mecânica aleatória, anotar:
1. A moeda é comprada com dinheiro real?  → Se sim, é loot box. Aplica-se PTO acima.
2. A moeda pode ser convertida em dinheiro ou item transacionável?  → Se sim = jogo de azar pleno.
3. A moeda é obtida predominantemente por gameplay?  → Holland test (a)+(c)+(d).
4. A chance é apenas um componente do jogo maior de habilidade?  → (b) do teste holandês.
5. Existe barreira de idade com KYC?  → Obrigatório para PEGI 16, recomendado sempre.
```

**Recomendação central do projeto:** tornar a moeda virtual **ganha por jogar**, **não-comprável isoladamente** (ou comprável apenas em *bundles* que não dão poder proporcional ao valor pago), **sem mercado de troca**, **com distribuição etária PEGI 16** quando houver qualquer compra de pacote.

---

## 2. As armadilhas psicológicas: o que a ciência diz que *não* se deve fazer

### 2.1. Reforço de razão variável (Skinner, 1953; Berry & Gentile)
- A pele de casino é movida por **recompensa entregue após número imprevisível de respostas**. Produz **resistência à extinção**: jogadores continuam jogando mesmo após longos períodos sem ganho. Variabilidade no intervalo do ganho > magnitude do ganho em poder de "fixar" comportamento.
- Fonte: [Texas Higher Ed OER – Operant Conditioning](https://oertx.highered.texas.gov/courseware/lesson/2113/student/?section=5), [PMC 11607842 – slot machine RR schedule](https://pmc.ncbi.nlm.nih.gov/articles/PMC11607842/).
- **Implicação prática.** Sistemas roguelite usam **VR schedule já por natureza** (cada "run" pode ou não dar vitória). A diferença crítica entre "ético" e "viciante" é se o jogador pode **compreender a distribuição** e **intervir nela com habilidade**. Se a VR está acoplada à pura sorte sem janela de decisão, é equivalente comportamental a um slot machine.

### 2.2. Near-miss effect (Clark et al., 2009; Reid 1986)
- Neuroimagem funcional mostra que **"quase-acertos"** ativam o estriado ventral e a ínsula anterior — áreas idênticas às ativadas por ganhos reais. Não é interpretado pelo cérebro como "perda", mas como **"ganho potencial adiado"** → aumenta a vontade de continuar. Estudo replicado em jogadores patológicos com ativação amigdalar mais intensa (PMC 2861872).
- Fonte: [Clark 2009, Neuron](https://www.sciencedirect.com/science/article/pii/S0896627309000373), [PMC 2929454](https://pmc.ncbi.nlm.nih.gov/articles/PMC2929454/).
- **Anti-padrão clássico.** Caça-níquel de frutas com "dois símbolos iguais + um quase" como animação lenta, sons crescentes de quase-jackpot. **Proibido explicitamente pelo UKGC RTS 14F** ("não celebrar retorno ≤ total apostado"), mas a regra britânica só vale para licenciados.
- **O que fazer no roguelite.** Em vez de "quase passou do alvo", prefira **falhas com leitura clara** ("*Faltou 18 pontos para o blind. Reorganize o descarte.*"). Mostre, não esconda, o que faltou. Não use sons de "quase-win" crescentes — substitua por *feedback de qualidade da mão*.

### 2.3. Dark patterns específicas de jogos de azar (Newall, 2025; Gray et al., 2024)
O estudo de scoping mais recente ([Newall 2025 + Tárrega et al., 2025](https://www.akjournals.com/view/journals/2006/15/1/article-p99.xml)) classifica dark patterns em cassinos online em três famílias:
- **Sludge**: atrito proposital no fluxo de "limites", "auto-exclusão", "saque", "depósito reverso". Joga contra o jogador na hora de se proteger.
- **Dark patterns**: nudges escondidos, defaults pró-casa, botões de "rejeitar proteção" com cor deprimida.
- **Dark nudges**: micro-persuasão contínua (pop-up "está jogando há 30 minutos", "você estava ganhando!", empurrar recompensas quando o saldo está baixo).

Caso julgado importante para o design: a *Dutch Court* entendeu que loot boxes violaram a lei por **"interface que não permite distinguir entre compra de pacote e outra ação"** — design ambíguo é, por si, problema regulatório ([Dentons 2023](https://www.dentons.com/en/insights/guides-reports-and-whitepapers/2023/june/28/loot-box-regulation-in-the-eu-loading-status)).

### 2.4. O sinal de "false win" / "celebração de perda"
Estudo do UKGC citado na mudança de 2024: features que **"aceleram o jogo ou criam ilusão de controle"** foram proibidas especificamente em resposta a dano mensurável ([UKGC news 2024](https://www.gamblingcommission.gov.uk/news/article/gambling-commission-announces-package-of-changes-which-make-online-games)). Exemplos proibidos:
- Botão de "turbo" / "quick spin" que pula animação.
- "Slam stop" dos rolos.
- Ganho sonoro ≥100× valor apostado, mas na verdade é 0,5×.
- Mensagens "você *quase* ganhou" após derrota.
- Dois ou mais jogos simultâneos na mesma sessão.

### 2.5. Migração social-casino → dinheiro real
Meta-análise e estudo longitudinal de Kim et al. (2015) com 1.495 jogadores: **comprar créditos virtuais em social casino é o preditor mais forte de migração para jogo de dinheiro real** em 6 meses (odds ratio 2-3× maior). Time spent sozinho não migra — *microtransação* é o vetor.
Fonte: [PMC 4651986](https://pmc.ncbi.nlm.nih.gov/articles/PMC4651986/), [Gainsbury 2017](https://www.greo.ca/Modules/EvidenceCentre/files/Gainsbury%20et%20al%20(2017)_Virtual%20addictions%20An%20examination%20of%20problematic%20social%20casino%20game%20use%20among%20at%20risk%20gamblers.pdf).

**Implicação direta para o produto.** Se a webapp vender chips por dinheiro, o produto vira uma **escada para jogo de azar real**. Por mais que tecnicamente a moeda virtual não seja conversível, estudos mostram que o simples ato de micro-comprar já condiciona o usuário. Recomendação: tornar a moeda **comprável apenas em *premium cosmetic bundle*** que não afeta odds, e.g. pacote "apoie o desenvolvedor" R$9,90 que concede um avatar. Nunca comprar fichas que mudam probabilidade.

---

## 3. O que faz o Balatro ser estrategicamente interessante (mesmo sendo joguinho de carta)

Análise cruzada de:
- [Poker Hands – Balatro Wiki](https://balatrowiki.org/w/Poker_hands)
- [Guide: General Strategy](https://balatrogame.fandom.com/wiki/Guide:_General_strategy)
- [Critical play essay, Mechanics of Magic, 2026](https://mechanicsofmagic.com/2026/05/22/critical-play-on-games-of-chance-and-addiction-balatro/)
- [Game Design thread, Quarter to Three](https://forum.quartertothree.com/t/balatro-a-cheating-frenzy-roguelike-poker-deckbuilder-deserves-a-thread/161018)

### 3.1. As 6 alavancas de design que tornam o jogo roguelite **estratégico**, não caótico

1. **Hierarquia transparente de mãos e tabela de pontos.**
   | Mão | Chips base | Mult base |
   |---|---|---|
   | High Card | 5 | 1 |
   | Pair | 10 | 2 |
   | Two Pair | 20 | 2 |
   | Three of a Kind | 30 | 3 |
   | Straight | 30 | 4 |
   | Flush | 35 | 4 |
   | Full House | 40 | 4 |
   | Four of a Kind | 60 | 7 |
   | Straight Flush | 100 | 8 |
   | (ocultas) Five of a Kind, Flush House, Flush Five | até 160 | até 16 |

   O jogador **conhece a estrutura**. Isso transforma a probabilidade de sortear uma mão boa de "loteria" em "decision under known distribution".

2. **Curva de score previsível (antes)** que escala duro, mas com **espaço de growth exponencial dentro da run**.
   - Cada *Ante* tem 3 blinds (small, big, boss). O boss aplica um modificador conhecido (naipe desativado, mão debuffada, etc.). Boss blinds explicitamente *informam* o efeito na tela.
   - Isso é o oposto do slot machine: **incerteza sobre o efeito** vs **efeito conhecido, exigência crescente**. A escala de Ante → Ante é análoga a uma progressão de dificuldade roguelike clássica.

3. **Sistema de Joker como mecânica de build** (a "roguelite deckbuilder").
   - 150 Jokers, agrupados em tags (economia, multiplicador, retenção, edição). Cada um muda **probabilidades e/ou payouts** mas dentro de uma estrutura conhecida.
   - Builds arquetípicas têm nome ("Baron steel kings", "Flush Five", "Blueprint/Brainstorm xerox"). **Arquétipos emergem da synergy explícita**, não do RNG puro. Isso é o coração do "outsmarting the game" — princípio chave de qualquer roguelite decente.

4. **Compras na loja + vouchers + tags como draft pool determinístico.**
   - Loja apresenta 2-4 opções de Joker/Tarot/Planeta/Voucher. O jogador escolhe. Novas *tags* (Boss, Standard, Charm, Celestial) determinam o kind da oferta. Há também um sistema de **descontos previsíveis** baseado em saldo.
   - Decisão sob incerteza **reduzida** (3-4 opções conhecidas) + **alto payoff** (Synergy).

5. **Curva de aprendizado em duas dimensões**.
   - *Curva curta.* Aprender que "Pair é fraco sem joker" leva 3 runs.
   - *Curva longa.* Dominar a *anti-synergy* (evitar Jokers redundantes, gerenciar slots de consumíveis) leva 30+ runs.
   - Esse *high-floor, high-ceiling* (Tom Francis, 2016 — sobre Intrinsic Complexity) é o que diferencia "bom roguelite" de "skin de slot".

6. **Falha clara e rápida.**
   - Run típica dura 25–45 min. Falha = tela de resumo com chips, Jokers coletados, melhor Ante. O **error é legível**: "comprou Joker X mas seu deck era full-house, portanto o buff de Straight não pontuou". Feedback curto + identificável.
   - Em cassino real, a falha é tipicamente silenciosa ("aposta perdida") ou pior, **atribuída a maus lençóis** — promovendo crença em controle.

### 3.2. O que o Balatro **não** faz (e você também não deve)

| Característica de casino | Por que Balatro não tem | Por que você também não deveria |
|---|---|---|
| Quase-acertos celebrados | Mostra quanto *faltou* vs. celebra a proximidade | Use *informational* feedback, não emocional |
| Compra de "fichas" sem parar | Lojas têm cooldown e *interest cap* | Limite daily shop refresh e imposto de saldo |
| Stake escalation | Jokers custam dinheiro do run, *não escalam aposta* | Não ofereça "aposta maior = mais Joker" — é textbook loss-chasing |
| Histórico apagado | Tela de fim mostra Ante, mão vencedora, chips por blind | Mantenha histórico visível, mesmo dentro do run |
| Tempo "infinito" | Ante 8 = cap natural (run termina) | Limite natural de duração é **proteção cognitiva** |

---

## 4. Diretrizes operacionais: guardrails concretos para implementar

Adaptei e combinei as seguintes fontes para a lista:
- [UKGC RTS 14](https://www.gamblingcommission.gov.uk/manual/guidance-to-licensing-authorities/rts-14-responsible-product-design)
- [BGC Code of Conduct – Game Design](https://bettingandgamingcouncil.com/uploads/Downloads/BGC-CODE-OF-CONDUCT-GAME-DESIGN.pdf)
- [Xiao et al. 2023, PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286681) (probabilidade disclosure)
- [Gray et al. 2024 / Newall 2025](https://www.akjournals.com/view/journals/2006/15/1/article-p99.xml) (taxonomia de dark patterns)
- [Kim et al. 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4651986/) (migração)

### 4.1. Regras de ouro (não-negociáveis)

| # | Regra | Origem |
|---|---|---|
| 1 | **Nenhum "fundo" comprável que afete probabilidade.** Toda compra via dinheiro real dá apenas cosmético não-conversível. | Kim 2015 + Netherlands test |
| 2 | **Toda mecânica aleatória com prêmio de progressão tem probabilidade visível ANTES da abertura.** | UKGC + China |
| 3 | **Nenhum "slam stop", "turbo", "quick spin" ou aceleração de animação.** Loop mínimo de "iniciar → resultado" ≥ 2,5 s. | UKGC RTS 14D |
| 4 | **Nada celebra retorno ≤ custo da jogada** (sem jingle, sem flash de confetti, sem mensagem "boa jogada"). | UKGC RTS 14F |
| 5 | **Sem multi-tabling, sem várias rodadas simultâneas.** | UKGC RTS 14C |
| 6 | **Nenhum "quase-acertou" com animação dramática.** Mostrar faltou-X-em-Y ou usar o Ante anterior como comparativo *neutro*. | Clark 2009 + Newall 2025 |
| 7 | **Limitação de tempo de sessão visível e opt-out fácil.** Default = 60 min, expira com *soft break* não dismissível por 5 min. | UKGC + BGC |
| 8 | **Limitação de gastos (moeda comprada)** configurável pelo usuário, com *default seguro* e aumento exigindo cooldown de 24 h. | Newall 2025 + Drummond 2019 |
| 9 | **Auto-exclusão em 1 clique**, persistente por ≥6 meses, com confirmação honesta ("você não jogará durante este período"). | BGC Código |
| 10 | **Histórico completo da sessão e por run acessível para o jogador.** | UKGC player protection |
| 11 | **Sem "loss-chasing prompt"**: nunca mostrar "você está abaixo do pico — continue jogando para recuperar"; nunca oferecer "aposta dobrada" pós-derrota. | UKGC RTS 14A |
| 12 | **Sem uso de sons ascendentes em quase-acertos.** | UKGC RTS 14F |

### 4.2. Regras de design de interface (desconfie sempre do modo como você apresenta o jogo)

Boa parte das dark patterns é "design empurrado". Padrões a banir:

- **Sludge na auto-exclusão.** Botão de "pausar" proeminente e em texto neutro; botão "ativar" atrás de confirmação tripla.
- **Defaults pró-casa.** Limite de tempo default = "ligado". Auto-exclusão default off. *Ambos esses padrões morais* diferem do que cassinos fazem.
- **Confirmação falsa.** Modal que pede "tem certeza que quer parar de jogar?" com CTA maior em "continuar". *Inverta*: CTA maior em "sair", texto menor "ainda quero continuar".
- **Currency confusion.** Mostrar preço em "fichas" sem decompor para "isso é ~R$X em moeda real". Forçar o display do valor nominal em moeda real sempre que houver compra.
- **Disguised ad / patrocinado.** Bots, avatares, "personagens" em Sidebar para criar "social presence" falsa → proibido.
- **Hellbroadcast / Loop constante.** Notificações "volte a jogar!" fora do jogo → reduzir a frequência para zero em auto-exclusão.

### 4.3. Mecânicas roguelite que *aumentam* jogo responsável em vez de minar

Aqui é onde o design transforma o jogo de azar *em jogo de habilidade*, com VR + agência.

#### A. **Ante + blind system (modelo Balatro)**
- Cada run = sequência de N níveis com dificuldade crescente *conhecida*.
- Boss blinds com efeito **declarado** (não surpresa).
- Probabilidade de sortear uma boa mão **não é constante** — muda pela composição do baralho. *O jogador percebe isso com prática.*
- **Adaptação:** mesmo para jogo de blackjack/roleta/etc., manter "run" como unidade, e cada "mão" ser influenciada por itens comprados com moeda ganha.

#### B. **Deckbuild / buildcraft como vetor de agência**
- Ofereça 3-5 "Stickers" / "Mutadores" antes de cada Ante que mudam odds de curto prazo (e.g., "Pares rendem +50% por 3 mãos", "só naipe copas vale por 1 nível").
- O jogador **escolhe** como mutar a distribuição. O jogo não oferece apenas o *espaço do acaso* — ele oferece *espaço de decisão*.

#### C. **Pity timer explícito (probabilidade crescente após N tentativas)**
- "Pity timer" é ética: torna a distribuição conhecida e o pior caso limitado. Modelo usado em Genshin, Hearthstone, Slay the Spire (boss relics têm efeito garantido após 4 runs).
- Em um jogo de cassino isso seria: após N mãos ruins, uma "mão de compensação" com odds favoráveis conhecidos — *mas com aviso visível*.
- Recomendação ética:  pity timer **+** transparência. Sem surpresa.

#### D. **Run state compression e "summary screen"**
- Toda run = identificador único + breakdown público ao final.
- Estatísticas compartilhadas (com opt-in) para que o jogador veja "tempo médio", "fichas consumidas", "variação relativa a outros jogadores".

#### E. **Variância limitada**
- Em jogos puros de cassino, uma "variância infinita" e "skewed distribution" causam a maior parte do dano (cada spin tem chance de jackpot → condiciona).
- Em roguelite ético, distribua recompensas de modo que a variância agregada **diminua com escolha**: ex. "se você seguiu a estratégia X, espere Y ± Z".

#### F. **Modo "skill-only" como opt-in**
- Ofereça modo sem elemento de sorte, ou com sorte apenas na *entrada* do run (não na resolução de cada mão). Balatro já tem *Challenge runs* como modo de dificuldade alta + restrição de Joker. Inspiração clara.

### 4.4. Policiais comportamentais a implementar

Em analogia ao RTS 14:
- **Tabela de realidade** (Reality check): a cada 30 min mostrar modal com "tempo jogado", "moeda ganha", "moeda gasta (se houver)". Não-dismissível por 10 s.
- **Limite de *sessions por dia***, configurável, com reset à meia-noite local.
- **Botão "saída fácil"** sempre presente durante a run, **sem penalidade** (sem perda de Joker, sem charge).
- **Auto-exclusão quente.** Selo "Estou vulnerável hoje" com 24h de cooldown. Atalho no menu principal.
- **Registro de comportamento.** Marcar runs de duração > 2 h ou > 5 runs em sequência; oferecer (não forçar) reflexão.

### 4.5. **O que *não* construir sob nenhuma hipótese**

| Padrão proibido | Por quê |
|---|---|
| "Skins compráveis que aumentam poder de jogo" (Pay-to-Win) | Dark pattern monetário + tuning de skill → confusão jogador novato |
| Pacote de "booster" com chances aumentadas de drop raro | Reforço variável com viés de plata |
| Timer de "daily login bonus" que cria FOMO | Hellbroadcast = dark pattern |
| "Aposta dobrada depois de derrota" | Loss-chasing literal — UKGC RTS 14A |
| Ranking competitivo com apostas em dinheiro | Migração social-casino → dinheiro real |
| Pop-up "última chance!" em saldo baixo | Sludge reverso: empurra para continuar jogando |

---

## 5. Síntese final: princípios para a webapp

1. **Moeda virtual ganha predominantemente por jogar**. Comprável só em *aesthetic bundle* que não muda odds. Sem mercado secundário.
2. **Curva de Ante + Boss blinds** (modelo Balatro). Dificuldade crescente com efeito *declarado*, não surpresa.
3. **Tabuleiro de pontos transparente**, com hierarquia clara e modificadores identificáveis.
4. **Run como unidade de tempo** (~30-45 min). Término natural = fim do Ante ou bankroll zero. Sem "modo infinito".
5. **Buildcraft / Draft Shop** com 2-5 opções conhecidas a cada parada. O jogador *escolhe*, não *recebe*.
6. **Pity timer explícito**: chance de drop raro aumenta deterministicamente após N tentativas, com aviso em UI.
7. **Probabilidade visível** em todo drop. Display padrão no fluxo de confirmação.
8. **Sem quase-acertos celebrados**. Falha tem leitura clara ("faltou 14 pontos no straight").
9. **Sem aceleração de tempo**: mínimo 2,5 s entre ciclo de decisão e início do próximo.
10. **Sem multi-tabling**. Uma run por vez.
11. **Reality check de 30 min** + limite de tempo opt-out com *default ligado*.
12. **Auto-exclusão em 1 clique**, persistente, confirmada sem ambiguidade.
13. **Botão "sair" sem punição** sempre disponível na HUD.
14. **Resumo de run detalhado** com identificador único. Histórico acessível.
15. **Disable cross-promotion** para IAPs que mudem odds/progressão.
16. **Quando vender cosméticos:** preço sempre em moeda real (BRL/USD/EUR) com *helper-text* "X fichas ≈ R$Y". Nunca "compre 100 fichas" sem ancoragem.
17. **KYC leve** (e-mail + DOB) com classificação PEGI 16 desde o primeiro acesso.
18. **Auditoria interna anual** por terceiro independente, publicada em página de transparência.
19. **Canal de ajuda visível** com links para Jogadores Anônimos, Gambling Therapy, CVV. Sem revelar para quê em analytics.
20. **Mecânica anti-bot**: proibir múltiplas contas; detectar sinais de alerta (e.g., volume de IAP, padrões noturnos repetidos) e oferecer — sem bloquear — pausas sugeridas.

---

## 6. Fontes consultadas

### Regulação
1. UK Gambling Commission — *RTS 14 Responsible product design* — https://www.gamblingcommission.gov.uk/manual/guidance-to-licensing-authorities/rts-14-responsible-product-design
2. UK Gambling Commission — *LCCP Condition 3.2.7 – Betting SR code* — https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/3-2-7-betting-sr-code
3. UK Gambling Commission — *Press release: package of changes making online games safer by design* — https://www.gamblingcommission.gov.uk/news/article/gambling-commission-announces-package-of-changes-which-make-online-games
4. Betting and Gaming Council — *Code of Conduct: Game Design* — https://bettingandgamingcouncil.com/uploads/Downloads/BGC-CODE-OF-CONDUCT-GAME-DESIGN.pdf
5. GamesIndustry.biz — *Loot Box State of Play 2024* — https://www.gamesindustry.biz/loot-box-state-of-play-2024-another-trip-around-the-world-of-regulation
6. GamesIndustry.biz — *PEGI 16 for loot boxes, 2026* — https://www.gamesindustry.biz/games-with-loot-boxes-will-be-rated-pegi-16-from-june-as-part-of-sweeping-changes-to-the-age-rating-system
7. Video Games Federation Belgium — *Loot boxes in Belgium* — https://vgfb.be/loot-boxes-in-belgium/
8. Promise Legal — *Loot Box Laws by Jurisdiction: What Game Studios Must Know in 2025* — https://blog.promise.legal/loot-box-laws-game-developers/
9. Dentons — *Loot box regulation in the EU – loading status (2023)* — https://www.dentons.com/en/insights/guides-reports-and-whitepapers/2023/june/28/loot-box-regulation-in-the-eu-loading-status
10. University of Colorado Law Review — *Techlash, Loot Boxes, and Regulating "Dark Patterns"* — https://lawreview.colorado.edu/print/when-the-cats-away-techlash-loot-boxes-and-regulating-dark-patterns-in-the-video-game-industrys-monetization-strategies/

### Pesquisa acadêmica (psicologia e dark patterns)
11. Clark L et al. (2009) — *Gambling Near-Misses Enhance Motivation to Gamble and Recruit Win-Related Brain Circuitry* — https://www.sciencedirect.com/science/article/pii/S0896627309000373
12. PMC 2929454 — *Gambling Severity Predicts Midbrain Response to Near-Miss Outcomes* — https://pmc.ncbi.nlm.nih.gov/articles/PMC2929454/
13. PMC 2861872 — *Neurobehavioral Evidence for the "Near-Miss" Effect in Pathological Gamblers* — https://pmc.ncbi.nlm.nih.gov/articles/PMC2861872/
14. PMC 11607842 — *Post-reinforcement pauses during slot machine gambling* — https://pmc.ncbi.nlm.nih.gov/articles/PMC11607842/
15. Texas Higher Ed OER — *Operant Conditioning / Reinforcement Schedules* — https://oertx.highered.texas.gov/courseware/lesson/2113/student/?section=5
16. Smith G, Clarke D — *The psychology of the near miss* (Reid, 1986) — https://www.stat.berkeley.edu/~aldous/157/Papers/near_miss.pdf
17. AKJournals — *Dark patterns in online gambling: A scoping review (Tárrega et al., 2025)* — https://www.akjournals.com/view/journals/2006/15/1/article-p99.xml
18. Xiao LY, Henderson LL, Newall PWS (2023) — *What are the odds? Poor compliance with UK loot box probability disclosure* — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286681
19. ArXiv 2412.05039 — *Level Up or Game Over: Exploring How Dark Patterns Shape Mobile Games* — https://arxiv.org/html/2412.05039v1
20. Newall PWS (2025) — *Sludge, dark patterns and dark nudges: A taxonomy of online gambling platforms' deceptive design features*, Addiction — via DOI 10.1111/add.70085

### Design de Balatro e roguelite
21. Mechanics of Magic — *Critical Play on Games of Chance and Addiction: Balatro* (2026) — https://mechanicsofmagic.com/2026/05/22/critical-play-on-games-of-chance-and-addiction-balatro/
22. Balatro Wiki — *Poker hands* — https://balatrowiki.org/w/Poker_hands
23. Balatro Wiki — *Blinds and Antes* — https://balatrowiki.org/w/Blinds_and_Antes
24. Balatro Fandom — *Guide: General strategy* — https://balatrogame.fandom.com/wiki/Guide:_General_strategy
25. Thom — *What makes or breaks agency in roguelikes* — https://thom.ee/blog/what-makes-or-breaks-agency-in-roguelikes/
26. Game Maker's Toolkit — *Roguelikes, Persistency, and Progression* — https://www.youtube.com/watch?v=G9FB5R4wVno

### Social casino / migração para dinheiro real
27. Kim HS et al. (2015) — *Do Social Casino Gamers Migrate to Online Gambling?* — https://pmc.ncbi.nlm.nih.gov/articles/PMC4651986/
28. Gainsbury SM et al. (2017) — *Virtual addictions: problematic social casino game use among at-risk gamblers* — https://www.greo.ca/Modules/EvidenceCentre/files/Gainsbury%20et%20al%20(2017)_Virtual%20addictions%20An%20examination%20of%20problematic%20social%20casino%20game%20use%20among%20at%20risk%20gamblers.pdf
29. McNamara P et al. (2022) — *Why Social Casino Gamers Play and Gamble* — https://basisonline.org/2022/08/09/learning-why-social-casino-gamers-play-and-gamble/

### Recursos práticos
30. deceptive.design — *Reading List* — https://deceptive.design/reading-list/browse/?sort=date:desc
31. Tiggames — *Responsible Gambling in Casino Game Development* — https://www.tiggames.com/responsible-gambling/

---

*Documento gerado para servir como referência do projeto. Salvo em `/home/hermes/pesquisa-roguelite-casino/sintese.md`. Última atualização: 2026-08-04.*
