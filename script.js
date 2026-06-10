document.addEventListener('DOMContentLoaded', () => {
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const copyBtn = document.getElementById('copy-btn');
const charCounter = document.getElementById('char-counter');
const variantTitle = document.getElementById('variant-title');
const variantDescription = document.getElementById('variant-description');
const variantExample = document.getElementById('variant-example');
const variantDetail = document.getElementById('variant-detail');
const variantExamples = document.getElementById('variant-examples');
const variantSelect = document.getElementById('variant-select');

let currentVariant = 'pe';

const variantData = {
  pe: {
    title: 'Pê (Brasil)',
    description: 'Insere "p" antes de cada sílaba, usando a vogal original como base.',
    example: '"gato" → "pegapato"',
    detail: 'A sílaba original é duplicada com o som "p" inserido, criando uma camada de confusão sonora.',
    examples: ['ga → gapa', 'to → topo']
  },
  double: {
    title: 'Double Talk',
    description: 'Repete cada sílaba adicionando "p" seguido da vogal original.',
    example: '"gato" → "gapa-topo"',
    detail: 'Cada sílaba é duplicada com o prefixo "p" mantendo a vogal original.',
    examples: ['ga → gapa', 'to → topo']
  },
  pvowel: {
    title: 'P+Vogal',
    description: 'Adiciona "p" seguido da vogal correspondente antes de cada sílaba.',
    example: '"gato" → "pagato"',
    detail: 'O som "p" é inserido antes da sílaba usando apenas a vogal correspondente.',
    examples: ['ga → paga', 'to → pato']
  }
};

variantSelect.addEventListener('change', () => {
  currentVariant = variantSelect.value;
  const data = variantData[currentVariant];
  variantTitle.textContent = data.title;
  variantDescription.textContent = data.description;
  variantExample.innerHTML = `<span>Ex:</span> ${data.example}`;
  variantDetail.textContent = data.detail;
  variantExamples.innerHTML = data.examples.map(ex => `<span>${ex}</span>`).join('');
  translate();
});

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

function encodePe(text) {
  return processText(text, (syllables) => {
    return syllables.map(s => 'pê' + s).join(' ');
  });
}

function encodeDoubleTalk(text) {
  return processText(text, (syllables) => {
    return syllables.map(s => {
      const vowel = getVowelFromSyllable(s);
      return s + '-p' + (vowel || 'a');
    }).join('-');
  });
}

function encodePVowel(text) {
  return processText(text, (syllables) => {
    return syllables.map(s => {
      const vowel = getVowelFromSyllable(s);
      return 'P' + (vowel || 'a') + s;
    }).join('');
  });
}

function getVowelFromSyllable(syllable) {
  const vowels = 'aeiouáéíóúâêîôûãõàèìòùäëïöü';
  for (const c of syllable.toLowerCase()) {
    if (vowels.includes(c)) return c;
  }
  return 'a';
}

function processText(text, syllableProcessor) {
  const wordRegex = /[a-zA-ZáéíóúâêîôûãõàèìòùäëïöüÁÉÍÓÚÂÊÎÔÛÃÕÀÈÌÒÙÄËÏÖÜ]+/g;
  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = wordRegex.exec(text)) !== null) {
    result += text.slice(lastIndex, match.index);
    const syllables = splitSyllables(match[0]);
    result += syllableProcessor(syllables);
    lastIndex = wordRegex.lastIndex;
  }

  result += text.slice(lastIndex);
  return result;
}

function decodePe(text) {
  const cleaned = text.replace(/\bpê/gi, '');
  return cleaned.replace(/\s+/g, '');
}

function decodeDoubleTalk(text) {
  return text.replace(/-p[aeiouáéíóúâêîôûãõàèìòùäëïöü]/gi, '');
}

function decodePVowel(text) {
  return text.replace(/P[aeiouáéíóúâêîôûãõàèìòùäëïöü]/gi, '');
}

function translate() {
  const text = inputText.value;

  if (!text.trim()) {
    outputText.textContent = 'A revelação aguarda o seu comando...';
    outputText.classList.add('empty');
    return;
  }

  let result;
  switch (currentVariant) {
    case 'double':
      result = encodeDoubleTalk(text);
      break;
    case 'pvowel':
      result = encodePVowel(text);
      break;
    default:
      result = encodePe(text);
  }
  outputText.textContent = result;
  outputText.classList.remove('empty');
}



let debounceTimer;
inputText.addEventListener('input', () => {
  charCounter.textContent = `${inputText.value.length} / 5000`;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(translate, 150);
});



copyBtn.addEventListener('click', () => {
  const textToCopy = outputText.textContent;
  if (textToCopy && !outputText.classList.contains('empty')) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copiado!`;
      setTimeout(() => {
        copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copiar`;
      }, 2000);
    });
  }
});
});


