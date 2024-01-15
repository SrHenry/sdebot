[old_diario_href]: https://diario.seduc.ro.gov.br
[diario_href]: https://rubi.seduc.ro.gov.br
[31d01c]: https://github.com/SrHenry/leovincey/tree/31d01c61f5be6ba120234bd569575cf41e171cf3

# [Diário Eletrônico - SEDUC][diario_href]

> ## **Avisos**
>
> - **`15/01/2024`:**
> O projeto sofreu mudanças estruturais e logisticas significativas, com novas dependências. Caso deseje usar o modo standalone (sem dependências), acesse uma revisão anterior [aqui (`31d01c`)][31d01c]
>
> - **`16/12/2023`:**
> O endereço do Diário Eletrônico da SEDUC mudou de [**diario**.seduc.ro.gov.br][old_diario_href] para [**rubi**.seduc.ro.gov.br][diario_href] devido à instabilidades.
>

## Instruções

1. Inicialize o projeto, caso seja a primeira vez o utilizando. Para inicializar o projeto, basta usar o comando:

    ```sh
    yarn
    ```

2. Uma vez inicializado, o arquivo [`.env`](/.env) deve aparecer na raiz do projeto, com algumas configurações padrão. Sinta-se à vontade para ajustar de acordo com o uso.

3. Crie seus arquivos de memória no formato *CommonJS*, *JSON* ou *JSONC* contendo as informações necessárias (conteúdos e turmas), como exemplificado no arquivo [`memory-example.jsonc`](/data/memory-example.jsonc).

    > 1. Para obter os links das turmas, basta selecionar as turmas desejadas, uma por vez.
    > 2. Enquanto selecionada uma turma, copie o link da barra de URL do navegador.
    >
    > <img src="./assets/img/Captura%20de%20tela%202023-05-17%20063313.png" alt="Ilustração dos passos 1 e 2 acima"/>

4. Atualize a memória no script, incluindo na variável de ambiente [`MEMORY_DATA_PATHS`](/.env?plain=1) os nomes dos arquivos de memória que serão utilizados.

5. Defina o modo de execução do script na variável de ambiente [`MODE`](/.env?plain=1). Escolha entre os seguintes modos:
    > - **`normal`:** Modo normal, recomendado quando o diário eletrônico estiver com alta disponibilidade ou sem limitação de consumo.
    > - **`queued`:** Modo econômico, recomendado quando necessitar de uma versão baseada em fila e limite de consumo de API, quando o Diário Eletrônico estiver instável/lento
    (É possível configurar os intervalos e limites do algoritmo através de variáveis de ambiente, no arquivo [`.env`](/.env?plain=1#L1))

6. Publique a automação usando o seguinte comando:

    ```sh
    yarn webpack
    ```

    O script de automação deve aparecer no caminho [`dist/script.js`](/dist/script.js)

7. Copie o script para o console do navegador, na página do [**Diário Eletrônico - SEDUC**](diario_href).
    O script iniciará automaticamente assim que colado no console do navegador
    (certifique-se de que está logado **ANTES** de executar estes passos, com um login fresco/recente).

8. Aguardar a execução do script finalizar, onde o console emitirá a mensagem `[run::Function]: Finished!` (Ou `[runWithQueue::Function]: Finished!`)
