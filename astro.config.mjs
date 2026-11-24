// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// Script inline de tema (src/scripts/theme-init.js): scripts `is:inline` não recebem hash
// automático, então calculamos aqui a partir do mesmo arquivo — nunca fica dessincronizado.
const themeInitHash =
	'sha256-' +
	createHash('sha256')
		.update(readFileSync(new URL('./src/scripts/theme-init.js', import.meta.url), 'utf8'))
		.digest('base64');

export default defineConfig({
	site: 'https://louisetormes.github.io',
	// base: '/blog', // só se usar um repositório com outro nome
	integrations: [mdx(), sitemap()],

	// Prism gera classes (não estilos inline), o que é compatível com a CSP abaixo.
	// O Shiki (padrão) usa estilos inline e seria bloqueado pela CSP.
	markdown: {
		syntaxHighlight: 'prism',
	},

	// Fontes baixadas no build e servidas pelo próprio site (nenhuma requisição a terceiros em runtime).
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Newsreader',
			cssVariable: '--font-serif',
			weights: ['300 700'],
			styles: ['normal', 'italic'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['Georgia', 'serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-sans',
			weights: ['400 700'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'JetBrains Mono',
			cssVariable: '--font-mono',
			weights: ['400 600'],
			subsets: ['latin'],
			fallbacks: ['ui-monospace', 'monospace'],
		},
	],

	// GitHub Pages não permite cabeçalhos HTTP customizados, então a CSP vai via <meta>.
	// O Astro calcula os hashes dos scripts/estilos de cada página.
	security: {
		csp: {
			directives: [
				"default-src 'self'",
				"img-src 'self' data:",
				"font-src 'self'",
				"connect-src 'self'",
				"object-src 'none'",
				"base-uri 'self'",
				"form-action 'none'",
			],
			scriptDirective: {
				hashes: [/** @type {`sha256-${string}`} */ (themeInitHash)],
			},
		},
	},
});
