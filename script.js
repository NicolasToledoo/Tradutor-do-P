const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const sourceLang = document.getElementById('source-lang');
const targetLang = document.getElementById('target-lang');
const variantSelect = document.getElementById('variant');
const copyBtn = document.getElementById('copy-btn');
const speakBtn = document.getElementById('speak-btn');
const inputCount = document.getElementById('input-count');
const variantDesc = document.getElementById('variant-description');

const variantDescriptions = {
  pe: '<strong>Pê (Brasil):</strong> Insere "pê" antes de cada sílaba. Ex: "gato" → "pêga pêto"',
  double: '<strong>Double Talk (Portugal):</strong> Repete a rima de cada sílaba iniciando com "p". Ex: "gato" → "ga-pa-to-po"',
  pvowel: '<strong>P+Vogal:</strong> Insere "P" + vogal da sílaba antes dela. Ex: "gato" → "PagaPato"'
};

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
  const source = sourceLang.value;
  const target = targetLang.value;
  const variant = variantSelect.value;

  if (!text.trim()) {
    outputText.value = '';
    return;
  }

  let result = '';

  if (target === 'lingua-p') {
    switch (variant) {
      case 'pe':
        result = encodePe(text);
        break;
      case 'double':
        result = encodeDoubleTalk(text);
        break;
      case 'pvowel':
        result = encodePVowel(text);
        break;
    }
  } else if (target === 'portugues') {
    switch (variant) {
      case 'pe':
        result = decodePe(text);
        break;
      case 'double':
        result = decodeDoubleTalk(text);
        break;
      case 'pvowel':
        result = decodePVowel(text);
        break;
    }
  }

  outputText.value = result;
}

function updateVariantDescription() {
  variantDesc.innerHTML = variantDescriptions[variantSelect.value];
}

let debounceTimer;
inputText.addEventListener('input', () => {
  inputCount.textContent = inputText.value.length;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(translate, 150);
});

sourceLang.addEventListener('change', translate);
targetLang.addEventListener('change', translate);
variantSelect.addEventListener('change', () => {
  updateVariantDescription();
  translate();
});

copyBtn.addEventListener('click', () => {
  if (outputText.value) {
    navigator.clipboard.writeText(outputText.value).then(() => {
      copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copiado!`;
      setTimeout(() => {
        copyBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copiar`;
      }, 2000);
    });
  }
});

speakBtn.addEventListener('click', () => {
  if (outputText.value && 'speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(outputText.value);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
  }
});

updateVariantDescription();

// ==================== DICIONÁRIO ====================

let currentLetter = null;
let searchQuery = '';

function initDictionary() {
  if (!dictionaryData || !Array.isArray(dictionaryData)) {
    console.error('Dados do dicionário não carregados');
    return;
  }
  
  renderAlphabetIndex();
  renderDictionary();
  setupDictionarySearch();
  updateDictCount(dictionaryData.length);
}

function renderAlphabetIndex() {
  const container = document.getElementById('alphabet-index');
  if (!container) return;
  
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const availableLetters = new Set(
    dictionaryData.map(item => item.word.charAt(0).toUpperCase())
  );
  
  container.innerHTML = letters.map(letter => {
    const hasWords = availableLetters.has(letter);
    return `<button 
      data-letter="${letter}" 
      ${!hasWords ? 'disabled' : ''}
      class="${currentLetter === letter ? 'active' : ''}"
    >${letter}</button>`;
  }).join('');
  
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const letter = btn.dataset.letter;
      if (btn.disabled) return;
      
      if (currentLetter === letter) {
        currentLetter = null;
        document.getElementById('dict-search').value = '';
        searchQuery = '';
      } else {
        currentLetter = letter;
        document.getElementById('dict-search').value = '';
        searchQuery = '';
      }
      
      renderAlphabetIndex();
      renderDictionary();
    });
  });
}

function renderDictionary() {
  const container = document.getElementById('dictionary-content');
  if (!container) return;
  
  let filtered = dictionaryData;
  
  // Filtrar por letra selecionada
  if (currentLetter) {
    filtered = filtered.filter(item => 
      item.word.charAt(0).toUpperCase() === currentLetter
    );
  }
  
  // Filtrar por busca
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(item => 
      item.word.toLowerCase().includes(query) ||
      Object.values(item.translations).some(t => t.toLowerCase().includes(query))
    );
  }
  
  if (filtered.length === 0) {
    container.innerHTML = '<div class="dict-no-results">Nenhuma palavra encontrada.</div>';
    updateDictCount(0);
    return;
  }
  
  updateDictCount(filtered.length);
  
  // Agrupar por letra inicial
  const grouped = {};
  filtered.forEach(item => {
    const firstLetter = item.word.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
      grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(item);
  });
  
  // Ordenar letras
  const sortedLetters = Object.keys(grouped).sort();
  
  container.innerHTML = sortedLetters.map(letter => {
    const words = grouped[letter].sort((a, b) => a.word.localeCompare(b.word));
    
    return `
      <div class="dict-letter-section" id="letter-${letter}">
        <h3 class="dict-letter-header">${letter}</h3>
        <div class="dict-word-list">
          ${words.map(item => createWordCard(item)).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  // Adicionar eventos de clique nos cards
  container.querySelectorAll('.dict-word-card').forEach(card => {
    card.addEventListener('click', () => {
      const word = card.dataset.word;
      inputText.value = word;
      inputCount.textContent = word.length;
      sourceLang.value = 'portugues';
      targetLang.value = 'lingua-p';
      translate();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function createWordCard(item) {
  return `
    <div class="dict-word-card" data-word="${item.word}">
      <div class="dict-word-original">${item.word}</div>
      <div class="dict-word-translations">
        <div class="dict-translation">
          <span class="variant-label">Pê:</span>
          <span class="variant-value">${item.translations.pe}</span>
        </div>
        <div class="dict-translation">
          <span class="variant-label">Double:</span>
          <span class="variant-value">${item.translations.double}</span>
        </div>
        <div class="dict-translation">
          <span class="variant-label">P+Vogal:</span>
          <span class="variant-value">${item.translations.pvowel}</span>
        </div>
      </div>
    </div>
  `;
}

function setupDictionarySearch() {
  const searchInput = document.getElementById('dict-search');
  if (!searchInput) return;
  
  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = searchInput.value.trim();
      currentLetter = null;
      renderAlphabetIndex();
      renderDictionary();
    }, 200);
  });
}

function updateDictCount(count) {
  const countEl = document.getElementById('dict-count');
  if (countEl) {
    countEl.textContent = `${count} palavra${count !== 1 ? 's' : ''} encontrada${count !== 1 ? 's' : ''}`;
  }
}

// Inicializar dicionário quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initDictionary, 100);
});