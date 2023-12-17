///* Constants:
/**
 * default interval for rate limiting
 */
const INTERVAL = 60_000; //in ms = 1min
/**
 * default interval for queue consumers to sleep when concurrency is maxed out
 */
const CONSUMER_SLEEP_INTERVAL = 1_000; //in ms = 1min
/**
 * default value for rate limiting per interval
 */
const RATE_LIMIT = 5;
/**
 * default concurrency for consuming queue
 */
const CONCURRENCY = 5;

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
 * @param {string[]} urls
 * @param {number} limit
 * @returns {Promise<Document[]>}
 */
async function fetchTurmasWithRateLimit(urls, limit = 1) {
  /** @type {Document[]} */
  const documents = [];
  const startTime = Date.now();
  let count = 0;

  for (let rounds = Math.ceil(urls.length / limit); rounds > 0; rounds--) {
    const batch =
      rounds == 1 ? urls.slice(count) : urls.slice(count, count + limit);

    await Promise.all(batch.map(url => fetchDocument(url))).then(docs => {
      documents.push(...docs);
      count += batch.length;
    });

    const tleft = startTime + INTERVAL - Date.now();

    if (tleft > 0) await sleep(tleft);
  }

  return documents;
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

    if (a === null && tr.querySelectorAll('td > div > a').length === 2) {
      // Already insert, skip row
      continue;
    }

    const _date = tr.querySelectorAll('td')[1];

    if (!a || !_date) throw new Error('_data is null|undefined');

    const url = a.href;
    const date = _date.innerText.replace(
      /^(\d{2})\/(\d{2})\/(\d{4})$/,
      '$3-$2-$1',
    );

    const context = await prepareContent(url, date, conteudos[i]);
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
    '2º Ano - 3º Bimestre': [
      'Parnasianismo - contexto histórico.',
      'Parnasianismo - contexto histórico.',
      'Análise do poema Galateia.',
      'Coerência textual - princípio da não contradição.',
      'Coerência textual - princípio da não tautologia.',
      'Características do Parnasianismo.',
      'Emprego do pronome - pessoais, demonstrativos e relativos.',
      'Emprego do pronome - pessoais, demonstrativos e relativos.',
      'Atividades de fixação sobre o emprego do pronome.',
      'Produção de texto dissertativo - argumentativo.',
      'Produção de texto dissertativo - argumentativo.',
      'Coerência textual - princípio da relevância .',
      'Atividades de fixação sobre coerência textual .',
      'Atividades de fixação sobre coerência textual .',
      'Emprego das conjunções - coordenativas.',
      'Emprego das conjunções - coordenativas.',
      'Atividades de fixação sobre o emprego das conjunções - coordenativas e subordinativas .',
      'Atividades de fixação sobre o emprego das conjunções - coordenativas e subordinativas .',
      'Coesão textual - referencial e sequencial .',
      'Emprego da preposição - essencial , acidental e relações de sentido .',
      'Emprego da preposição - essencial , acidental e relações de sentido .',
      'Atividades de fixação sobre o emprego da preposição.',
      'Autores do Parnasianismo - trajetória de Olavo Bilac e análise do Poema Profissão de fé .',
      'Autores do Parnasianismo - trajetória de Olavo Bilac e análise do Poema Profissão de fé .',
      'Autores do Parnasianismo - Raimundo Correia e Alberto de Oliveira.',
      'Declamação de poesia , pelos alunos , dos poetas parnasianos.',
      'Atividades de fixação sobre Parnasianismo .',
      'Revisão sobre coesão e coerência textuais e emprego do pronome .',
      'Revisão sobre emprego da conjunção, preposição e Parnasianismo.',
      'Revisão sobre emprego da conjunção, preposição e Parnasianismo.',
    ],
    '2º Ano - 4º bim': [
      'Simbolismo - contexto histórico .',
      'Simbolismo - contexto histórico .',
      'Período composto por coordenação - orações coordenadas sindéticas e assindéticas .',
      'Período composto por coordenação - orações coordenadas sindéticas e assindéticas .',
      'Período composto por coordenação - orações coordenadas sindéticas e assindéticas .',
      'Atividades de fixação sobre orações coordenadas.',
      'Atividades de fixação sobre orações coordenadas.',
      'Produção de texto dissertativo- argumentativo .',
      'Produção de texto dissertativo- argumentativo .',
      'Repertório sociocultural na produção textual.',
      'Período composto por subordinação - orações adjetivas .',
      'Período composto por subordinação - orações adjetivas .',
      'Análise do poema Antífona de Cruz e Sousa .',
      'Simbolismo - características .',
      'Simbolismo - características .',
      'Atividades de fixação sobre Simbolismo .',
      'Período composto por subordinação - orações substantivas .',
      'Período composto por subordinação - orações substantivas .',
      'Atividades de fixação sobre repertório sociocultural .',
      'Youtubers e influenciadores mirins : quando a diversão vira trabalho infantil - análise e debate sobre o texto .',
      'Youtubers e influenciadores mirins : quando a diversão vira trabalho infantil - análise e debate sobre o texto .',
      'Atividade de fixação sobre orações subordinadas substantivas.',
      'Atividade de fixação sobre orações subordinadas substantivas.',
      'Características da produção literária de Cruz e Sousa.',
      'Análise do soneto Vida obscura de Cruz e Sousa.',
      'Características da produção literária de Alphonsus de Guimarães.',
      'Período composto por subordinação - orações adverbiais.',
      'Atividades de fixação sobre orações subordinadas adverbiais.',
      'Atividades de fixação sobre orações subordinadas adverbiais.',
      'Revisão sobre Simbolismo.',
      'Revisão sobre período composto por subordinação e coordenação.',
      'Revisão sobre período composto por subordinação e coordenação',
    ],
    '3º Ano - 3º Bimestre': [
      'A arte povera.',
      'Atividades sobre a arte povera.',
      'A arte feminina .',
      'Rock nos anos 1980.',
      'O conceitual no teatro e na dança.',
      'Atividades sobre arte conceitual.',
      'Arte e tecnologia - Transformações culturais: as influências da tecnologia na arte.',
      'Vídeoarte, tecnologias nas artes cênicas e na música ,a fotografia como expressão artística.',
      'Atividades sobre arte conceitual e arte e tecnologia .',
    ],
    '3º Ano - 4º Bimestre': [
      'Arte e cultura popular no Brasil : literatura de cordel.',
      'Arte e cultura popular no Brasil : o teatro de mamulengos .',
      'Arte e cultura popular no Brasil : danças populares .',
      'Arte e cultura popular no Brasil : festas tradicionais da cultura brasileira.',
      'Arte e cultura popular no Brasil - atividades de fixação .',
      'Arte e cultura popular no Brasil - atividades de fixação .',
      'Arte e tradição : influências culturais na América Latina.',
      'Arte e tradição : as culturas indígena,europeia e africana e suas influências nas artes latino-americanas.',
      'Arte e tradição : a influência na música,na dança e nas artes visuais.',
      'Atividades sobre arte e tradição na América Latina.',
    ],
  },
  turmas: {
    '2º Ano - 3º Bimestre': [
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101812&d=5&e=3', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 2
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101813&d=5&e=3', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 3
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101814&d=5&e=3', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 4
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101823&d=5&e=3', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 13
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101824&d=5&e=3', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 14
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101825&d=5&e=3', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 15
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101826&d=5&e=3', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 16
    ],
    '2º Ano - 4º bim': [
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101812&d=5&e=4', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 2
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101813&d=5&e=4', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 3
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101814&d=5&e=4', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 4
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101823&d=5&e=4', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 13
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101824&d=5&e=4', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 14
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101825&d=5&e=4', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 15
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101826&d=5&e=4', //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 16
    ],
    '3º Ano - 3º Bimestre': [
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101836&d=8&e=3', // REGULAR - 3EM - M - 3
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101837&d=8&e=3', // REGULAR - 3EM - M - 4
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101838&d=8&e=3', // REGULAR - 3EM - M - 5
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101839&d=8&e=3', // REGULAR - 3EM - M - 6
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101840&d=8&e=3', // REGULAR - 3EM - M - 7
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101841&d=8&e=3', // REGULAR - 3EM - M - 8
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101842&d=8&e=3', // REGULAR - 3EM - M - 9
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101846&d=8&e=3', // REGULAR - 3EM - M - 13
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101847&d=8&e=3', // REGULAR - 3EM - M - 14
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101848&d=8&e=3', // REGULAR - 3EM - M - 15
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101849&d=8&e=3', // REGULAR - 3EM - M - 16
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101850&d=8&e=3', // REGULAR - 3EM - M - 17
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101851&d=8&e=3', // REGULAR - 3EM - M - 18
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101852&d=8&e=3', // REGULAR - 3EM - M - 19
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101853&d=8&e=3', // REGULAR - 3EM - M - 20
    ],
    '3º Ano - 4º Bimestre': [
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101837&d=8&e=4', // REGULAR - 3EM - M - 4
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101838&d=8&e=4', // REGULAR - 3EM - M - 5
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101839&d=8&e=4', // REGULAR - 3EM - M - 6
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101840&d=8&e=4', // REGULAR - 3EM - M - 7
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101841&d=8&e=4', // REGULAR - 3EM - M - 8
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101842&d=8&e=4', // REGULAR - 3EM - M - 9
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101846&d=8&e=4', // REGULAR - 3EM - M - 13
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101847&d=8&e=4', // REGULAR - 3EM - M - 14
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101848&d=8&e=4', // REGULAR - 3EM - M - 15
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101849&d=8&e=4', // REGULAR - 3EM - M - 16
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101850&d=8&e=4', // REGULAR - 3EM - M - 17
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101851&d=8&e=4', // REGULAR - 3EM - M - 18
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101852&d=8&e=4', // REGULAR - 3EM - M - 19
      'https://rubi.seduc.ro.gov.br/professor/frequencia_busca.php?t=101853&d=8&e=4', // REGULAR - 3EM - M - 20
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

/**
 * @template T
 */
class Queue {
  /**
   * @param {T[]} items
   */
  constructor(items = []) {
    /**
     * @type {T[]}
     */
    this.items = items;
  }

  /**
   * @param  {...T} elements
   */
  enqueue(...elements) {
    this.items.push(...elements);
  }

  dequeue() {
    if (this.isEmpty()) return;

    return this.items.shift();
  }

  front() {
    if (this.isEmpty()) return;

    return this.items[0];
  }

  isEmpty() {
    return this.items.length == 0;
  }

  get size() {
    return this.items.length;
  }
}

/**
 * @typedef {{ queue: Queue<T>, concurrency: number, execute(): Promise<void> }} IWorker<T>
 * @template T
 */

/**
 * @implements {IWorker<Context>}
 */
class Consumer {
  /**
   * @param {Queue<Context>} queue
   */
  constructor(queue, concurrency = 1) {
    /** @type {Queue<Context>} */
    this.queue = queue;
    /**
     * Number of consumed queue items per step
     * @type {number}
     */
    this.concurrency = concurrency;

    /** @type {Map<number, Promise>} */
    this.ongoing = new Map();
  }
  /**
   * @override
   * @returns {Promise<Response[]>}
   */
  async execute() {
    /** @type {Response[]} */
    const responses = [];
    let count = 0;

    while (this.queue.size > 0) {
      if (this.ongoing < this.concurrency) {
        /** @type {Context} */
        const item = this.queue.dequeue();

        this.ongoing.set(
          count,
          postContent(item).then(res => {
            responses.push(res);
            this.ongoing.delete(count);
          }),
        );
        count++;
        continue;
      }

      await sleep(CONSUMER_SLEEP_INTERVAL);
    }

    return responses;
  }

  /**
   * @param {Queue<Context>} queue
   * @param {number} concurrency
   */
  static execute(queue, concurrency = 1) {
    return new Consumer(queue, concurrency).execute();
  }
}

/**
 * @param {Memory} memory
 */
//eslint-disable-next-line no-unused-vars
async function runWithQueue(
  memory = defaultMemory,
  rateLimit = RATE_LIMIT,
  concurrency = CONCURRENCY,
) {
  debug('[runWithQueue::Function] >> Starting...');

  /** @type {Response[][]} */
  const responsesGroups = [];

  const bims = group(memory).by('conteudos', 'turmas');

  debug('[runWithQueue::Function] >> Ready!', { memory, bims });

  for (const [bim, { conteudos, turmas: urls }] of Object.entries(bims)) {
    debug(`[runWithQueue::Function] >> [bim::const::for (${bim})]`, {
      conteudos,
      urls,
    });

    const turmas = await fetchTurmasWithRateLimit(urls, rateLimit);
    const preparedContents = await Promise.all(
      turmas.map(turma => prepareAllContents(conteudos, turma)),
    );

    debug(`[runWithQueue::Function] >> [bim::string::for (${bim})]`, {
      preparedContents,
    });

    const queue = new Queue(preparedContents.flat());
    const responses = await Consumer.execute(queue, concurrency);

    debug(`[runWithQueue::Function] >> [bim::string::for (${bim})]`, {
      responses,
    });

    responsesGroups.push(responses);
  }

  debug('[runWithQueue::Function]: Finished!');
}
