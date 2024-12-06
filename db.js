const mysql = require('mysql2');

// URL de conexão
const connectionUrl = 'mysql://uw8nxi3fdm71p32w:2rIJBPJtNCgxpIAFFddF@busosxfqfojtq6k8bwx5-mysql.services.clever-cloud.com:3306/busosxfqfojtq6k8bwx5';

// Criar a pool de conexões usando a URL
const pool = mysql.createPool(connectionUrl);

// Testar a conexão
pool.getConnection((err, conn) => {
    if (err) {
        console.log('Erro ao conectar ao banco de dados: ', err);
    } else {
        console.log('Conexão bem-sucedida!');
        conn.release();  // Libera a conexão de volta para o pool após o uso
    }
});

module.exports = pool.promise();
