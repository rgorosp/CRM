import mysql from "mysql2/promise";

/*
  Conexão com o MySQL do CRM.

  Os dados vêm do arquivo .env — nenhuma senha fica escrita aqui.
  O Next.js lê o .env sozinho e entrega os valores em process.env.

  Usamos um "pool": em vez de abrir e fechar uma conexão a cada consulta
  (que é lento), o pool mantém algumas conexões prontas e as empresta
  conforme a necessidade.
*/

function criarPool() {
  return mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORTA),
    user: process.env.MYSQL_USUARIO,
    password: process.env.MYSQL_SENHA,
    database: process.env.MYSQL_BANCO,
    waitForConnections: true,
    connectionLimit: 5,
  });
}

/*
  Durante o desenvolvimento, o Next.js recarrega os arquivos a cada
  alteração. Sem a linha abaixo, um pool novo seria criado a cada
  recarga e as conexões antigas ficariam abertas à toa no banco.
  Guardando o pool em globalThis, ele é criado uma vez só.
*/
const pool = globalThis.poolMysql ?? criarPool();
globalThis.poolMysql = pool;

export default pool;
