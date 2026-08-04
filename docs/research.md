# Pesquisa de game design — Cassino Arcano

> Pesquisa feita antes da implementação. Objetivo: transformar blackjack e roleta em jogos de estratégia run-based com feedback tátil, usando princípios transferíveis de *Balatro* sem copiar arte, nomes, interface, cartas, texto, áudio ou identidade visual.

## 1. Tese

O apelo central de *Balatro* não é “pôquer com efeitos”. É a conversão de um sistema familiar e probabilístico em:

1. **meta de curto prazo legível** — superar um limiar crescente;
2. **decisões entre rodadas** — gastar agora ou preservar economia;
3. **efeitos passivos combináveis** — itens mudam o valor relativo de ações conhecidas;
4. **mitigação de risco** — boa estratégia reduz dependência de sorte, sem removê-la;
5. **explicação sequencial do resultado** — o jogo mostra por que o número cresceu;
6. **feedback audiovisual proporcional** — eventos raros recebem mais peso que ações comuns.

O overhaul deve manter regras reconhecíveis de blackjack e roleta, mas colocar ambas dentro de uma corrida curta. O jogador busca superar metas, escolhe relíquias e constrói uma estratégia. Créditos continuam exclusivamente virtuais, sem compra, saque, anúncios ou monetização.

## 2. O que a pesquisa de Balatro indica

### Familiaridade como onboarding

LocalThunk descreve cartas tradicionais como meio simples, familiar e tátil para sistemas estratégicos densos. Também diz que o “tema de pôquer” funciona principalmente como ferramenta de onboarding; a estrutura real é um score attack single-player.

**Aplicação:** preservar vocabulário central — pedir/parar, vermelho/preto, dúzias — e adicionar profundidade ao redor, não substituir as regras por jargão de RPG.

### Estrutura run-based e limiar crescente

A definição do próprio criador: jogo run-based, pontuação necessária sempre crescente, mecânicas interligadas e sinergias que direcionam builds.

**Aplicação:** cada jogo terá uma expedição de 5 atos. Cada ato exige um lucro acumulado. Vitória avança; falha consome uma vida. Três vidas deixam espaço para adaptação sem tornar cada resultado isolado fatal.

### Passivas como motor de variedade

Os Jokers nasceram como itens passivos porque apenas melhorar cartas não criava variedade suficiente. Balanceamento busca efeitos interessantes sem uma opção canibalizar estratégias vizinhas. LocalThunk destaca que números simples — custo, raridade, bônus — tornam iteração barata.

**Aplicação:** criar **Talismãs** originais, pequenos e ortogonais. Limite de 3. Cada um favorece uma linha de decisão e exibe fórmula explícita. Nada de reproduzir Jokers existentes.

### Estratégia é mitigação de risco

Segundo LocalThunk, existe muita aleatoriedade, mas a metastratégia está em construir algo robusto, mitigar risco e ainda escalar o suficiente. A discussão dos jogadores migrou de “é sorte” para “como reduzir risco”.

**Aplicação:**

- blackjack: aposta escolhida antes da mão, seguro não será adicionado (baixa qualidade decisória); talismãs recompensam margem segura, cinco cartas e disciplina de aposta;
- roleta: chances e pagamento sempre visíveis; talismãs premiam diversificação, cobertura ou especialização sem fingir que alteram onde a bola cai;
- nenhuma “quase vitória” fabricada;
- histórico curto permite decidir com contexto, mas declara que rodadas são independentes.

### Economia cria decisões intertemporais

A economia de loja/juros cria tensão entre poder imediato e capital futuro. O ponto importante não é copiar juros específicos, e sim fazer o recurso ter dois usos concorrentes.

**Aplicação:** Fichas servem para apostar e comprar Talismãs. Comprar poder reduz colchão de risco. Recompensas de ato são escolha entre 3, com preço explícito; pular preserva caixa.

### Iteração e demos

LocalThunk chama demos e feedback comunitário de instrumentais; sistemas foram modificados continuamente. Seu relato de desenvolvimento mostra protótipos descartados, uma mecânica central precoce, expansão só depois de sinais de diversão e testes privados focados antes do lançamento.

**Aplicação:** manter stack web nativa, dados de balanceamento em arrays simples e uma verificação executável. Não adotar framework: três páginas estáticas não justificam build system nem dependência.

## 3. Game feel / “juice”

### Modelo útil

