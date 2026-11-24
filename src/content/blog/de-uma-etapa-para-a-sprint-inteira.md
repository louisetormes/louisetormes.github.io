---
title: 'De uma etapa para a sprint inteira'
description: 'Há um ano eu era dona do desenvolvimento. Hoje conduzo a sprint do PRD ao QA, com agentes de IA no time. O que mudou, o que não mudou e o que aprendi no caminho.'
pubDate: '2026-11-24'
tags: ['ia', 'carreira', 'processo']
---

Trabalho com tecnologia há pouco mais de seis anos, quase todos eles no backend, escrevendo Java e mantendo PL/SQL em sistemas legados. Durante a maior parte desse tempo, o meu lugar na sprint foi claro e estável: eu era dona da etapa de desenvolvimento.

Há cerca de um ano, essa fronteira começou a se mover. Hoje respondo pela sprint inteira — do PRD ao QA. Este texto é sobre essa mudança: como ela aconteceu, o que exigiu de mim e o que eu acho que ela diz sobre o nosso trabalho daqui para a frente.

## Como era

A sprint funcionava como uma linha de montagem bem conhecida. Alguém definia o problema, alguém desenhava a solução, as histórias chegavam refinadas e estimadas, e a minha parte começava ali: transformar especificação em código funcionando.

Quando o time precisava, eu me arriscava nos cenários de QA. Mas era isso — me arriscar. Testar não era o meu papel; era uma ajuda pontual em uma etapa que pertencia a outra pessoa.

Esse modelo tem uma virtude e um custo. A virtude é a especialização: cada pessoa aprofunda o próprio pedaço. O custo são as passagens de bastão. Cada uma delas é um ponto onde contexto se perde, onde uma decisão de arquitetura chega ao código sem o porquê, onde o teste valida o que foi escrito e não o que foi pedido.

## O que os agentes mudaram

Os agentes de IA não chegaram fazendo o meu trabalho por mim. Chegaram fazendo algo mais sutil: **barateando o custo de executar cada etapa**.

Rascunhar um PRD, propor uma arquitetura, quebrar um épico em histórias, gerar uma especificação detalhada, escrever código, montar evidências de teste — tudo isso passou a levar uma fração do tempo. E quando executar fica barato, o gargalo muda de lugar. Deixa de ser *fazer* e passa a ser *decidir*, *conectar* e *verificar*.

Foi aí que o meu papel mudou. Se uma pessoa com bons agentes consegue percorrer todas as etapas, as passagens de bastão podem simplesmente deixar de existir — desde que essa pessoa saiba conduzir o fluxo inteiro com critério. Tive que me reinventar para ser essa pessoa.

## A sprint, de ponta a ponta

Hoje a minha sprint tem oito etapas. Gosto de pensar nelas em três atos.

### Planejar: PRD, arquitetura, histórias e especificação

É aqui que eu passo mais tempo pensando — e onde um erro custa mais caro, porque tudo o que vem depois herda o que for decidido agora.

No **PRD**, o trabalho é entender o problema e escrever, sem ambiguidade, o que será entregue e o que fica de fora. Na **arquitetura de solução**, decido como construir e registro *por que* — porque o agente que vai implementar não estava na conversa, e a pessoa que vai manter o sistema daqui a um ano também não. Depois **divido em histórias e estimo**, e então **especifico** cada uma até o ponto em que ela pode ser executada sem que ninguém — humano ou agente — precise adivinhar.

Os agentes ajudam muito em todas essas etapas: propõem estruturas, levantam cenários que eu não tinha considerado, apontam inconsistências. Mas a decisão é minha, e a responsabilidade por ela também.

### Construir: desenvolvimento

A etapa que antes era o meu trabalho inteiro hoje é uma entre oito. E, curiosamente, é das que mais mudaram de natureza.

Com uma boa especificação, o agente escreve boa parte do código. O meu papel passa a ser o de quem orienta, lê, questiona e corrige o rumo. A experiência de anos escrevendo Java e, principalmente, mantendo sistemas legados pesa muito aqui: quem já depurou uma procedure de mil linhas aprende a desconfiar de código que *parece* certo.

### Provar: evidências, auditoria de PR, QA e conclusão

Se no modelo antigo o QA era uma etapa de outra pessoa, hoje provar que funciona é responsabilidade minha do começo ao fim.

Na **coleta de evidências**, demonstro com testes e dados que o comportamento implementado é o comportamento especificado. Na **auditoria de PR**, reviso tudo com rigor — inclusive, e principalmente, o código que eu não digitei. É aqui que mora o tipo de problema que um agente produz com toda a confiança:

```ts
// Funciona, passa no teste feliz e está errado: qualquer usuário lê a fatura de qualquer outro.
app.get('/api/faturas/:id', async (req, res) => {
	const fatura = await db.faturas.findById(req.params.id);
	res.json(fatura);
});

// O que a auditoria exige: autenticação e verificação de que o recurso pertence a quem pede.
app.get('/api/faturas/:id', requireAuth, async (req, res) => {
	const fatura = await db.faturas.findOne({ id: req.params.id, ownerId: req.user.id });
	if (!fatura) return res.sendStatus(404);
	res.json(fatura);
});
```

Por fim, **QA e conclusão**: validar com o olhar de quem vai usar e fechar o ciclo. A diferença em relação a antes é que agora eu conheço a história inteira daquela entrega — do problema original à última linha de código. O teste deixa de ser uma verificação às cegas.

## O que não mudou

Seria fácil contar essa história como "a IA fez o trabalho de cinco pessoas". Não é isso que eu vejo.

O que os agentes fazem muito bem é executar. O que continua sendo humano é **julgar**: definir o problema certo, escolher entre duas arquiteturas razoáveis, perceber que uma especificação está incompleta, desconfiar de um código bonito demais, decidir que algo não está pronto. Quando uma única pessoa conduz o ciclo inteiro, esse julgamento não diminui — ele se concentra. Não tem mais um colega na próxima etapa para pegar o que escapou.

> A IA acelera a execução. A responsabilidade pela entrega continua sendo de quem conduz.

## O que eu aprendi até aqui

Ainda estou no meio dessa transição, mas algumas coisas já ficaram claras para mim:

1. **A especificação virou o artefato mais importante da sprint.** Um agente é tão bom quanto as instruções que recebe. Tempo investido em especificar bem volta multiplicado no desenvolvimento.
2. **Evidência vale mais que confiança.** Código gerado chega com uma segurança que não é garantia de nada. Eu só considero pronto o que consigo provar.
3. **Experiência técnica não perdeu valor — mudou de função.** Os anos de backend e legado não servem mais só para escrever código; servem para saber o que procurar quando leio o código de outro.
4. **Reinventar-se é contínuo.** As ferramentas mudam a cada poucos meses. O que fica é a capacidade de aprender um processo novo sem perder o critério.

É sobre esse território — onde a experiência de quem constrói sistemas encontra a orquestração de agentes — que pretendo escrever aqui. Nos próximos textos, quero aprofundar cada um desses atos: como escrevo especificações para agentes, como organizo a coleta de evidências e o que procuro numa auditoria de PR.

Se você também está vendo o seu papel mudar de forma, eu gostaria muito de saber como está sendo.
