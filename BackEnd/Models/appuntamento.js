const mongoose = require('mongoose');

const appuntamentoSchema = new mongoose.Schema({
  data: {
    type: Date,
    required: true
  },
  nota: {
    type: String,
    required: false
  },
  nomeCliente: {
    type: String,
    required: true
  },
  orario: {
    type: String, // Tipo del campo orario
    required: true 
  }
}, {
  timestamps: true // Aggiunge automaticamente i campi createdAt e updatedAt
});

const Appuntamento = mongoose.model('Appuntamento', appuntamentoSchema);

module.exports = Appuntamento;