Game Feel pode ser separado em:

- **responsividade:** resposta visível começa imediatamente, idealmente dentro de 100 ms;
- **intuitividade:** mesma ação segue regras consistentes e previsíveis;
- **visceralidade:** movimento, som e timing dão sensação física ao resultado.

Juice não substitui regras. Ele reforça informação e emoção já presentes. A regra de escala é: ação frequente recebe feedback curto; evento raro recebe coreografia maior.

### Pilha de feedback proposta

| Evento | Visual | Movimento | Áudio | Duração |
|---|---|---|---|---|
| clique/aposta | seleção e saldo atualizam | depressão 2 px | tick curto | 60–100 ms |
| carta/ficha | elemento nasce na origem | ease-out e stagger | toque seco | 160–240 ms |
| efeito de Talismã | item acende, texto `+N` | pulso único | nota ascendente | 180 ms cada |
| resultado comum | fórmula é revelada | contador interpola | acorde curto | 300–600 ms |
| grande ganho/blackjack | cor quente + partículas | shake 2–4 px | acorde em camadas | 600–900 ms |
| derrota | dessaturação breve | recuo leve | tom descendente | 250–400 ms |

### Restrições

- Nunca atrasar atualização essencial só para tocar animação.
- Sequenciar Talismãs para ensinar causalidade: base → efeito → total.
- Shake apenas em ganho raro, proporcional e curto.
- `prefers-reduced-motion` remove shake, partículas e transições longas.
- Controle persistente de som; áudio só inicia após gesto do usuário.
- Web Audio API, sem arquivo ou dependência: osciladores curtos, volume baixo.
- Estado comunicado também por texto, não apenas cor/animação/som.

## 4. Gambling: estratégia e limites éticos

Roleta pura tem decisão de volatilidade, não vantagem matemática: na europeia, apostas padrão mantêm vantagem da casa de aproximadamente 2,7%. O overhaul não deve mascarar isso.

### Guardrails obrigatórios

- somente créditos virtuais gratuitos;
- sem cadastro, pagamento, saque, anúncios, temporizadores diários ou compra de moeda;
- probabilidades e pagamentos visíveis;
- nenhum autoplay;
- nenhum botão “recuperar perda”, mensagem de urgência ou incentivo a dobrar após perder;
- resultados independentes explicados no histórico;
- sem “near miss” fabricado, roda controlada para quase acertar ou áudio de vitória em retorno menor/igual à aposta;
- ganho líquido, valor apostado e retorno apresentados separadamente;
- opção “Nova expedição” clara, sem esconder perda;
- persistência local apenas para preferência de som e recorde, não para criar compromisso/sunk cost.

A UK Gambling Commission cita como designs de risco: aceleração de jogo, autoplay, ilusão de controle e sons/imagens de vitória quando retorno é igual ou menor à aposta. Estudos de near-miss associam “quase acertos” a distorções cognitivas e ilusão de controle. Dark patterns também podem existir no sistema, não apenas na posição dos botões.

### Como tornar roleta estratégica sem enganar

- **meta externa ao giro:** atingir lucro em número limitado de rodadas;
- **build explícita:** Talismãs modificam retorno/recompensa, nunca o número sorteado ocultamente;
- **apostas combinadas:** jogador escolhe exposição e volatilidade;
- **contratos de ato:** regra pública temporária, ex. bônus por cobrir três categorias, criando quebra-cabeça;
- **histórico:** serve para auditoria e clareza, acompanhado por “giros são independentes”.

## 5. Features escolhidas

### Sistema comum

- Expedição de 5 atos, 3 vidas, meta crescente.
- Saldo virtual e recorde local.
- Até 3 Talismãs.
- Escolha de 1 entre 3 recompensas após vencer ato; pode pular.
- Breakdown de resultado mostrando base e modificadores em ordem.
- Áudio procedural opcional, partículas e shake acessível.

### Blackjack — decisões

- Aposta antes da mão: 10, 25, 50 ou 100.
- Vitória 1:1; blackjack natural 3:2; empate devolve aposta.
- Meta de lucro por ato e limite de mãos.
- Talismãs originais:
  - **Âncora:** vitória com 17–19 ganha bônus fixo (recompensa disciplina, não só 21).
  - **Cinco Pontas:** mão vencedora com 5+ cartas recebe multiplicador.
  - **Reserva:** primeira derrota do ato devolve pequena parte da aposta.
  - **Coroa:** blackjack natural recebe bônus adicional.
  - **Escada:** vitórias consecutivas aumentam bônus, resetam na derrota.

