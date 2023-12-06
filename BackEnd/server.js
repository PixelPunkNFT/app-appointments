const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Appuntamento = require('./Models/appuntamento');

const app = express();
app.use(cors());
app.use(express.json());

// Connessione a MongoDB
// inserisci la stringa di connessione database mongo db
mongoose.connect('INSERISCI STRINGA MONGO DB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connesso a MongoDB'))
.catch(err => console.error('Non è stato possibile connettersi a MongoDB', err));





// Endpoint per ottenere appuntamenti
app.get('/appuntamenti', async (req, res) => {
  try {
    const appuntamenti = await Appuntamento.find();
    res.json(appuntamenti);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Endpoint per creare un nuovo appuntamento
app.post('/appuntamenti', async (req, res) => {
  try {
    // Verifica se esiste già un appuntamento con la stessa data e orario
    const appuntamentoEsistente = await Appuntamento.findOne({ data: req.body.data, orario: req.body.orario });

    if (appuntamentoEsistente) {
      res.status(400).send('Appuntamento già prenotato per questa data e orario.');
    } else {
      // Se non esiste, crea il nuovo appuntamento
      const nuovoAppuntamento = new Appuntamento({
        data: req.body.data,
        nota: req.body.nota,
        nomeCliente: req.body.nomeCliente,
        orario: req.body.orario
      });
      await nuovoAppuntamento.save();
      res.status(201).send('Appuntamento salvato');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});



const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
