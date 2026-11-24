---
title: 'O desenvolvedor não existe mais'
description: 'A carreira deixou de ser sobre escrever código e passou a ser engenharia de ponta a ponta. Sobre o engenheiro de software de IA — e por que provocar a máquina em cada etapa é o que evita a pilha de bugs no final.'
pubDate: '2026-11-24T18:00:00Z'
tags: ['ia', 'carreira', 'engenharia']
---

A frase é provocativa de propósito, então vale começar pelo que ela **não** quer dizer. Não quer dizer que ninguém mais escreve código, nem que as pessoas que desenvolvem software vão desaparecer. Quer dizer que um papel específico — aquele definido por *receber uma especificação e transformá-la em código* — perdeu o sentido como carreira.

No [texto anterior](/blog/de-uma-etapa-para-a-sprint-inteira/), contei como deixei de ser dona de uma etapa da sprint para conduzir a sprint inteira. Este é sobre o que essa mudança diz a respeito da profissão como um todo.

## O que era ser desenvolvedor

Durante muito tempo, o valor de quem desenvolvia era medido, na prática, pela capacidade de implementar. Conhecer bem a linguagem, dominar o framework, entregar a história no prazo, com o código funcionando. O problema já chegava definido; a solução, muitas vezes, também. O trabalho era o meio do caminho.

Era um papel legítimo e difícil. Exigia anos para ser bem feito. Mas ele tinha uma característica que se tornou decisiva: era a parte do processo mais fácil de descrever com precisão — e, portanto, a mais fácil de automatizar.

## Por que esse papel deixou de fazer sentido

Quando um agente de IA consegue transformar uma boa especificação em código funcional em minutos, quem só faz isso passa a competir com a ferramenta. E é uma competição sem futuro.

O valor não sumiu. Ele **migrou** — para antes e para depois do código. Para antes: entender o problema, desenhar a solução, especificar sem ambiguidade. Para depois: verificar, auditar, provar que funciona e que funciona *pelo motivo certo*.

O código continua no centro do produto. Só deixou de ser o centro da carreira.

## O engenheiro de software de IA

O que surge no lugar não é um "operador de prompt". É algo mais próximo do que a palavra *engenharia* sempre prometeu: alguém responsável pelo sistema como um todo, que usa agentes como força de trabalho e responde pelo resultado. Vejo quatro competências no centro desse papel.

### Entender o processo

Saber como uma entrega nasce e termina — do PRD ao QA — e onde cada etapa costuma falhar. Quem só conhecia a etapa de implementação precisa aprender o ciclo inteiro, porque agora é responsável por ele.

### Entender a solução

Não basta que o sistema funcione; é preciso saber *por que* ele funciona. Qual é o modelo de dados, onde estão as fronteiras, o que acontece sob carga, o que acontece quando uma dependência cai. Um agente entrega uma solução; o engenheiro precisa ser capaz de defendê-la — ou de recusá-la.

### Julgar os pontos críticos

Nem tudo merece o mesmo nível de atenção. Uma tela de listagem não tem o mesmo risco que uma regra de cálculo financeiro, uma migração de dados ou um controle de acesso. Saber onde concentrar o rigor é, talvez, a habilidade mais valiosa — e a que mais depende de experiência.

### Rever

Ler código com atenção sempre foi importante. Agora é central. Quem conduz agentes lê muito mais código do que escreve, e precisa ler com a desconfiança de quem sabe que aquele código foi produzido com muita confiança e nenhuma responsabilidade.

## Provocar a IA

Existe uma característica dos agentes que muda tudo: eles tendem a concordar. Pergunte "esta solução está correta?" e a resposta mais provável é alguma variação de "sim". Não por má-fé, mas porque essa é a direção natural da conversa.

Por isso, a pergunta certa nunca é *"está certo?"*. A pergunta certa é **"onde isso quebra?"**.

Provocar a IA é tratá-la como um colega a quem você pede, explicitamente, que ataque o próprio trabalho. Na prática, faço isso em cada etapa:

| Etapa | A provocação |
| :-- | :-- |
| PRD | Que requisitos estão implícitos aqui e ninguém escreveu? |
| Arquitetura | Quais são as duas alternativas mais fortes a esta proposta, e por que ela seria pior que elas? |
| Histórias | Que dependência entre estas histórias vai travar a sprint? |
| Especificação | Que pergunta um desenvolvedor faria lendo isto e não encontraria resposta? |
| Código | Que entrada faz esta função falhar? O que acontece com dados nulos, duplicados ou de outro usuário? |
| Evidências | Que comportamento importante estes testes **não** cobrem? |
| Auditoria de PR | Se você fosse um atacante, por onde entraria neste código? |

Um exemplo concreto do tipo de pedido que uso antes de aceitar uma implementação:

```text
Revise a implementação abaixo como se fosse a auditoria final antes de produção.
Não diga se está boa. Liste:
1. As premissas que o código assume e que não estão garantidas.
2. Os casos de borda que não foram tratados.
3. Os riscos de segurança (autenticação, autorização, injeção, exposição de dados).
4. O que quebraria primeiro com 100x mais volume.
Para cada item, aponte a linha e proponha um teste que o comprovaria.
```

A diferença entre as respostas a "está certo?" e a esse pedido costuma ser enorme. O agente sabe encontrar os problemas — só precisa ser convidado a procurá-los.

E um cuidado importante: provocar a IA não substitui o julgamento. A lista que volta também precisa ser lida com critério. Às vezes ela aponta riscos irrelevantes; às vezes esquece o mais importante. A provocação amplia a minha revisão, não a terceiriza.

## O gargalo que mora no final

Todo time que já viveu uma sprint conhece o cenário: o desenvolvimento termina, a entrega chega no QA, e de repente aparece uma pilha de bugs. Cada um exige voltar ao código, às vezes à especificação, às vezes à arquitetura. O fim da sprint vira um funil.

Com agentes, esse risco aumenta. Eles produzem muito, muito rápido — e, se ninguém valida no caminho, produzem problemas na mesma velocidade. Deixar toda a verificação para o final é a forma mais eficiente de transformar ganho de produtividade em retrabalho.

A saída é inverter a lógica: **validar em cada etapa, não só na última**. Um requisito ambíguo pego no PRD custa uma conversa. O mesmo requisito descoberto no QA custa uma história refeita. Provocar a IA a cada passo é o que espalha a verificação ao longo da sprint e impede que tudo se acumule no fim.

> Bug encontrado no final é a conta de todas as perguntas que não foram feitas no começo.

## Como se preparar

Se você ainda se vê no papel de quem implementa, minha sugestão não é abandonar o código. É ampliar o raio:

- **Estude o que vem antes do código.** Escrita de requisitos, arquitetura, modelagem de dados. É onde as decisões mais caras são tomadas.
- **Aprenda a especificar.** Uma especificação boa é o melhor prompt que existe.
- **Leia mais código do que escreve.** E leia com a pergunta "onde isso quebra?" na cabeça.
- **Reforce os fundamentos.** Segurança, concorrência, banco de dados, sistemas distribuídos. São exatamente os pontos onde agentes erram com mais confiança — e onde o julgamento humano mais faz diferença.
- **Pratique a desconfiança produtiva.** Não é rejeitar o que a IA produz; é exigir que ela prove.

O desenvolvedor, como papel isolado no meio da esteira, está deixando de existir. O que ocupa o lugar é mais exigente e, sinceramente, mais interessante: uma engenharia de software completa, em que entender, julgar e verificar valem mais do que digitar. A máquina escreve. Quem responde é a gente.