### Roleta — decisões

- Mesmo tapete europeu e pagamentos corretos.
- Limite de giros e meta de lucro por ato.
- Talismãs originais:
  - **Prisma:** ganhar com 3+ tipos de aposta diferentes dá bônus de diversificação.
  - **Precisão:** número cheio vencedor recebe bônus adicional.
  - **Contrapeso:** primeira rodada perdida do ato devolve valor fixo pequeno.
  - **Trinca:** dúzia vencedora ganha bônus.
  - **Maré:** duas vitórias consecutivas aumentam o retorno líquido.
- Histórico mostra resultado, aposta, retorno e lucro líquido; nunca classifica empate/retorno igual como vitória.

## 6. O que deliberadamente não será copiado

- nome *Balatro*, Jokers, Jimbo, blinds, tarot/planet/spectral cards;
- arte pixelada específica, paleta, shader CRT, layout ou tipografia proprietária;
- nomes, textos, efeitos ou números de cartas existentes;
- fórmula Chips × Mult como apresentação central;
- música, sons ou assets do jogo.

A direção original é **cassino art déco ocultista**: feltro petróleo, latão envelhecido, marfim, vermelho vinho; Talismãs como placas gravadas, sem rosto/personagem.

## 7. Fontes consultadas

### Primárias / entrevistas

1. LocalThunk, “The Balatro Timeline” — evolução, protótipos, CHIP × MULT precoce, criação dos Jokers, demos e iteração: https://localthunk.com/blog/balatro-timeline-3aarh
2. Rogueliker, entrevista com LocalThunk — run-based score threshold, familiaridade das cartas, passivas, balanceamento e mitigação de risco: https://rogueliker.com/balatro-interview/
3. TouchArcade, entrevista com LocalThunk — origem, linguagem não combativa, demos, acessibilidade entre plataformas e áudio: https://toucharcade.com/2024/03/18/balatro-interview-mobile-port-localthunk-dlc-plans-updates-new-jokers-demo-feedback/
4. LocalThunk sobre obsessão por tactilidade/juice (post): https://x.com/LocalThunk/status/1860092451660398933

### Game feel / UX

5. Game Maker’s Toolkit, “Secrets of Game Feel and Juice”: https://www.youtube.com/watch?v=216_5nu4aVQ
6. Jan Willem Nijman, “The Art of Screenshake”: https://www.youtube.com/watch?v=AJdEqssNZ-U
7. Martin Jonasson & Petri Purho, “Juice It or Lose It”: https://www.youtube.com/watch?v=Fy0aCDmgnxg
8. Alexander Brazie, “Game Feel” — responsividade, intuitividade e visceralidade: https://gamedesignskills.com/game-design/game-feel/
9. GameAnalytics, “Squeezing More Juice…” — easing, áudio, feedback proporcional à frequência: https://www.gameanalytics.com/blog/squeezing-more-juice-out-of-your-game-design
10. Nielsen Norman Group, limites de resposta e animações: https://www.nngroup.com/articles/response-times-3-important-limits/ e https://www.nngroup.com/articles/animation-duration/
11. MDN, Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

### Segurança / ética

12. UK Gambling Commission, safer-by-design — autoplay, velocidade, ilusão de controle e falsas celebrações: https://www.gamblingcommission.gov.uk/news/article/gambling-commission-announces-package-of-changes-which-make-online-games
13. Internet Policy Review, dark patterns em sistemas de jogos: https://policyreview.info/articles/news/unmasking-dark-patterns-video-games/1739
14. Quaglieri et al., near-miss e ilusão de controle: https://pmc.ncbi.nlm.nih.gov/articles/PMC10867214/
15. Li, Mills & Nower, loot boxes, problem gaming e gambling: https://doi.org/10.1016/j.addbeh.2019.106098

## 8. Hipóteses a validar em playtest

- 5 atos bastam para uma run curta sem repetição.
- 3 opções de Talismã criam direção sem análise excessiva.
- Breakdown sequencial é rápido o bastante para não interromper fluxo.
- Bônus não domina vantagem das decisões básicas.
- Roleta continua honesta: jogador entende que Talismãs mudam recompensa, não probabilidade.
- Efeitos continuam legíveis em 360 px e com reduced motion.
