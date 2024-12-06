const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');  // Middleware para usar PUT e DELETE com POST
const app = express();
const port = 5001;

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
app.get('/', async (req, res) => {
  try {
    // Usando pool.promise() para realizar a consulta ao banco de dados
    const [results] = await db.execute('SELECT * FROM users');
    res.render('index', { users: results });
  } catch (err) {
    console.error('Erro ao consultar os usuários:', err);
    return res.status(500).json({ error: 'Erro ao consultar os usuários' });
  }
});

// Rota para exibir formulário de criação de usuário
app.get('/add', (req, res) => {
  res.render('add');
});

// Rota para criar um novo usuário
app.post('/add', async (req, res) => {
  const { name, age } = req.body;
  console.log('Dados recebidos:', req.body);
  try {
    // Insere o novo usuário
    await db.execute('INSERT INTO users (name, age) VALUES (?, ?)', [name, age]);
    
    // Redireciona para a página inicial após a inserção
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao adicionar usuário:', err);
    return res.status(500).json({ error: 'Erro ao adicionar usuário' });
  }
});

// Rota para exibir o formulário de edição de um usuário
app.get('/edit/:id', async (req, res) => {
  const { id } = req.params; // Obtém o ID do parâmetro da URL
  try {
      const [results] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      
      if (results.length === 0) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Exibe o formulário de edição com os dados do usuário
      res.render('edit', { user: results[0] });

  } catch (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Rota para atualizar um usuário (usando PUT)
app.put('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  // Validação dos dados recebidos
  if (!name || !age) {
    return res.status(400).json({ error: 'Os campos "name" e "age" são obrigatórios.' });
  }

  try {
    // Usando async/await com db.execute() para atualizar o usuário
    const [result] = await db.execute('UPDATE users SET name = ?, age = ? WHERE id = ?', [name, age, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Redireciona para a página do index após a atualização
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    return res.status(500).json({ error: 'Erro ao atualizar o usuário' });
  }
});

// Rota para excluir um usuário (agora usando DELETE)
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Usando async/await com db.execute() para excluir o usuário
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Redireciona para a página do index após a exclusão
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao excluir usuário:', err);
    return res.status(500).json({ error: 'Erro ao excluir usuário' });
  }
});
