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
    '1bim': [
      'Apresentação perante os estudantes da ementa de 2023. introdução à morfologia - as dez classes de palavras.',
      'Estudo do substantivo - classificação e formação.',
      'Flexão de gênero do substantivo.',
      'Atividades sobre formação e classificação do substantivo.',
      'Introdução ao texto dissertativo-argumentativo.',
      'Competências da matriz de correção das redações do Enem.',
      'Flexão de número do substantivo.',
      'Atividades sobre gênero e número dos substantivos.',
      'Atividades sobre gênero e número dos substantivos.',
      'Romantismo - contexto histórico.',
      'Romantismo - características.',
      'Romantismo - características.',
      'Flexão de grau dos substantivos,',
      'Produção de texto dissertativo-argumentativo.',
      'Produção de texto dissertativo-argumentativo.',
      'Romantismo no Brasil - as gerações românticas : estudo da primeira geração.',
      'As gerações românticas : estudo da segunda e terceira gerações.',
      'As gerações românticas : estudo da segunda e terceira gerações.',
      'Estudo do adjetivo - classificação e flexão de gênero e número.',
      'Estudo do grau do adjetivo - exercícios.',
      'Estudo do grau do adjetivo - exercícios.',
      'A prosa romântica no Brasil - os tipos de romances.',
      'Os romances de José de Alencar.',
      'Estudo do numeral.',
      'Atividades sobre numeral e adjetivo.',
      'Estudo do artigo.',
      'Estudo do artigo.',
      'Atividades de revisão sobre substantivo,adjetivo,artigo e numeral.',
      'Atividades de revisão sobre Romantismo.',
      'Atividades de revisão sobre Romantismo.',
    ],
  },
  turmas: {
    '1bim': [
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101811&d=5&e=1', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 1
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101812&d=5&e=1', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 2
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101813&d=5&e=1', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 3
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101823&d=5&e=1', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 13
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101824&d=5&e=1', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 14
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101825&d=5&e=1', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 15
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
