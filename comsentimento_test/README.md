# Projeto COMSENTIMENTO_TEST - @Author Carlos Eduardo <carllosmattos@yahoo.com>

Este projeto foi gerado com  [nestjs](https://nestjs.com/) versão 8.0.0,

# Projetos desenvolvidos

## Back-End com nest.js
Rode ```npm run start:dev``` para pode acessar o servidor de desenvolvimento. A Api de do projeto contendo CRUD de usuários e Editais estará disponível para acesso pelo front-end. A documentação da Api estará disponível quando o servidor estiver rodando e a acessível no link [API_COMSENTIMENTO_DOC](http://localhost:3000/api/#/default/).

## Ambiente na maquina local
para que este projeto funcione na sua maquina primeiro você vai precisar de algumas ferramentas instaladas em usa maquina
- 1º [nestjs](https://nestjs.com/) qualquer versão acima da V8.0.0 rode o comando ```npm i -g @nestjs/cli```
- 2º Rode o comando ```npm install```
- 3º [postgress](https://www.postgresql.org/) para banco de dados.

## IMPORTANTE Configuração da base de dados
Antes de iniciar qualquer ambiente sejá ele `LOCAL` deve ser criado uma base de dados no [postgress](https://www.postgresql.org/) para ambiente de DEV.

Database Name             | User Database     | Password Database
--------------------------|-------------------|------------------
comsentimento_db          |    `postgres`     | postgres
