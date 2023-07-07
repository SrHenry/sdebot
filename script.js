/**
 * @deprecated it uses deprecated escape() function
 * @param {FormData} data
 * @returns {string}
 */
function to__ISO_8859_1__UrlEncoded(data) {
  return [...data].map(([k, v]) => [k, escape(v)].join('=')).join('&');
}

/**
 *
 * @param {string | URL} url
 * @param {FormData | [string, string][] | Iterable<[string, string]>} data
 * @returns {Promise<Response>}
 */
function post__ISO8859_1(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; encoding=iso-8859-1',
    },
    body: to__ISO_8859_1__UrlEncoded(data),
  });
}

/**
 * @param {string} url
 * @returns {Promise<Document>}
 */
async function fetchDocument(url) {
  const response = await fetch(url);
  const html = await response.text();

  return new DOMParser().parseFromString(html, 'text/html');
}

/**
 * @param {string} url
 * @returns {Promise<string[]>}
 */
async function fetchAlunos(url) {
  const root = await fetchDocument(url);

  /** @type {HTMLInputElement[]} */
  const inputs = [
    ...root.querySelectorAll(
      'html > body > .container > div tbody > tr > td:nth-child(4) input',
    ),
  ];
  const alunos = [
    ...new Set(
      inputs.map(td => td.name.replace(/^freq\[(\d+)\]\[(\d+)\]$/, '$2')),
    ),
  ];

  return alunos;
}

/**
 *
 * @param {string[]} urls
 * @returns {Promise<Document[]>}
 */
function fetchTurmas(urls) {
  return Promise.all(urls.map(fetchDocument));
}

/**
 *
 * @param {string} url
 * @param {string} date
 * @param {string?} conteudo
 */
async function prepareContent(url, date, conteudo = '') {
  const q = new URLSearchParams(url.split('?')[1]);
  const alunos = await fetchAlunos(url);
  return {
    url,
    q: [...q.entries()],
    payload: {
      data_chamada: date,
      [`conteudo[${q.get('dd')}]`]: conteudo,
      ...alunos.reduce((o, aluno) => {
        return {
          ...o,
          [`freq[${q.get('dd')}][${aluno}]`]: 'P',
          [`tipoAula[${q.get('dd')}][${aluno}]`]: '7',
        };
      }, {}),
    },
  };
}

/** @typedef {{ url:string, q:[string, string][], payload: Record<'data_chamada'|`conteudo[${number}]`|`freq[${number}][${number}]`|`tipoAula[${number}][${number}]`, string> }} Context */

/**
 * @param {Context}
 * @returns {Promise<Response>}
 */
