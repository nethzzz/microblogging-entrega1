// src/app.js

require('dotenv').config();
const path = require('path'); // Módulo nativo do Node para lidar com caminhos
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { engine } = require('express-handlebars'); // Nova forma de importar
const methodOverride = require('method-override');

// Importação das rotas
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const viewRoutes = require('./routes/viewRoutes');
// Vamos criar as rotas de visualização em um novo arquivo para organização
// const viewRoutes = require('./routes/viewRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuração do Handlebars ---
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    helpers: { // <-- ADICIONE ESTE BLOCO 'helpers'
        // Helper para comparar se dois valores são iguais
        if_eq: function(a, b, opts) {
            // ObjectId precisa ser convertido para string para comparação
            if (a && b && a.toString() === b.toString()) {
                return opts.fn(this); // Renderiza o bloco de dentro do {{#if_eq}}
            } else {
                return opts.inverse(this); // Renderiza o bloco {{else}}
            }
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views')); // Caminho para a pasta de views

// --- Configuração da Sessão ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'um_segredo_qualquer', // Use uma variável de ambiente!
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// Define a pasta 'public' para arquivos estáticos (CSS, JS do cliente, imagens)
app.use(express.static(path.join(__dirname, '..', 'public')));



// --- Rotas da API ---
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', userRoutes);
// OBS: Movemos as rotas da API para o prefixo /api/ para não conflitarem com as rotas de visualização

// --- Rotas de Visualização (Views) ---
app.use('/', viewRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});