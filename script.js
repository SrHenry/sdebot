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
    '3bim': [
      'Arte na segunda metade do século XX : Expressionismo abstrato.',
      'Arte na segunda metade do século XX : Neodadaísmo,Hiper-realismo,Pop Art.',
      'Atividades sobre a Arte na segunda metade do século XX.',
      'Atividades sobre a Arte na segunda metade do século XX.',
      'Arte na contemporaneidade : Assemblage, Junk Art, Land Art, Happenig e Performance.',
      'Arte na contemporaneidade : Arte interativa, Neoexpressionismo, Grafite e Arte urbana.',
      'Atividades sobre a Arte na contemporaneidade.',
      'Atividades sobre a Arte na contemporaneidade.',
      'Atividades de revisão sobre Arte na segunda metade do século XX.',
      'Atividades de revisão sobre Arte na segunda metade do século XX.',
    ],
    '4bim': [
      'Arte conceitual : arte povera , arte feminina.Rock dos anos 1980 , o conceitual no teatro e na dança.Rock dos anos 1980 , o conceitual no teatro e na dança.',
      'Atividades sobre a arte conceitual.',
      'Arte e tecnologia : transformações culturais – as influências da tecnologia na arte.',
      'Arte e tecnologia : videoarte , tecnologia nas artes cênicas e na música , a fotografia como expressão artística.',
      'Atividades sobre arte e tecnologia.',
      'Arte e cultura popular no Brasil : Literatura de cordel , o teatro de mamulengos , danças populares , festas tradicionais da cultura brasileira.',
      'Atividades sobre arte e cultura popular.',
      'Arte e tradição : influências culturais na América Latina – a influência na música , a influência na dança e nas artes visuais.',
      'Atividades sobre Arte e tradição : influências culturais na América Latina .',
    ],
  },
  //links
  turmas: {
    '3bim': [
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90562&d=8&e=3', //REGULAR - 3EM - M - 3
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90564&d=8&e=3', //REGULAR - 3EM - M - 4
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90565&d=8&e=3', //REGULAR - 3EM - M - 5
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90566&d=8&e=3', //REGULAR - 3EM - M - 6
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90567&d=8&e=3', //REGULAR - 3EM - T - 7
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90568&d=8&e=3', //REGULAR - 3EM - T - 8
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90569&d=8&e=3', //REGULAR - 3EM - T - 9
      // // 'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90570&d=8&e=3', // //REGULAR - 3EM - T - 10
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90573&d=8&e=3', //REGULAR - 3EM - N - 13
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90574&d=8&e=3', //REGULAR - 3EM - N - 14
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90577&d=8&e=3', //REGULAR - 3EM - N - 15
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90579&d=8&e=3', //REGULAR - 3EM - N - 16
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90580&d=8&e=3', //REGULAR - 3EM - N - 17
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90581&d=8&e=3', //REGULAR - 3EM - N - 18
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90582&d=8&e=3', //REGULAR - 3EM - N - 19
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90583&d=8&e=3', //REGULAR - 3EM - N - 20
    ],
    '4bim': [
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90562&d=8&e=4', //REGULAR - 3EM - M - 3
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90564&d=8&e=4', //REGULAR - 3EM - M - 4
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90565&d=8&e=4', //REGULAR - 3EM - M - 5
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90566&d=8&e=4', //REGULAR - 3EM - M - 6
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90567&d=8&e=4', //REGULAR - 3EM - T - 7
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90568&d=8&e=4', //REGULAR - 3EM - T - 8
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90569&d=8&e=4', //REGULAR - 3EM - T - 9
      // // 'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90570&d=8&e=4', // //REGULAR - 3EM - T - 10
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90573&d=8&e=4', //REGULAR - 3EM - N - 13
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90574&d=8&e=4', //REGULAR - 3EM - N - 14
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90577&d=8&e=4', //REGULAR - 3EM - N - 15
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90579&d=8&e=4', //REGULAR - 3EM - N - 16
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90580&d=8&e=4', //REGULAR - 3EM - N - 17
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90581&d=8&e=4', //REGULAR - 3EM - N - 18
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90582&d=8&e=4', //REGULAR - 3EM - N - 19
      'https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=90583&d=8&e=4', //REGULAR - 3EM - N - 20
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
