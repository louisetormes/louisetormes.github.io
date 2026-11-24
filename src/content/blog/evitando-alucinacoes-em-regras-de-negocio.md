---
title: 'Como evitar que a IA invente suas regras de negócio'
description: 'A IA dificilmente diz que não sabe — ela completa a lacuna com algo plausível. Chain-of-Verification, agentes especialistas e revisão adversarial: como trabalho para que regras de negócio complexas cheguem corretas ao código.'
pubDate: '2026-11-24T21:00:00Z'
tags: ['ia', 'processo', 'qualidade']
---

Existe um tipo de erro de IA que me preocupa mais do que todos os outros: o que parece certo.

Um código que não compila, a gente vê. Um teste que falha, a gente vê. Mas uma regra de negócio inventada — um prazo de carência que não existe, uma exceção que ninguém pediu, um arredondamento feito na etapa errada do cálculo — chega com a mesma clareza e a mesma confiança de uma regra verdadeira. E, em sistemas com regras de negócio complexas, é exatamente esse tipo de erro que passa por todas as etapas e só aparece em produção.

Este texto é sobre como lido com isso no dia a dia.

## Como a IA funciona — e por que ela não diz que não sabe

Um modelo de linguagem não consulta uma base de fatos. Ele gera a continuação mais plausível para o contexto que recebeu. Na maior parte do tempo, plausível e correto coincidem. Quando não coincidem, temos uma alucinação.

O ponto que mais importa na prática é este: **a IA dificilmente vai dizer, por conta própria, que não sabe**. Diante de uma lacuna, ela não para; ela completa. Usa o que tem — o contexto que você deu, padrões que viu em milhões de sistemas parecidos — e produz uma resposta coerente. Coerente, não necessariamente verdadeira.

Por isso, a pergunta que mais faço durante uma sprint não é "isso está certo?", e sim:

> **De onde veio essa informação?**

Se a resposta é "do PRD, seção tal", ótimo. Se a resposta é "inferi a partir do contexto", acabei de encontrar uma premissa que precisa ser validada por uma pessoa.

### O efeito cascata

Em um fluxo com agentes, cada etapa usa a saída da anterior como verdade. Isso torna as lacunas cumulativas:

1. Um **PRD pobre**, com pouca informação sobre as regras, deixa espaços em branco.
2. Na **arquitetura**, o agente preenche esses espaços com suposições razoáveis — e elas viram decisões estruturais.
3. As **histórias** são quebradas em cima dessas decisões, e as suposições viram critérios de aceite.
4. O **código** implementa fielmente os critérios de aceite. Os testes passam. Tudo está "correto".

No fim, a alucinação não parece alucinação: parece requisito. Foi documentada, especificada, implementada e testada. A origem dela era um parágrafo que faltou no PRD.

## Primeira defesa: não deixar lacunas

A forma mais barata de evitar uma alucinação é não dar espaço para ela. Antes de qualquer técnica sofisticada, o que mais faz diferença para mim é a qualidade do que entra:

- **Regras explícitas, com exemplos numéricos.** "Aplica-se multa por atraso" é um convite à invenção. "Multa de 2% sobre o valor da parcela, aplicada uma única vez, a partir do primeiro dia útil após o vencimento — exemplo: parcela de R$ 1.000,00 vencida em 10/03 paga em 15/03 gera R$ 20,00 de multa" não é.
- **Glossário do domínio.** Termos como "vigência", "carência" ou "competência" mudam de significado de um negócio para outro. Se não estiverem definidos, o modelo usará a definição mais comum — que pode não ser a sua.
- **Instrução explícita para as lacunas.** Peço que o agente marque tudo o que não estiver nas fontes, em vez de completar:

```text
Use apenas as informações do PRD e dos documentos anexados.
Quando uma regra necessária não estiver nessas fontes, NÃO a complete.
Marque como [PREMISSA NÃO CONFIRMADA] e liste ao final todas as premissas
que precisam ser validadas com a área de negócio.
```

Essa última instrução, sozinha, já muda bastante o comportamento. Ela dá ao modelo uma saída legítima para o "não sei" que ele não produziria espontaneamente.

## Chain-of-Verification (CoVe)

