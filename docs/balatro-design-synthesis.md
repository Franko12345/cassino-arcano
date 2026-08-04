## Síntese: o que realmente faz Balatro funcionar

A lição transferível **não é “adicionar Jokers” nem imitar sua estética**. Balatro transforma regras familiares em uma máquina de decisões emergentes:

1. **Base imediatamente legível**  
   Usa cartas e mãos conhecidas como “atalho de onboarding”. A familiaridade reduz o custo inicial e libera espaço mental para aprender os sistemas novos.

2. **Objetivo simples, profundidade sistêmica**  
   A ação central permanece trivial; a complexidade nasce da interação entre modificadores permanentes, consumíveis, economia e composição do baralho.

3. **Efeitos simples, combinações complexas**  
   LocalThunk limitava descrições aproximadamente a quatro linhas/20 palavras. Cada item deve ser entendido isoladamente em segundos; a profundidade surge ao combiná-los.

4. **Builds que mudam o valor das decisões básicas**  
   Uma boa build não oferece apenas “+10%”. Ela faz o jogador reconsiderar o que é uma mão boa, quais cartas deseja e qual risco aceita.

5. **Três horizontes de decisão**
   - agora: sobreviver à próxima rodada;
   - médio prazo: montar uma engine;
   - longo prazo: preservar economia e flexibilidade para desafios futuros.

6. **Economia como custo de oportunidade**  
   Comprar agora compete com guardar dinheiro, gerar juros, rerrolar depois ou manter margem de emergência. A loja é outra fase estratégica, não um intervalo.

7. **Dificuldade crescente + testes qualitativos**  
   Chefes não aumentam apenas números: atacam dependências da build e forçam redundância ou pivot. A metastratégia, segundo LocalThunk, é mitigar risco sem perder potência.

8. **Aleatoriedade manipulável**  
   Sorte gera variedade, mas o jogador pode alterar probabilidades, filtrar resultados, construir consistência e decidir quando apostar em alta variância.

9. **Pacing em ondas**  
   Jogar → resolver com espetáculo → receber recursos → comprar/transformar → enfrentar teste especial. Alternar tensão e planejamento evita monotonia.

10. **Feedback como explicação causal**  
    A pontuação resolve efeito por efeito, com animação e áudio crescentes. Isso ensina por que a engine funcionou e dá prazer ao “ver a máquina rodar”.

11. **Tutorial distribuído por descoberta**  
    Alguns itens funcionam como “momentos de epifania”: demonstram que regras aparentemente fixas podem ser alteradas. LocalThunk chama isso de tutorial prolongado de baixa densidade.

12. **Balancear contra dominância, não contra diversão**  
    Builds absurdamente fortes são desejáveis quando raras ou conquistadas. O problema é a estratégia tão fácil e universal que elimina a vontade de experimentar as demais.

---

# Blackjack: proposta original

## Estrutura: campanha curta de mesas

Criar runs de **6 mesas**, cada uma com 3 rodadas:

1. mesa de entrada;
2. mesa de pressão;
3. mesa-desafio com uma regra pública.

A meta não deve ser só “ganhar fichas”, mas alcançar uma **reputação-alvo** antes de perder a banca operacional. Isso separa:

- **fichas**: recurso de economia;
- **reputação**: progresso da run.

Assim, uma aposta maior pode acelerar a campanha, mas não vira a única decisão relevante.

## Sistema de builds: “Protocolos”

Em vez de Jokers, usar **Protocolos de Mesa**: regras passivas, visual e semanticamente próprias. Limite de 4 equipados.

Exemplos originais:

- **Margem Fria** — ao parar em 17 exato, ganhe 1 Foco.
- **Contagem Reversa** — após perder com 20, a próxima carta de valor 10 concede reputação extra.
- **Paridade** — pares de cartas com valores ambos pares reduzem o custo de um recurso tático.
- **Linha Curta** — mãos de exatamente duas cartas recebem bônus; comprar uma terceira encerra o efeito.
- **Plano B** — a primeira mudança de estratégia após três vitórias consecutivas recebe proteção parcial.
- **Reserva Técnica** — terminar a mesa sem usar consumíveis rende juros adicionais.

Cada protocolo deve ter **uma condição e uma consequência**, em texto curto. A complexidade aparece entre eles.

