[diario_href]: https://diario.seduc.ro.gov.br

# [Diário Eletrônico - SEDUC][diario_href]

## Instruções

1. Codificar na memória do script as informações necessárias (conteúdos e turmas)

   Modelo de exemplo:

    ```json
        {
          "conteudos": {
            "1bim": [
              "Apresentação perante os estudantes da ementa de 2023. introdução à morfologia - as dez classes de palavras.",
              "Estudo do substantivo - classificação e formação.",
              "Flexão de gênero do substantivo.",
              "Atividades sobre formação e classificação do substantivo.",
              "Introdução ao texto dissertativo-argumentativo.",
              "Competências da matriz de correção das redações do Enem.",
              "Flexão de número do substantivo.",
              "Atividades sobre gênero e número dos substantivos.",
              "Atividades sobre gênero e número dos substantivos.",
              "Romantismo - contexto histórico.",
              "Romantismo - características.",
              "Romantismo - características.",
              "Flexão de grau dos substantivos,",
              "Produção de texto dissertativo-argumentativo.",
              "Produção de texto dissertativo-argumentativo.",
              "Romantismo no Brasil - as gerações românticas : estudo da primeira geração.",
              "As gerações românticas : estudo da segunda e terceira gerações.",
              "As gerações românticas : estudo da segunda e terceira gerações.",
              "Estudo do adjetivo - classificação e flexão de gênero e número.",
              "Estudo do grau do adjetivo - exercícios.",
              "Estudo do grau do adjetivo - exercícios.",
              "A prosa romântica no Brasil - os tipos de romances.",
              "Os romances de José de Alencar.",
              "Estudo do numeral.",
              "Atividades sobre numeral e adjetivo.",
              "Estudo do artigo.",
              "Estudo do artigo.",
              "Atividades de revisão sobre substantivo,adjetivo,artigo e numeral.",
              "Atividades de revisão sobre Romantismo.",
              "Atividades de revisão sobre Romantismo."
            ]
          },
          "turmas": {
            "1bim": [
              "https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101811&d=5&e=1", //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 1
              "https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101812&d=5&e=1", //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 2
              "https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101813&d=5&e=1", //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 3
              "https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101823&d=5&e=1", //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 13
              "https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101824&d=5&e=1", //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 14
              "https://diario.seduc.ro.gov.br/professor/frequencia_busca.php?t=101825&d=5&e=1" //ENSINO MÉDIO REGULAR CH AMPLIADA - 2EM - CH ESTENDIDA - M - 15
            ]
          }
        }
    ```

    > 1. Para obter os links das turmas, basta selecionar as turmas desejadas, uma por vez.
    > 2. Enquanto selecionada uma turma, copie o link da barra de URL do navegador.
    >
    > <img src="./assets/img/Captura%20de%20tela%202023-05-17%20063313.png" />

2. Atualizar a memória no script, copiando e colando do arquivo JSON/JSONC para o script, na variável [`defaultMemory`](/script.js?plain=1#L186)
3. Copiar o script para o console do navegador, na página do [**Diário Eletrônico - SEDUC**](diario_href) (certifique-se de que está logado **ANTES** de executar estes passos, com um login fresco/recente).
4. Executar o script no console, escrevendo a seguinte linha:

    ```js
    await run()
    ```

5. Aguardar a execução do script finalizar, onde o console emitirá a mensagem `[run::Function]: Finished!`