Para as decisões que importam, uso muito o **Chain-of-Verification**, um método proposto por pesquisadores da Meta AI em 2023 ([Dhuliawala et al.](https://arxiv.org/abs/2309.11495)). A ideia central é simples: em vez de confiar na primeira resposta, fazer o modelo planejar e executar a própria verificação.

O método tem quatro passos:

1. **Resposta inicial.** O modelo responde normalmente — por exemplo, descreve como uma regra de cálculo deve ser implementada.
2. **Planejamento das verificações.** O modelo gera perguntas que testariam os fatos e decisões contidos nessa resposta.
3. **Execução independente.** Cada pergunta é respondida isoladamente, *sem acesso à resposta inicial*.
4. **Resposta final.** O modelo compara as verificações com a resposta inicial e corrige o que não se sustentou.

O passo 3 é o mais importante e o mais ignorado. Se o modelo responde às verificações olhando para a resposta original, ele tende a confirmá-la — repete o mesmo erro com mais convicção. Separar as verificações quebra esse vício. Na prática, faço isso em uma conversa nova ou com outro agente, passando apenas a pergunta e as fontes.

Um exemplo de como aplico o passo 2 a uma regra de negócio:

```text
Você acabou de propor a implementação da regra de cálculo de encargos por atraso.
Antes de qualquer código, gere as perguntas de verificação para essa proposta:
- Para cada regra que você aplicou, qual trecho do PRD a sustenta?
- Em que ordem multa, juros e correção são aplicados, e onde isso está definido?
- Como a regra se comporta em: vencimento em dia não útil, pagamento parcial,
  pagamento antecipado, valor zero e parcela já renegociada?
- Que arredondamento é aplicado, em que etapa, e com quantas casas decimais?
Não responda às perguntas ainda. Apenas liste-as.
```

As perguntas vão então para uma verificação separada, só com o PRD como contexto. Quando a resposta independente diverge da proposta original, encontrei exatamente o ponto que precisava de atenção.

No dia a dia, nem sempre sigo o protocolo completo. Muitas vezes o CoVe vira uma postura: questionar uma decisão específica e pedir que o modelo volte, recupere a base daquela resposta e a verifique com mais profundidade. Mas, para regras críticas — dinheiro, prazos, permissões —, vale o rito inteiro.

## Invocar o especialista certo

Trabalho com o [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD), um framework que organiza a sprint em agentes especializados: analista, gerente de produto, arquiteto, UX, desenvolvimento, arquitetura de testes, entre outros. Cada um tem um papel, um conjunto de responsabilidades e um jeito próprio de olhar para o problema.

Isso abre uma possibilidade valiosa para a verificação: **quando surge uma dúvida, eu não pergunto para qualquer agente — eu invoco o que tem a lente certa para ela**.

| Quando a dúvida é sobre... | Invoco |
| :-- | :-- |
| Uma regra ambígua ou um requisito que parece faltar | Analista ou PM |
| Uma decisão estrutural, integração ou impacto em outros módulos | Arquiteto |
| Se os testes realmente cobrem os riscos da regra | Arquiteto de testes |
| Se a implementação segue a especificação | Dev, com a história em mãos |

O efeito é parecido com o de levar uma dúvida para a pessoa certa do time. O agente de arquitetura, por exemplo, tende a perguntar sobre consistência, acoplamento e falhas — coisas que o agente de desenvolvimento, focado em entregar a história, não levantaria. Trocar de agente é trocar de perspectiva, e muitas alucinações só aparecem quando alguém olha de outro ângulo.

Há também um benefício menos óbvio: o especialista chega sem o histórico da conversa em que a decisão foi tomada. Ele não está comprometido com a resposta anterior — o mesmo princípio da execução independente do CoVe.

## Revisão adversarial em cada história

A última camada é a **revisão adversarial**, e eu a faço em cada história, não só no fim da sprint.

A diferença para uma revisão comum está na instrução. Uma revisão comum pergunta "está bom?". Uma revisão adversarial parte do princípio de que *há* problemas e exige que eles sejam encontrados: premissas não sustentadas, casos de borda não tratados, divergências entre especificação e código, riscos de segurança, regras que parecem ter vindo de lugar nenhum.

Fazer isso a cada história tem dois efeitos. O primeiro é óbvio: os problemas aparecem cedo, quando ainda são baratos de corrigir — e não se acumulam no QA. O segundo é mais sutil: a revisão adversarial força uma releitura das regras de negócio à luz do que foi efetivamente implementado. É frequentemente ali que uma premissa inventada lá no PRD finalmente se revela.

Os resultados que chegam ao fim da sprint são, consistentemente, mais fidedignos. Não porque a IA errou menos, mas porque os erros foram encontrados no caminho.

## O fluxo, resumido

Para regras de negócio complexas, o que faço se resume a:

1. **Alimentar bem.** PRD com regras explícitas, exemplos numéricos e glossário.
2. **Dar permissão para o "não sei".** Exigir que premissas não confirmadas sejam marcadas, não completadas.
3. **Perguntar a origem.** Toda regra precisa apontar para uma fonte.
4. **Verificar de forma independente.** CoVe nas decisões críticas, com as verificações fora da conversa original.
5. **Mudar de perspectiva.** Invocar o agente especialista mais adequado para cada dúvida.
6. **Revisar de forma adversarial, história por história.** Sem deixar para o final.

## Para terminar

A IA não sabe o que não sabe. Essa é a principal limitação dela — e a principal razão pela qual quem conduz o processo continua sendo indispensável. O nosso trabalho não é desconfiar de tudo, nem aceitar tudo. É saber **de onde vem cada resposta** e construir um processo em que as respostas sem origem sejam encontradas antes de virarem código.

Nos textos anteriores, escrevi sobre [a mudança de papel na sprint](/blog/de-uma-etapa-para-a-sprint-inteira/) e sobre [o fim do desenvolvedor como papel isolado](/blog/o-desenvolvedor-nao-existe-mais/). Este é, de certa forma, o lado prático dos dois: o que significa, no dia a dia, responder pelo que a máquina escreve.
