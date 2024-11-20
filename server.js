const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');  // Middleware para usar PUT e DELETE com POST
const app = express();
const port = 5000;

// Importando a conexão com o banco de dados
const db = require('./db');

// Usando o express.json() para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração do Express e EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));  // Permite que o Express entenda PUT e DELETE via campo '_method'

// Servindo arquivos estáticos
app.use(express.static('public'));

// Rota de index (exibir todos os usuários)
app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Erro ao consultar os usuários:', err);
      return res.status(500).json({ error: 'Erro ao consultar os usuários' });
    }
    res.render('index', { users: results });
  });
});

// Rota para exibir formulário de criação de usuário
app.get('/add', (req, res) => {
  res.render('add');
});

// Rota para criar um novo usuário
app.post('/add', (req, res) => {
  const { name, age } = req.body;
  console.log('Dados recebidos:', req.body);
  db.query('INSERT INTO users (name, age) VALUES (?, ?)', [name, age], (err, result) => {
    if (err) {
      console.error('Erro ao adicionar usuário:', err);
      return res.status(500).json({ error: 'Erro ao adicionar usuário' });
    }
    res.redirect('/');
  });
});

// Rota para exibir o formulário de edição de um usuário
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).json({ error: 'Erro ao buscar usuário' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.render('edit', { user: results[0] });
    });
  });

// Rota para atualizar um usuário (usando PUT)
app.put('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, age } = req.body;
  
    // Validação dos dados recebidos
    if (!name || !age) {
      return res.status(400).json({ error: 'Os campos "name" e "age" são obrigatórios.' });
    }
  
    db.query('UPDATE users SET name = ?, age = ? WHERE id = ?', [name, age, id], (err, result) => {
      if (err) {
        console.error('Erro ao atualizar usuário:', err);
        return res.status(500).json({ error: 'Erro ao atualizar o usuário' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  

       // Redireciona para a página do index após a atualização
       res.redirect('/');
    });
  });

// Rota para excluir um usuário (agora usando DELETE)
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Tentando excluir usuário com ID: ${id}`); // Adicionando log para depuração
  
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('Erro ao excluir usuário:', err);
        return res.status(500).json({ error: 'Erro ao excluir usuário' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Redireciona para a página do index após a exclusão
      res.redirect('/');
    });
  });
  

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
