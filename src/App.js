import React, { Fragment, useState, useEffect } from 'react';
import Formulario from './Components/Formulario';
import Cancion from './Components/Cancion';
import Info from './Components/Info';
import axios from 'axios';

function App() {
  // definir el state
  const [busquedaletra, guardarBusquedaLetra] = useState({});
  const [letra, guardarLetra] = useState('');
  const [info, guardarInfo] = useState({});
  const [error, guardarError] = useState(false);

  useEffect(() => {
    if (Object.keys(busquedaletra).length === 0) return;

    const consultarApiLetra = async () => {
      const { artista, cancion } = busquedaletra;
      const url = `https://api.lyrics.ovh/v1/${artista}/${cancion}`;
      const url2 = `https://www.theaudiodb.com/api/v1/json/1/search.php?s=${artista}`;

      axios
        .all([axios.get(url), axios.get(url2)])
        .then(
          axios.spread((letra, informacion) => {
            guardarLetra(letra.data.lyrics);
            guardarInfo(informacion.data.artists[0]);
          })
        )
        .catch((error) => {
          guardarError(true);
        });
      guardarError(false);
    };
    consultarApiLetra();
  }, [busquedaletra]);

  return (
    <Fragment>
      <Formulario guardarBusquedaLetra={guardarBusquedaLetra} />

      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <Info info={info} />
          </div>
          <div className="col-md-6">
            <Cancion letra={letra} />
            {letra.length === 0 && Object.keys(info).length !== 0 ? (
              <p className="alert alert-primary text-center">
                No se encontró la letra Conan!
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
