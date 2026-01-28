const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (req, res) => res.json({ msg: "pong" }));

const PORT = 3001;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
