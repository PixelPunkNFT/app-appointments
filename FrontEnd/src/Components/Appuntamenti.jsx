// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import axios from 'axios';
// import 'react-calendar/dist/Calendar.css';

// function Appuntamenti() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [appuntamenti, setAppuntamenti] = useState([]);
//   const [nomeCliente, setNomeCliente] = useState('');
//   const [nota, setNota] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
  

//   useEffect(() => {
//     axios.get('http://localhost:5000/appuntamentis')
//       .then(response => {
//         setAppuntamenti(response.data);
//       })
//       .catch(error => {
//         console.error('Errore nel caricamento degli appuntamenti', error);
//       });
//   }, []);

//   const onDayClick = (value) => {
//     setSelectedDate(value);
//     setIsModalOpen(true);
//   };

//   const prenotaAppuntamento = async () => {
//     try {
//       await axios.post('http://localhost:5000/appuntamenti', {
//         data: selectedDate,
//         nota,
//         nomeCliente,
//       });
//       setAppuntamenti([...appuntamenti, { data: selectedDate, nota, nomeCliente }]);
//       setIsModalOpen(false);
//       setNomeCliente('');
//       setNota('');
//       alert('Appuntamento prenotato con successo!');
//     } catch (error) {
//       console.error('Errore nella prenotazione dell\'appuntamento', error);
//     }
//   };

//   const tileClassName = ({ date, view }) => {
//     // Logica per determinare se una data è occupata
//   };

//   return (
//     <div>
//       <Calendar
//         onChange={setSelectedDate}
//         value={selectedDate}
//         onClickDay={onDayClick}
//         tileClassName={tileClassName}
//       />

//       {isModalOpen && (
//         <div className="modal">
//           <h3>Prenota Appuntamento</h3>
//           <input
//             type="text"
//             value={nomeCliente}
//             onChange={(e) => setNomeCliente(e.target.value)}
//             placeholder="Nome Cliente"
//             required
//           />
//           <textarea
//             value={nota}
//             onChange={(e) => setNota(e.target.value)}
//             placeholder="Inserisci una nota per l'appuntamento"
//           />
//           <button onClick={prenotaAppuntamento}>Prenota</button>
//           <button onClick={() => setIsModalOpen(false)}>Annulla</button>
//         </div>
//       )}

//       {/* Visualizzazione degli appuntamenti */}
      
//       <container>
//   <h2>Appuntamenti</h2>
//   <table>
//     <thead>
//       <tr>
//         <th>Nome Cliente</th>
//         <th>Nota</th>
//         <th>Data</th>
//       </tr>
//     </thead>
//     <tbody>
//       {appuntamenti.map((appuntamento, index) => (
//         <tr key={index}>
//           <td>{appuntamento.nomeCliente}</td>
//           <td>{appuntamento.nota}</td>
//           <td>{new Date(appuntamento.data).toLocaleDateString()}</td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </container>

      
//     </div>
//   );
// }

// export default Appuntamenti;

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

function Appuntamenti() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appuntamenti, setAppuntamenti] = useState([]);
  const [nomeCliente, setNomeCliente] = useState('');
  const [nota, setNota] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orariDisponibili, setOrariDisponibili] = useState([]);
  const [orarioSelezionato, setOrarioSelezionato] = useState(null);
  const [orariPrenotati, setOrariPrenotati] = useState([]);


  useEffect(() => {
    axios.get('http://localhost:5000/appuntamenti')
      .then(response => {
        setAppuntamenti(response.data);
        const orari = response.data.map(appuntamento => appuntamento.orario);
      setOrariPrenotati(orari);
      })
      .catch(error => {
        console.error('Errore nel caricamento degli appuntamenti', error);
      });
  }, []);

  const onDayClick = (value) => {
    setSelectedDate(value);

    // Qui dovresti effettuare una chiamata API per ottenere gli orari disponibili per la data selezionata
    // E aggiornare lo stato 'orariDisponibili' con i dati ottenuti.
    // In questo esempio, assumiamo che 'orariDisponibili' sia una matrice di orari disponibili.
    const orariDisponibili = ['10:00', '11:00', '14:00', '15:00'];
    setOrariDisponibili(orariDisponibili);
    setOrarioSelezionato(null); // Reimposta l'orario selezionato
    setIsModalOpen(true); // Apri la modale per la prenotazione
  };

  const prenotaAppuntamento = async () => {
    // Verifica se la data è già presente tra gli appuntamenti
    const dataPrenotata = appuntamenti.some(appuntamento =>
      new Date(appuntamento.data).toLocaleDateString() ===
      selectedDate.toLocaleDateString()
    );
  
    // Se la data è già prenotata, verifica l'orario
    if (dataPrenotata) {
      const orarioPrenotato = appuntamenti.some(appuntamento =>
        new Date(appuntamento.data).toLocaleDateString() ===
        selectedDate.toLocaleDateString() &&
        appuntamento.orario === orarioSelezionato
      );
  
      if (orarioPrenotato) {
        alert('Questo orario è già stato prenotato. Scegli un altro orario.');
        return;
      }
    }
  
    // Continua con la prenotazione solo se la data e l'orario non sono già prenotati
    try {
      await axios.post('http://localhost:5000/appuntamenti', {
        data: selectedDate,
        nota,
        nomeCliente,
        orario: orarioSelezionato,
      });
      setAppuntamenti([
        ...appuntamenti,
        { data: selectedDate, nota, nomeCliente, orario: orarioSelezionato }
      ]);
      setIsModalOpen(false);
      setNomeCliente('');
      setNota('');
      setOrarioSelezionato(null);
      alert('Appuntamento prenotato con successo!');
    } catch (error) {
      console.error('Errore nella prenotazione dell\'appuntamento', error);
    }
  };
  

  const tileClassName = ({ date, view }) => {
    // Logica per determinare se un orario è occupato
    const dataString = date.toLocaleDateString(); // Converte la data in una stringa per confronto
    return orariDisponibili.includes(dataString) ? 'orario-disponibile' : 'orario-occupato';
  };

  return (
    <div>
      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        onClickDay={onDayClick}
        tileClassName={tileClassName}
      />

      {isModalOpen && (
        <div className="modal">
          <h3>Prenota Appuntamento</h3>
          <input
            type="text"
            value={nomeCliente}
            onChange={(e) => setNomeCliente(e.target.value)}
            placeholder="Nome Cliente"
            required
          />
          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Inserisci una nota per l'appuntamento"
          />
          <p>Seleziona un orario:</p>
          <select value={orarioSelezionato} onChange={(e) => setOrarioSelezionato(e.target.value)}>
            <option value="" disabled>
              Seleziona un orario
            </option>
            {orariDisponibili.map((orario, index) => (
              <option key={index} value={orario}>
                {orario}
              </option>
            ))}
          </select>
          <button onClick={prenotaAppuntamento}>Prenota</button>
          <button onClick={() => setIsModalOpen(false)}>Annulla</button>
        </div>
      )}

      {/* Visualizzazione degli appuntamenti */}
      <ul>
        
        <h2>Appuntamenti</h2>
        <table>
          <thead>
            <tr>
              <th>Nome Cliente</th>
              <th>Nota</th>
              <th>Data</th>
              <th>Orario</th>
            </tr>
          </thead>
          <tbody>
            {appuntamenti.map((appuntamento, index) => (
              <tr key={index}>
                <td>{appuntamento.nomeCliente}</td>
                <td>{appuntamento.nota}</td>
                <td>{new Date(appuntamento.data).toLocaleDateString()}</td>
                <td>{appuntamento.orario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ul>
    </div>
  );
}

export default Appuntamenti;