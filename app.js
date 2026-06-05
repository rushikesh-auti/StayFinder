// core modules
const path = require('path');

// external module
const express = require('express');

// local module
const userRouter = require('./routes/userRouter');
const { hostRouter } = require('./routes/hostRouter');
const rootDir = require('./utils/pathUtils');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');   
app.use(express.urlencoded());
app.use(userRouter);
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, 'public',)));

app.use((req, res) => {
  res.status(404).render('404 Page',{pageTitle: 'Page Not Found'})
});

const port = 3005;

app.listen(port, () => {
  console.log(`Server is running on address http://localhost:${port}`);
});