## Recurso de agência: Foco

Adicionar **Foco**, conquistado por padrões de jogo, não comprado com dinheiro real. Usos possíveis:

- inspecionar a composição restante do sapato por faixas, sem revelar a próxima carta;
- reservar uma oferta da loja;
- reduzir o custo do próximo reroll;
- transformar uma recompensa aleatória em escolha entre duas alternativas.

Isso não falsifica o blackjack: melhora a capacidade de planejamento entre rodadas.

## Customização cuidadosa do sapato

Entre mesas, oferecer alterações pequenas e transparentes:

- remover temporariamente uma carta baixa;
- duplicar uma carta específica apenas durante a próxima mesa;
- marcar uma carta para gerar reputação quando aparecer;
- converter uma carta em “carta de contrato”, que concede efeito econômico sem alterar seu valor.

A composição deve ficar sempre visível. O jogador precisa entender as probabilidades resultantes.

## Mesas-desafio

Regras conhecidas antes de entrar:

- **Mesa Espelho** — bônus repetidos perdem eficiência;
- **Mesa Apertada** — só duas ações táticas por rodada;
- **Mesa Volátil** — recompensas crescem, mas sequências de perdas custam reputação;
- **Mesa de Auditoria** — uma categoria de Protocolo fica suspensa;
- **Mesa Longa** — exige vencer com mais de uma abordagem, combatendo builds monoculturais.

O objetivo é testar a arquitetura da build, não simplesmente aumentar a vantagem da casa.

## Decisões economicamente relevantes

Após cada mesa, escolher entre:

- comprar Protocolo;
- comprar consumível;
- melhorar um Protocolo;
- remover uma modificação indesejada do sapato;
- rerrolar;
- guardar fichas para juros.

Recomendação: juros simples com teto baixo e claramente exibido. O jogador deve conseguir comparar “poder agora” contra “mais opções depois”.

## Feedback e UX

- mostrar composição do sapato e probabilidades relevantes;
- oferecer modo “assistência estratégica” separado, explicando expectativa matemática;
- ao resolver a mão, destacar sequencialmente quais Protocolos dispararam;
- acelerar automaticamente animações repetidas;
- tooltip com condição, efeito e exemplo;
- tutorial inicial ensina apenas hit/stand/aposta; o primeiro Protocolo ensina que as regras podem ser dobradas.

### Loop proposto

**Escolher aposta → jogar blackjack → Protocolos resolvem → receber reputação/fichas → loja e edição do sapato → próxima mesa → desafio → pivotar ou consolidar build.**

---

# Roleta: proposta original

A roleta tradicional tem menos agência após a aposta. Portanto, o redesenho deve concentrar estratégia em **composição de portfólio, previsão de condições e transformação entre giros**, não em fingir controle sobre o resultado.

## Estrutura: circuitos de setores

Uma run pode ter **5 salões**, cada um com 4 giros. Para avançar, atingir uma meta de **prestígio**, não apenas lucro.

Cada salão revela antecipadamente:

- modificador ambiental;
- meta;
- faixa de volatilidade;
- recompensa por completar um padrão secundário.

## Unidade estratégica: “Teses”

Em vez de modificadores copiados de cartas, usar **Teses de Aposta** — regras que recompensam padrões do portfólio:

- **Cobertura Elegante** — bônus quando suas apostas cobrem exatamente 12 números sem sobreposição.
- **Contraponto** — apostar simultaneamente em duas propriedades opostas gera energia se uma delas vencer.
- **Concentração** — três giros seguidos usando no máximo dois tipos de aposta aumentam prestígio.
- **Migração** — mover a maior aposta de um setor para outro ativa multiplicador temporário.
- **Zona Morta** — números não cobertos acumulam valor de descoberta; cobri-los depois converte esse valor.
- **Ritmo 1–2–3** — variar deliberadamente a quantidade de fichas entre giros gera bônus, independentemente do resultado.

Essas Teses recompensam **formas de apostar**, não superstição sobre números “quentes”.

## Tabuleiro como deck editável

A roleta não deve ser manipulada secretamente. Em um modo roguelite fictício, alterações precisam ser explícitas e matematicamente recalculadas:

