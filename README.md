
# pass.in
O pass.in é uma aplicação de gestão de participantes em eventos presenciais.

A ferramenta permite que o organizador cadastre um evento e abra uma página pública de inscrição.

Os participantes inscritos podem emitir uma credencial para check-in no dia do evento.

O sistema fará um scan da credencial do participante para permitir a entrada no evento.


## Requisitos

### Requisitos Funcionais

- [x] O organizador deve poder cadastrar um novo evento;
- [x] O organizador deve poder visualizar dados de um evento;
- [x] O organizador deve poser visualizar a lista de participantes; 
- [x] O participante deve poder se inscrever em um evento;
- [x] O participante deve poder visualizar seu crachá de inscrição;
- [x] O participante deve poder realizar check-in no evento;

### Regras de negócio

- [x] O participante só pode se inscrever em um evento uma única vez;
- [x] O participante só pode se inscrever em eventos com vagas disponíveis;
- [x] O participante só pode realizar check-in em um evento uma única vez;

### Requisitos não-funcionais

- [x] O check-in no evento será realizado através de um QRCode;

## Documentação da API (Swagger)

Para documentação da API, acesse: https://nlw-unite-node-js.onrender.com/documentation


## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`API_KEY`

`ANOTHER_API_KEY`


## Instalação

### Primeiro passo
Abra o projeto em seu vscode e use

```bash
  npm install
```

### Segundo passo
Crie um arquivo `.env` na raiz e compiei as variaveis ambiente de `.env.example`.

### Terceiro passo
Apos a instalação dos pacotes inicie o banco de dados(docker)

```bash
  docker compose up
```

### Quarto passo
Rode as migration do banco de dados

```bash
  npm run db:migrate
```

Alimente o banco de dados com

```bash
  npx prisma db seed
```
E para visualizar a UI do banco de dados use

```bash
  npm run db:studio
```
