// Importando o pacote mysql2
const mysql = require('mysql2');

// Criando a conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'junction.proxy.rlwy.net',
  user: 'root',
  password: 'dboxlaBOdqvPZJBUgWjwlGMUjWymfRcg',
  port: 21513,
  database: 'railway'
});

// Conectando ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados como id ' + connection.threadId);
});

module.exports = connection;
