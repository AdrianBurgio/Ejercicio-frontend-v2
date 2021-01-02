import React , {useState , useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { render } from '@testing-library/react';


function App() {

  const [usuario, setUsuario] = useState([])

  useEffect(() => {
    obtenerDatos()
  }, [])

  const obtenerDatos = async () => {
    const data = await fetch('https://localhost:44358/api/usuarios')
    const usuarios = await data.json()
    setUsuario(usuarios)
  }

  render()
  {
  return (
    <div className="container">
      <h2 className="mt-5">Usuarios</h2>

      <input id="inputFiltrar" className="form-control mb-3 col-6"  type="text" placeholder="Filtrar..."/>
   
      <table className="table table-striped table-hover ">
       <thead className="bg-secondary">
          <tr>
            <th>Nombre de usuario</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="tablaUsuaros">
        {
          usuario.map(item => (
          <tr key={item.id}>
            <td>{item.username}</td>
            <td>{item.email}</td>
            <td>{item.telefono}</td>
            <td>
              <button type="button" className="btn btn-basic text-primary" data-bs-toggle="tooltip" title="Editar"><FontAwesomeIcon icon={faEdit}/></button>
              <button type="button" className="btn btn-basic text-danger" data-bs-toggle="tooltip" title="Eliminar"><FontAwesomeIcon icon={faTrashAlt}/></button>
            </td>
          </tr>
          ))
        }
        </tbody>
      </table> 
    </div>
  );
  }
}

export default App;
