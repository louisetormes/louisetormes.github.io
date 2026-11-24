# louisetormes.github.io

Blog pessoal sobre engenharia de software na era da IA. Feito com [Astro](https://astro.build), publicado no GitHub Pages.

## Escrever um post

1. Copie `src/content/blog/_modelo-de-post.md` para `src/content/blog/<slug>.md` — o nome do arquivo vira a URL (`/blog/<slug>/`).
2. Preencha o frontmatter:

   ```yaml
   ---
   title: 'Título'
   description: 'Resumo de uma ou duas frases (lista, topo do post e compartilhamento).'
   pubDate: '2026-11-24'
   tags: ['ia', 'arquitetura'] # minúsculas, sem acento, hífen no lugar de espaço
   draft: true                 # rascunho: aparece só no `npm run dev`
   ---
   ```

3. Quando estiver pronto, remova `draft: true` (ou troque para `false`) e faça push.

Imagem de capa opcional: coloque o arquivo em `src/assets/` e use `heroImage: '../../assets/capa.jpg'`.

## Comandos

| Comando           | Ação                                         |
| :---------------- | :------------------------------------------- |
| `npm install`     | Instala as dependências                      |
| `npm run dev`     | Servidor local em `localhost:4321`           |
| `npm run build`   | Gera o site em `./dist/`                     |
| `npm run preview` | Serve o build localmente (testa a CSP)       |

> **Rede corporativa:** se as fontes não carregarem no build local (`SELF_SIGNED_CERT_IN_CHAIN`),
> rode com o repositório de certificados do sistema: `NODE_OPTIONS=--use-system-ca npm run build`.
> Não desative a verificação TLS.

## Onde mexer

- `src/consts.ts` — nome, descrição, links sociais.
- `src/pages/sobre.astro` — página "Sobre".
- `src/styles/global.css` — cores (tokens no topo, claro e escuro) e tipografia dos textos.

## Segurança

- **CSP** via `<meta>` gerada pelo Astro (`security.csp` em `astro.config.mjs`), com hash de cada script/estilo.
  O GitHub Pages não permite cabeçalhos HTTP próprios, então `frame-ancestors`, HSTS e `X-Frame-Options`
  não podem ser definidos aqui — se um dia precisar deles, coloque um CDN (ex.: Cloudflare) na frente.
- Destaque de sintaxe com **Prism** (classes CSS) em vez de Shiki (estilos inline, incompatíveis com a CSP).
- Fontes baixadas no build e servidas pelo próprio domínio: nenhuma requisição a terceiros em runtime.
- Links externos com `rel="noopener noreferrer"`.