- ligar dois números como um setor;
- marcar casas que geram moeda secundária;
- deslocar um bônus entre cores;
- criar interseções temporárias;
- alterar o pagamento de uma família de apostas em troca de desvantagem clara.

Se a intenção for preservar roleta autêntica, mantenha a roda intacta e limite transformações ao **sistema de pontuação paralelo**, não aos odds ou pagamentos reais.

## Recurso secundário: Leitura

**Leitura** é obtida por cumprir padrões estratégicos e pode:

- revelar antecipadamente a regra do próximo salão;
- congelar uma oferta da loja;
- trocar uma Tese oferecida;
- proteger parte de uma sequência de prestígio;
- converter uma aposta perdedora em progresso de pesquisa, nunca em falsa vitória monetária.

## Fase entre giros

Dar ao jogador uma escolha curta:

- manter o portfólio;
- mover até duas fichas;
- desmontar uma aposta e receber energia;
- ativar um consumível;
- encerrar a sequência e bancar o prestígio.

Isso cria decisão sem transformar cada giro numa planilha demorada.

## Salões-desafio

- **Salão Assimétrico** — apenas apostas internas geram prestígio;
- **Salão de Cobertura** — sobreposições têm custo;
- **Salão Nômade** — repetir exatamente o portfólio reduz pontuação;
- **Salão Minimalista** — máximo de três posições ativas;
- **Salão do Zero** — o zero altera o sistema paralelo, com efeito anunciado;
- **Salão de Diversificação** — exige pontuar com três famílias de aposta.

Esses desafios atacam hábitos diferentes e fazem o jogador considerar flexibilidade.

## Feedback obrigatório

Após o giro, resolver em camadas:

1. resultado físico;
2. apostas pagas;
3. padrões de portfólio;
4. Teses ativadas;
5. prestígio e economia.

Exibir sempre:

- cobertura total;
- payout potencial por resultado;
- exposição máxima;
- probabilidades;
- diferença entre pagamento real e pontuação roguelite.

Isso evita que espetáculo obscureça matemática.

### Loop proposto

**Ler regra do salão → montar portfólio → girar → resolver apostas e Teses → reposicionar → decidir entre risco ou bancar progresso → loja → próximo salão.**

---

# Sistemas compartilhados recomendados

## Conteúdo inicial

Para um primeiro vertical slice de cada jogo:

- 18 passivos;
- 8 consumíveis;
- 6 regras de desafio;
- 3 identidades iniciais;
- 1 campanha de 20–30 minutos;
- modo diário com seed;
- compêndio de efeitos e probabilidades.

Não começar com 100 itens. Validar se 18 efeitos já produzem builds reconhecíveis.

## Taxonomia de passivos

Distribuir itens entre:

- **economia**;
- **consistência**;
- **pontuação**;
- **transformação de regra**;
- **alto risco/alto retorno**;
- **pivot/recuperação**.

Toda categoria precisa conversar com pelo menos duas outras. Evitar efeitos isolados que só funcionem com um item específico.

## Telemetria de balanceamento

Registrar:

- taxa de escolha e de venda de cada efeito;
- vitória quando oferecido versus quando comprado;
- estágio médio de aquisição;
- pares/trios mais frequentes;
- diversidade de builds vencedoras;
- dinheiro médio guardado;
- frequência de reroll;
- derrotas por regra de desafio;
- tempo por decisão;
- quantos jogadores consultam telas probabilísticas.

Sinais de problema:

- efeito sempre comprado: provavelmente dominante ou barato;
- nunca comprado: fraco, confuso ou nichado demais;
- build única responde a todos os desafios: falta contrajogo;
- muita derrota sem alteração de estratégia: feedback insuficiente;
- jogador faz contas externamente: falta informação útil na interface.

## Onboarding

- ensinar em ação, não em parede de texto;
- introduzir um sistema por vez;
- primeiro passivo deve produzir uma mudança imediatamente perceptível;
- garantir uma epifania inicial do tipo “então as regras podem mudar”;
- usar desafios posteriores para reensinar conceitos esquecidos;
- manter descrições em até ~20 palavras sempre que possível;
- oferecer glossário e exemplos sob demanda.

---

# O que não copiar

## Não copiar expressão visual ou identidade

Evitar:

