const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/fileRoutes');
const app = express();
const port = 3001;

app.use(cors());
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
    res.send('OS Image Server Backend Running');
  });
  

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
