# Curso de Node.js
Construção de uma aplicação web utilizando o Node.js, o Express.js e o MongoDB.

## Introdução
Este curso tem por objetivo abordar:
- conceitos básicos de uma API Rest;
- formas de autenticação e gerenciamento de seção de usuários;
- uso de um banco de dados NoSQL (not only SQL);
- plataforma Node.js;
- testes unitários e testes de integração;
- recursos do ECMAScript 6;
- conceitos e comandos básicos para versionamento do código.

Os conteúdos serão apresentados através de um estudo de caso.

## Apresentação do estudo de caso
Deve ser desenvolvida uma API capaz de prover dados para um jogo baseado no universo "star wars".   
Os usuários desta API poderão cadastrar os planetas que estarão disponíveis no jogo.   
A API deve guardar o nome, o clima e o terreno de cada planeta cadastrado. Além destes dados, a API deve ser capaz de obter a quantidade de aparições de um planeta nos filmes da franquia "star wars".   
Para obter os dados dos filmes da franquia "star wars" pode ser utilizada a API:
```
https://swapi.co/
```

## Requisitos do estudo de caso

### Funcionais

- Um usuário deve conseguir se cadastrar no sistema ao prover um nome único e uma senha.
- Um usuário deve estar autenticado para manipular informações dos planetas.
- Um usuário autenticado pode:
	- adicionar um planeta.
	- obeter uma lista dos planetas cadastrados.
	- buscar um planeta pelo seu nome.
	- alterar dados de um planeta.
	- buscar um planeta pelo seu identificador único.
	- remover um planeta.

### Não Funcionais
- A API deve ser REST;
- Um usuário deve ser autenticado a partir do seu nome e da sua senha.
- Para cada planeta, os seguintes dados devem ser obtidos do banco de dados da aplicação:
```
Nome
Clima
Terreno
```
- Para cada planeta é necessário obter a quantidade de aparições em filmes da franquia "star wars" na API https://swapi.co/
- O resultado da lista de planetas deve ser paginado. A paginação deve ser feita a partir dos dados de quantos planetas serão exibidos por página e qual é a página requisitada pelo usuário. Caso estes dados não sejam informados pelo usuário, deve ser exibida a primeira página com o agrupamento de dez em dez planetas.
- A API pode ser consumida por outros sistemas web.

### Regras de negócio

- Um usuário só poderá remover planetas que tenham sido criados por ele.
