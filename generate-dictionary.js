function splitSyllables(word) {
  if (!word || word.trim() === '') return [word];
  const vowels = 'aeiouáéíóúâêîôûãõàèìòùäëïöüAEIOUÁÉÍÓÚÂÊÎÔÛÃÕÀÈÌÒÙÄËÏÖÜ';
  const isVowel = (c) => vowels.includes(c);
  const lower = word.toLowerCase();
  const syllables = [];
  let i = 0;

  while (i < word.length) {
    let start = i;
    let syllable = '';

    while (i < word.length && !isVowel(word[i])) {
      syllable += word[i];
      i++;
    }

    if (i >= word.length) {
      if (syllables.length > 0 && syllable.length > 0) {
        syllables[syllables.length - 1] += syllable;
      } else if (syllable.length > 0) {
        syllables.push(syllable);
      }
      break;
    }

    syllable += word[i];
    i++;

    if (i < word.length && isVowel(word[i])) {
      const prevVowel = lower[i - 1];
      const currVowel = lower[i];
      const diphthongs = [
        'ai', 'ei', 'oi', 'ui', 'au', 'eu', 'ou', 'iu',
        'ão', 'ãe', 'ãi', 'ão',
        'ai', 'ei', 'oi', 'au', 'eu', 'iu',
        'ia', 'ie', 'io', 'iu', 'ua', 'ue', 'uo', 'ui',
        'ei', 'oi', 'ai', 'ou'
      ];
      const pair = (prevVowel + currVowel).toLowerCase();
      if (diphthongs.includes(pair) && (i + 1 >= word.length || !isVowel(word[i + 1]))) {
        syllable += word[i];
        i++;
      }
    }

    if (i < word.length && !isVowel(word[i])) {
      if (i + 1 < word.length && isVowel(word[i + 1])) {
        const consonantClusters = [
          'bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr',
          'pl', 'pr', 'tr', 'ch', 'lh', 'nh', 'qu', 'gu'
        ];
        const cluster = (word[i] + word[i + 1]).toLowerCase();
        if (!consonantClusters.includes(cluster)) {
          syllable += word[i];
          i++;
        }
      } else if (i + 1 < word.length && !isVowel(word[i + 1])) {
        if (word[i].toLowerCase() === 's' && word[i + 1].toLowerCase() !== 's') {
          syllable += word[i];
          i++;
        } else {
          syllable += word[i];
          i++;
        }
      } else {
        syllable += word[i];
        i++;
      }
    }

    syllables.push(syllable);
  }

  return syllables.length > 0 ? syllables : [word];
}

function getVowelFromSyllable(syllable) {
  const vowels = 'aeiouáéíóúâêîôûãõàèìòùäëïöü';
  for (const c of syllable.toLowerCase()) {
    if (vowels.includes(c)) return c;
  }
  return 'a';
}

function encodePe(word) {
  const syllables = splitSyllables(word);
  return syllables.map(s => 'pê' + s).join(' ');
}

function encodeDoubleTalk(word) {
  const syllables = splitSyllables(word);
  return syllables.map(s => s + '-p' + getVowelFromSyllable(s)).join('-');
}

function encodePVowel(word) {
  const syllables = splitSyllables(word);
  return syllables.map(s => 'P' + getVowelFromSyllable(s) + s).join('');
}

