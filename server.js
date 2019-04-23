const express = require('express');
const app = express();

app.use(express.static('assets'));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('login');
});
app.get('/auth/google', (req, res) => {
  res.render('index');
})
const server = app.listen(3000, 'localhost', (req, res) => {
  const port = server.address().port;
  const host = server.address().address;
  console.log(`Server is running at http://${host}:${port}`);
});

app.use((req, res, next)=> {
  res.status(404).send(`Oops! Resource ${req.url} could not be found.`);
});