- personagens, palhaços ou mascotes semelhantes;
- molduras, versos, ilustrações ou nomes que evoquem Jokers específicos;
- paleta vermelho/azul, CRT, fundo psicodélico, pixel art ou composição de UI usados para parecer “Balatro”;
- termos como Blind, Ante, Joker, Tarot, Planet, Spectral, Voucher ou Stake no mesmo papel sistêmico;
- animações, áudio crescente ou flames com aparência e timing reconhecivelmente iguais;
- textos, ícones, raridades e layout da loja.

## Não copiar a estrutura literalmente

Não fazer “o mesmo jogo trocando poker por blackjack/roleta”:

- três encontros idênticos por estágio;
- cinco slots de passivos com equivalentes um-para-um;
- mesma sequência de loja, booster e voucher;
- mesmos modificadores com números ou nomes diferentes;
- chefes equivalentes às mesmas penalidades;
- multiplicação de score com apresentação visual semelhante.

Copiar **princípios abstratos** é legítimo; copiar a combinação concreta de sistemas e sua apresentação cria derivação sem originalidade.

## Não importar fragilidades

- Não esconder matemática que o jogador pode obter por trabalho tedioso.  
- Não confundir suspense com opacidade.
- Não apresentar aleatoriedade como habilidade.
- Não usar “quase ganhou” para estimular gasto.
- Não vender rerolls, energia, fichas ou loot boxes.
- Não misturar moeda real e economia roguelite.
- Não inventar odds ou histórico “quente/frio” que sugira previsibilidade falsa.
- Não deixar feedback audiovisual ocultar perdas ou valor esperado.

Para webapps de cassino, essas precauções são especialmente importantes: o sistema inspirado em Balatro deve funcionar melhor como **score attack com créditos fictícios**, compra premium única ou experiência gratuita, e não como mecanismo de monetização por aposta.

---

# Prioridade de implementação

1. **Vertical slice do blackjack**, pois sua decisão por mão já é rica.
2. Implementar engine de passivos orientada a eventos:
   `roundStart`, `cardDrawn`, `playerStand`, `handResolved`, `tableCleared`, `shopEntered`.
3. Criar 12 Protocolos e testar se aparecem ao menos 4 builds distintas.
4. Adicionar economia, juros e uma mesa-desafio.
5. Instrumentar telemetria antes de ampliar conteúdo.
6. Na roleta, prototipar primeiro o sistema de portfólio/prestígio sem alterar odds.
7. Validar se mover fichas entre giros gera decisões reais; só depois criar Teses e salões.
8. Fazer testes com novatos e jogadores experientes separadamente.
9. Balancear por diversidade e clareza, não por igualdade matemática perfeita.
10. Só então desenvolver identidade audiovisual própria.

---

## Fontes principais

- **Diário oficial de desenvolvimento de LocalThunk:**  
  https://localthunk.com/blog/balatro-timeline-3aarh
- **Entrevista sobre loops, risco, sinergias e familiaridade das cartas:**  
  https://rogueliker.com/balatro-interview/
- **Game Informer — simplicidade textual, emergência, dominância e iteração:**  
  https://gameinformer.com/interview/2024/03/21/balatro-was-almost-called-joker-poker-and-other-details-from-its-creator
- **TouchArcade — demos, feedback comunitário, progressão e mobile:**  
  https://toucharcade.com/2024/03/18/balatro-interview-mobile-port-localthunk-dlc-plans-updates-new-jokers-demo-feedback/
- **Game Developer — signposting e tutorial distribuído:**  
  https://www.gamedeveloper.com/design/balatro-creator-unveils-a-few-slick-signposting-strategies
- **Game Maker’s Toolkit — informação, suspense e o problema do score preview:**  
  https://gmtk.substack.com/p/balatros-cursed-design-problem
- **Rolling Stone — acessibilidade, builds, pivot e posição ética contra gambling predatório:**  
  https://www.rollingstone.com/culture/rs-gaming/balatro-localthunk-interview-1235214060/

**Arquivos alterados:** nenhum.  
**Problemas encontrados:** nenhuma fonte primária técnica completa estilo GDC; a melhor evidência disponível veio do diário oficial, entrevistas diretas e publicações de design que citam LocalThunk.