async function postContent({ url, payload }) {
  return post__ISO8859_1(url, Object.entries(payload));
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
//eslint-disable-next-line no-unused-vars
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @param {string[]} conteudos
 * @param {Document} root
 * @returns {Promise<Context[]>}
 */
async function prepareAllContents(conteudos, root = document) {
  /** @type {Context[]} */
  const allContents = [];

  for (const [i, tr] of root
    .querySelectorAll('html > body > .container tbody > tr')
    .entries() ?? []) {
    const a = tr.querySelector('td > a');
    const _data = tr.querySelectorAll('td')[1];

    if (!a || !_data) throw new Error('_data is null|undefined');

    const url = a.href;
    const data = _data.innerText.replace(
      /^(\d{2})\/(\d{2})\/(\d{4})$/,
      '$3-$2-$1',
    );

    const context = await prepareContent(url, data, conteudos[i]);
    allContents.push(context);
  }

  return allContents;
}

/**
 * @template {Memory} T
 * @param {T} obj
 * @returns {{ by: <K extends keyof T>(...groupKeys: K[]) => Record<keyof T[K], Record<K, T[K][keyof T[K]]>> }}
 */
function group(obj) {
  return {
    /**
     * @param {(keyof T)[]} groupKeys
     */
    by(...groupKeys) {
      /** @type {[keyof T, [keyof T[keyof T], T[keyof T]]][]} */
      const datasets = groupKeys.map(key => [key, Object.entries(obj[key])]);
      /** @type {Record<keyof T[K], Record<K, T[K][keyof T[K]]>>} */
      const result = {};

      datasets.forEach(([groupKey, dataset]) => {
        dataset.forEach(([key, values]) => {
          if (key in result) {
            if (groupKey in result[key]) result[key][groupKey].push(...values);
            else result[key][groupKey] = values;
          } else {
            result[key] = {
              [groupKey]: values,
            };
          }
        });
      });

      return result;
    },
  };
}

/**
 * @param  {...any[]} args
 * @returns {void}
 */
function debug(...args) {
  console.log(...args);
}

/** @typedef {{ conteudos: Record<string, string[]>, turmas: Record<string, string[]> }} Memory */

/** @type {Memory} */
const defaultMemory = {
  conteudos: {
    '2º Ano - 2º Bimestre': [
      'Concordância verbal com o sujeito simples.',
      'Concordância verbal com o sujeito simples.',
      'Concordância verbal - os pronomes relativos "quem" e "cujo" .',
      'Concordância verbal - os pronomes relativos "quem" e "cujo" .',
      'Atividades sobre concordância verbal .',
      'Realismo - Naturalismo : introdução.',
      'Realismo - Naturalismo : contexto histórico .',
      'Produzindo uma introdução argumentativa .',
      'Produzindo uma introdução argumentativa .',
      'Análise de fragmento do livro O cortiço .',
      'Características do Realismo - Naturalismo .',
      'Características do Realismo - Naturalismo .',
      'Estudo do verbo : vozes verbais.',
      'Estudo do verbo : vozes verbais.',
      'Atividades sobre vozes verbais .',
      'Produzindo introdução do texto argumentativo .',
      'Produzindo introdução do texto argumentativo .',
      'Modos verbais .',
      'As fases do romancista Machado de Assis no Realismo.',
      'As fases do romancista Machado de Assis no Realismo.',
      'Atividades sobre modos e vozes verbais .',
      'Atividades de fixação sobre Realismo - Naturalismo .',
      'Atividades de fixação sobre Realismo - Naturalismo .',
      'Análise de fragmento do livro Memórias póstumas de Braz Cubas .',
      'Revisão sobre modos e vozes verbais.',
      'Revisão sobre modos e vozes verbais.',
      'Análise de fragmento da obra O Ateneu de Raul Pompeia.',
      'Produção de texto .',
      'Produção de texto .',
    ],
    '3º Ano - 2º Bimestre': [
      'Novos conceitos de expressão artística.',
      'Neoimpressionismo,Fauvismo,Art nouveau,, Art Déco.',
      'Atividades sobre Neoimpressionismo,Fauvismo,Art nouveau,, Art Déco.',
      'Principais conceitos de arte de vanguarda.',
      'Principais conceitos de arte de vanguarda.',
      'Atividades sobre a arte de vanguarda.',
      'Arte e revolução : quebra de paradigmas.',
      'Arte e revolução : quebra de paradigmas : Dadaísmo,Surrealismo.',
      'Atividades sobre Dadaísmo e Surrealismo.',
      'Revisão sobre novos conceitos de expressão artística e a quebra de paradigmas na Arte.',
    ],
  },
  turmas: {
    '2º Ano - 2º Bimestre': [
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101811&d=5&e=2', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 1
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101812&d=5&e=2', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 2
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101813&d=5&e=2', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 3
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101814&d=5&e=2', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 4
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101823&d=5&e=2', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 13
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101824&d=5&e=2', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 14
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101825&d=5&e=2', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 15
    ],
    '3º Ano - 2º Bimestre': [
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101836&d=8&e=2', // REGULAR - 3EM - M - 3
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101837&d=8&e=2', // REGULAR - 3EM - M - 4
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101838&d=8&e=2', // REGULAR - 3EM - M - 5
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101839&d=8&e=2', // REGULAR - 3EM - M - 6
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101840&d=8&e=2', // REGULAR - 3EM - M - 7
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101841&d=8&e=2', // REGULAR - 3EM - M - 8
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101842&d=8&e=2', // REGULAR - 3EM - M - 9
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101846&d=8&e=2', // REGULAR - 3EM - M - 13
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101847&d=8&e=2', // REGULAR - 3EM - M - 14
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101848&d=8&e=2', // REGULAR - 3EM - M - 15
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101849&d=8&e=2', // REGULAR - 3EM - M - 16
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101850&d=8&e=2', // REGULAR - 3EM - M - 17
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101851&d=8&e=2', // REGULAR - 3EM - M - 18
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101852&d=8&e=2', // REGULAR - 3EM - M - 19
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101853&d=8&e=2', // REGULAR - 3EM - M - 20
    ],
  },
};

/**
 * @param {Memory} memory
 */
//eslint-disable-next-line no-unused-vars
async function run(memory = defaultMemory) {
  debug('[run::Function] >> Starting...');

  /** @type {Response[][]} */
  const responsesGroups = [];

  const bims = group(memory).by('conteudos', 'turmas');

  debug('[run::Function] >> Ready!', { memory, bims });

  for (const [bim, { conteudos, turmas: urls }] of Object.entries(bims)) {
    debug(`[run::Function] >> [bim::const::for (${bim})]`, { conteudos, urls });

    const turmas = await fetchTurmas(urls);
    const preparedContents = await Promise.all(
      turmas.map(turma => prepareAllContents(conteudos, turma)),
    );

    debug(`[run::Function] >> [bim::string::for (${bim})]`, {
      preparedContents,
    });

    const responses = await Promise.all(
      preparedContents.flat().map(postContent),
    );

    debug(`[run::Function] >> [bim::string::for (${bim})]`, {
      responses,
    });

    responsesGroups.push(responses);
  }

  debug('[run::Function]: Finished!');
}
