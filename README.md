# SDEBot

[old_diario_href_1]: https://diario.seduc.ro.gov.br
[old_diario_href_2]: https://rubi.seduc.ro.gov.br
[diario_href]: https://sde.seduc.ro.gov.br
[31d01c]: https://github.com/SrHenry/leovincey/tree/31d01c61f5be6ba120234bd569575cf41e171cf3
[seduc_contact]: https://www.instagram.com/seduc.ro

Este projeto é uma ferramenta para automatizar e agilizar processos realizados no [**Diário Eletrônico**][diario_href] da [SEDUC/RO][seduc_contact]. O objetivo é facilitar o trabalho dos professores
e servidores da educação, permitindo que eles se concentrem em tarefas mais importantes, enquanto a automação cuida de tarefas repetitivas.

Atualmente, o projeto é capaz de realizar as seguintes tarefas:

- **Publicar conteúdos**: Permite que os professores publiquem conteúdos de forma rápida e eficiente, sem precisar inserir cada conteúdo no Diário Eletrônico manualmente um por vez.
Este modo é o modo padrão do script gerado pelo SDEBot, e ele além de publicar os conteúdos pode inserir a frequência dos alunos, mas esta funcionalidade não é suportada no momento, o que faz com que
todos os dias lançados com conteúdo conste presença para todos os alunos de cada turma.
O motivo de a frequência ainda não ser suportada se dá pelo fato de que este projeto foi sesenvolvido durante a Pandemia de COVID-19, onde os professores eram orientados a não lançar faltas no Diário Eletrônico.
Caso seja necessário, o projeto pode ser adaptado para suportar a frequência dos alunos, mas isso não é uma prioridade no momento.

Devido à natureza do projeto, ele pode ser utilizado para automatizar outras tarefas que não estão listadas aqui, desde que sejam compatíveis com o Diário Eletrônico.
Caso queira sugerir novas funcionalidades ou melhorias, fique à vontade para abrir uma *issue* ou enviar um *pull request*.