const words = [
  "abacaxi","abelha","abraço","abrir","absoluto","academia","acesso","acidente","aço","acolher",
  "acordo","acreditar","ativo","atual","avião","avô","avó","azul",
  "baile","baixo","banana","banco","banda","banho","barba","barco","barra","base","bater","bebê",
  "beleza","bem","beber","bíblia","bicicleta","boca","bom","bonito","braço","branco","bravo","breve",
  "brilhar","brincar","burro","buscar","botão","bairro",
  "cabo","cabeça","cabelo","caber","cada","cadeira","café","cair","caixa","calma","calor","cama",
  "caminho","campo","canção","cantar","capaz","cara","caráter","carne","caro","carta","casa","casar",
  "caso","castelo","cego","céu","certo","cerveja","chave","chegar","cheio","chefe","chocolate","chorar",
  "chuva","cima","cinco","cinema","cidade","claro","classe","coisa","comer","começo","comprar","comum",
  "conta","contar","contra","correr","cortar","costa","costume","crer","crise","cruz","cuidar","culpa",
  "cultura","cura","curso","curto","custo",
  "dado","dança","dar","dedo","deixar","dentro","depressa","depois","Deus","dia","dinheiro","dizer",
  "doce","dolor","dormir","dois","dúvida","duro","durante","decisão",
  "é","educação","efeito","ela","ele","eles","em","embora","enquanto","entender","entre","então",
  "era","erro","escola","escrever","escutar","espaço","especial","esperar","espírito","essa","esse",
  "estar","estrela","eu","exemplo","existir","experiência",
  "fácil","falar","falta","família","famoso","favor","fazer","fé","feliz","ferida","festa","filho",
  "fim","flor","fogo","folha","fome","forma","forte","foto","frente","frio","fruta","futuro",
  "ganhar","gato","gente","geral","gostar","governo","graça","grande","grave","grupo","guerra","guia",
  "haver","história","hoje","homem","hora","humano",
  "ideia","idade","igreja","igual","imagem","importante","incluir","início","interesse","inverno",
  "jardim","janela","jogo","jovem","junto","justiça",
  "lado","lago","lar","largo","lei","leite","ler","letra","livre","livro","logo","longe","lugar",
  "luz","lua","luta",
  "mãe","maior","mal","mandar","mão","manter","mapa","mar","marcar","marido","mas","medo","melhor",
  "memória","menino","menor","mente","mesa","mesmo","meio","menina","mês","mestre","meu","mil",
  "minuto","moça","momento","monte","morar","morte","mostrar","motivo","mulher","mundo","muito",
  "música","mudar",
  "nada","não","nariz","natureza","necessário","nenhum","noite","nome","norte","nosso","novo",
  "número","nunca",
  "obra","olho","onde","opção","ordem","origem","ouro","ouvir","oito",
  "pai","palavra","parte","partir","passar","paz","pé","pedra","pedir","pegar","pensar","pequeno",
  "perder","perto","peso","pessoa","pintar","plano","poder","ponto","porta","pouco","povo","primeiro",
  "problema","procurar","professor","programa","pronto","próprio",
  "quando","quanto","quarto","quase","quatro","quem","querer","questão","quinze",
  "razão","real","receber","reconhecer","região","rei","relação","religião","resolver","respeito",
  "resposta","resultado","rio","rosto","rua",
  "saber","sair","sangue","saúde","se","semana","sempre","sentir","ser","sete","sim","sistema",
  "sítio","sobre","sol","sonho","sorrir","sorte","sozinho",
  "tarde","te","tempo","ter","terra","tesouro","tipo","tocar","todo","tomar","trabalho","trazer",
  "três","triste","trocar","tudo",
  "último","um","uma","único","universo","usar","útil",
  "valer","valor","vento","verdade","verde","vez","viagem","vida","vinho","vir","viver","vontade",
  "voltar","você","voz","vermelho","velho","vizinho",
  "zero","zona"
];

const uniqueWords = [...new Set(words)].sort((a, b) => a.localeCompare(b, 'pt-BR'));

const entries = uniqueWords.map(word => ({
  word,
  translations: {
    pe: encodePe(word),
    double: encodeDoubleTalk(word),
    pvowel: encodePVowel(word)
  }
}));

let output = `// Dados do Dicionário da Língua do P\n`;
output += `// Gerado automaticamente usando as funções de tradução do site\n\n`;
output += `const dictionaryData = [\n`;
for (const entry of entries) {
  output += `  { word: ${JSON.stringify(entry.word)}, translations: { pe: ${JSON.stringify(entry.translations.pe)}, double: ${JSON.stringify(entry.translations.double)}, pvowel: ${JSON.stringify(entry.translations.pvowel)} } },\n`;
}
output += `];\n`;

require('fs').writeFileSync('/home/yks/Projetos/sites/site-do-P/dictionary-data.js', output, 'utf8');
console.log(`Generated ${entries.length} entries`);
