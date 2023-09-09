# goods-keeper
Aplicação que carrega produtos através de CSV.
O projeto foi feito com React e Express no Backend.

## Testes
Você pode testar a aplicação pelo Insomnia com o pacote de requisições que disponibilizei na pasta do Backend.

## Variáveis de Ambiente

Para conectar o Backend ao Banco, vc precisa adicionar um arquivo .env com as seguintes variáveis de ambiente.


```
DATABASE_URL="mysql://root:@localhost:3306/<nome_do_banco>"
PORT=5000
```

O ORM utilizado junto ao Node foi o Prisma. Qualquer dúvida sobre o Prisma, acessar documentação:
[Prisma Documentation](https://www.prisma.io/docs/getting-started)

## Execução
Para executar um projeto Node, primeiro precisamos na pasta do projeto executar ```npm i```
 e em seguida ```npm run dev```. Se estiver tudo configurado como deveria, o aplicativo entrará em execução.
 
