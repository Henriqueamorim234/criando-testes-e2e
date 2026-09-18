- Contexto, Ação, Resultado esperado 

## CADASTRAR UM AUTOR

Rota: (POST) /autores 

Cenários:

- Retorna o autor cadastrato quando os dados são validos (201).

- Retorna um erro ao tentar cadastrar um autor com dados invalidos (400).

## RECUPERAR UM AUTOR

Rota: (GET) /autores/:id

Cenários:

- Retornar os dados do autor existente (201).

- Retorna um erro quando o autor não exista (400).

## LISTAR AUTORES

Rota: (GET) /autores

- Retorna a lista de autores quando tem pelo menos um cadastrado (200).

- retorna uma lista vazia quando não tem autores (200).