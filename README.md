# Tradutor do P

[https://nicolastoledoo.github.io/Tradutor-do-P/](https://nicolastoledoo.github.io/Tradutor-do-P/)

Tradutor de Língua do P - uma aplicação web para converter texto em português para a variação linguística conhecida como "Língua do P".

## O que é a Língua do P?

A Língua do P é uma variação linguística informal baseada em regras fonéticas sistemáticas. Funciona através da modificação de sílabas das palavras originais seguindo padrões específicos, criando uma forma de comunicação codificada.

### Como funciona

O sistema analisa cada palavra, dividindo-a em sílabas, e aplica transformações conforme a variante selecionada. O processo preserva a estrutura original do texto enquanto adiciona elementos silábicos extras.

## Variantes Suportadas

### Pê (Brasil)

Insere "pê" antes de cada sílaba.

**Exemplo:**
- Original: `gato`
- Traduzido: `pêga pêto`

### Double Talk (Portugal)

Repete a rima de cada sílaba iniciando com "p".

**Exemplo:**
- Original: `gato`
- Traduzido: `ga-pa-to-po`

### P+Vogal

Insere "P" seguido da vogal da sílaba antes dela.

**Exemplo:**
- Original: `gato`
- Traduzido: `PagaPato`

## Exemplos Práticos

| Original | Pê (Brasil) | Double Talk | P+Vogal |
|----------|-------------|-------------|---------|
| casa | pêca pêsa | ca-pa-sa-pa | PcasaPasa |
| livro | pêli pêvro | li-pi-vro-po | Pilipvro |
| escola | pêso pêco pêla | es-co-la-po | PescoPcola |
| computador | pêcom pu ta dêor | com-pu-ta-dor-por | Pcomputador |

## Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)

## Uso

1. Digite o texto no campo de entrada
2. A tradução ocorre automaticamente em tempo real
3. Use o botão "Copiar" para copiar o resultado

## Estrutura do Projeto

```
Tradutor-do-P/
├── index.html      # Página principal
├── style.css       # Estilos
├── script.js       # Lógica de tradução
└── background.js   # Efeitos visuais de fundo
```

## Licença

© 2024 Tradutor do P