O projeto é desenvolvido em *TypeScript* e utiliza o framework [Node.js](https://nodejs.org/) para o desenvolvimento do código.
Ele também utiliza o [Yarn](https://yarnpkg.com/) como gerenciador de pacotes e o [Webpack](https://webpack.js.org/) para empacotar o código.
Para o usuário final, o projeto é disponibilizado como um script JavaScript que pode ser copiado e executado diretamente no console do navegador.
Para obter o script executável no navegador, basta seguir as [instruções](#instruções) abaixo.

> ## **Avisos**
>
> - **`24/04/2024`:**
> O endereço do Diário Eletrônico da SEDUC mudou de [**rubi**.seduc.ro.gov.br][old_diario_href_2] para [**sde**.seduc.ro.gov.br][diario_href].
>
> - **`15/01/2024`:**
> O projeto sofreu mudanças estruturais e logisticas significativas, com novas dependências. Caso deseje usar o modo standalone (sem dependências), acesse uma revisão anterior [aqui (`31d01c`)][31d01c]
>
> - **`16/12/2023`:**
> O endereço do Diário Eletrônico da SEDUC mudou de [**diario**.seduc.ro.gov.br][old_diario_href_1] para [**rubi**.seduc.ro.gov.br][diario_href] devido à instabilidades.
>

## Sumário

- [SDEBot](#sdebot)
  - [Sumário](#sumário)
  - [Requisitos e Dependências Externas](#requisitos-e-dependências-externas)
  - [Instruções](#instruções)
    - [Usando Docker](#usando-docker)
    - [Usando Node.js + Yarn](#usando-nodejs--yarn)
  - [Contribuições](#contribuições)

## Requisitos e Dependências Externas

Você tem duas opções de dependências para executar o projeto:

- `Docker` versão 4.0.0 ou superior (recomendado que seja a versão mais recente)

Ou

- `Node.js` versão 18.0.0 ou superior (recomendado que seja a versão mais recente)
- `Yarn` versão 1.22.0 ou superior (recomendado que seja a versão mais recente)

> Caso você não seja um desenvolvedor, recomendo que você apenas instale o Docker e siga as instruções, sendo a opção mais simples.
> Para instalar o Docker, siga as instruções disponíveis em [Docker](https://docs.docker.com/get-docker/).
>
> Caso já seja um desenvolvedor, pode escolher quaisquer das opções de ambiente, o que julgar melhor para você.

## Instruções

### Usando Docker

1. Inicialize o projeto, caso seja a primeira vez o utilizando. Para inicializar o projeto, basta usar o seguinte comando:

    No Linux/UNIX/MacOS:

    ```sh
    ./run yarn
    ```

    No Windows:

    ```sh
    .\run.ps1 yarn
    ```

    > Caso não tenha permissão para executar o script `run.ps1`, execute o seguinte comando no PowerShell:
    >
    > ```sh
    > Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser
    > ```
    >
    > Caso não queira alterar suas políticas de execução, você pode desbloquear o script `run.ps1` sem alterar as políticas através do seguinte comando:
    >
    > ```sh
    > Unblock-File -Path .\run.ps1
    > ```
    >
    > Após isso, execute o comando `run.ps1` novamente.

2. Uma vez inicializado, o arquivo [`.env`](/.env) deve aparecer na raiz do projeto, com algumas configurações padrão. Sinta-se à vontade para ajustar de acordo com o uso.

3. Crie seus arquivos de memória no formato *CommonJS*, *JSON* ou *JSONC* contendo as informações necessárias (conteúdos e turmas), como exemplificado no arquivo [`memory-example.jsonc`](/data/memory-example.jsonc).

    > 1. Para obter os links das turmas, basta selecionar as turmas desejadas, uma por vez.
    > 2. Enquanto selecionada uma turma, copie o link da barra de URL do navegador.
    >
    > <img src="./assets/img/Captura%20de%20tela%202023-05-17.png" alt="Ilustração dos passos 1 e 2 acima"/>

4. (Opcional) Caso queira obter os conteudos já preenchidos em uma turma específica (modelo), basta colocar o link da página de conteudos da turma na seção de conteudos do arquivo de memória, como exemplificado no arquivo [`memory-example.jsonc`](/data/memory-example.jsonc?plain=1#L36,17).

    > 1. Para obter o link dos conteudos, basta selecionar a turma/disciplina e o bimestre desejados.
    > 2. Após preencher os campos de busca, copie o link da barra de URL do navegador.
    >
    > <img src="./assets/img/Captura%20de%20tela%202025-10-22%20011526.png" alt="Ilustração do passo 1 acima"/>
    > <img src="./assets/img/Captura%20de%20tela%202025-10-22%20011205.png" alt="Ilustração do passo 2 acima"/>

5. Atualize a memória no script, incluindo na variável de ambiente [`MEMORY_DATA_PATHS`](/.env.example?plain=1#L1,19) os nomes dos arquivos de memória que serão utilizados.

6. Defina o modo de execução do script na variável de ambiente [`MODE`](/.env.example?plain=1#L2,6). Escolha entre os seguintes modos:
    > - **`normal`:** Modo normal, recomendado quando o diário eletrônico estiver com alta disponibilidade ou sem limitação de consumo.
    > - **`queued`:** Modo econômico, recomendado quando necessitar de uma versão baseada em fila e limite de consumo de API, quando o Diário Eletrônico estiver instável/lento
    (É possível configurar os intervalos e limites do algoritmo através de variáveis de ambiente, no arquivo [`.env`](/.env.example?plain=1#L1))

7. Publique a automação usando o seguinte comando:

    No Linux/UNIX/MacOS:

    ```sh
    ./run yarn build
    ```

    No Windows:

    ```sh
    .\run.ps1 yarn build
    ```

    O script de automação deve aparecer no caminho [`dist/.webpack/script.js`](/dist/.webpack/script.js)

8. Copie o script para o console do navegador, na página do [**Diário Eletrônico - SEDUC**](diario_href).
    O script iniciará automaticamente assim que colado no console do navegador
    (certifique-se de que está logado **ANTES** de executar estes passos, com um login fresco/recente).

9. Aguardar a execução do script finalizar, onde o console emitirá a mensagem `[run::Function]: Finished!` (Ou `[runWithQueue::Function]: Finished!`)

### Usando Node.js + Yarn

1. Inicialize o projeto, caso seja a primeira vez o utilizando. Para inicializar o projeto, basta usar o comando:

    ```sh
    yarn
    ```

2. Uma vez inicializado, o arquivo [`.env`](/.env) deve aparecer na raiz do projeto, com algumas configurações padrão. Sinta-se à vontade para ajustar de acordo com o uso.

3. Crie seus arquivos de memória no formato *CommonJS*, *JSON* ou *JSONC* contendo as informações necessárias (conteúdos e turmas), como exemplificado no arquivo [`memory-example.jsonc`](/data/memory-example.jsonc).

    > 1. Para obter os links das turmas, basta selecionar as turmas desejadas, uma por vez.
    > 2. Enquanto selecionada uma turma, copie o link da barra de URL do navegador.
    >
    > <img src="./assets/img/Captura%20de%20tela%202023-05-17.png" alt="Ilustração dos passos 1 e 2 acima"/>

4. (Opcional) Caso queira obter os conteudos já preenchidos em uma turma específica (modelo), basta colocar o link da página de conteudos da turma na seção de conteudos do arquivo de memória, como exemplificado no arquivo [`memory-example.jsonc`](/data/memory-example.jsonc?plain=1#L36,17).

    > 1. Para obter o link dos conteudos, basta selecionar a turma/disciplina e o bimestre desejados.
    > 2. Após preencher os campos de busca, copie o link da barra de URL do navegador.
    >
    > <img src="./assets/img/Captura%20de%20tela%202025-10-22%20011526.png" alt="Ilustração do passo 1 acima"/>
    > <img src="./assets/img/Captura%20de%20tela%202025-10-22%20011205.png" alt="Ilustração do passo 2 acima"/>

5. Atualize a memória no script, incluindo na variável de ambiente [`MEMORY_DATA_PATHS`](/.env.example?plain=1#L1,19) os nomes dos arquivos de memória que serão utilizados.

6. Defina o modo de execução do script na variável de ambiente [`MODE`](/.env.example?plain=1#L2,6). Escolha entre os seguintes modos:
    > - **`normal`:** Modo normal, recomendado quando o diário eletrônico estiver com alta disponibilidade ou sem limitação de consumo.
    > - **`queued`:** Modo econômico, recomendado quando necessitar de uma versão baseada em fila e limite de consumo de API, quando o Diário Eletrônico estiver instável/lento
    (É possível configurar os intervalos e limites do algoritmo através de variáveis de ambiente, no arquivo [`.env`](/.env.example?plain=1#L1))

7. Publique a automação usando o seguinte comando:

    ```sh
    yarn build
    ```

    O script de automação deve aparecer no caminho [`dist/.webpack/script.js`](/dist/.webpack/script.js)

8. Copie o script para o console do navegador, na página do [**Diário Eletrônico - SEDUC**](diario_href).
    O script iniciará automaticamente assim que colado no console do navegador
    (certifique-se de que está logado **ANTES** de executar estes passos, com um login fresco/recente).

9. Aguardar a execução do script finalizar, onde o console emitirá a mensagem `[run::Function]: Finished!` (Ou `[runWithQueue::Function]: Finished!`)

## Contribuições

Caso queira contribuir com o projeto, veja o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para mais informações.
