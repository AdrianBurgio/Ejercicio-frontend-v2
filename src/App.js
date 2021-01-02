import React , {useState , useEffect} from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faUser } from '@fortawesome/free-solid-svg-icons';


function App() {

  const baseUrl="https://localhost:44358/api/usuarios";

  const [data, setData]=useState([]);
  const [usuario, setUsuario] = useState([])

  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);

  const [usuarioSeleccionado, setUsuarioSeleccionado]=useState({
    id:"",
    username: "",
    email: "",
    telefono: ""
  })

  const seleccionarUsuario=(usuario, caso)=>{
    setUsuarioSeleccionado(usuario);
    (caso==="Editar")?setModalEditar(true):setModalEliminar(true)
  }

  const handleChange=e=>{
    const {name, value}=e.target;
    setUsuarioSeleccionado(prevState=>({
      ...prevState,
      [name]: value
    }));
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+"/"+usuarioSeleccionado.id, usuarioSeleccionado)
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(usuario=>{
        if(usuario.id===usuarioSeleccionado.id){
          usuario.username=usuarioSeleccionado.username;
          usuario.email=usuarioSeleccionado.email;
          usuario.telefono=usuarioSeleccionado.telefono;
        }
      });
      setData(dataNueva);
      obtenerDatos();
      setModalEditar(false);
    }).catch(error=>{
      console.log(error);
    })
  }
  
  const peticionDelete=async()=>{
    await axios.delete(baseUrl+"/"+usuarioSeleccionado.id)
    .then(response=>{
      setData(data.filter(usuario=>usuario.id!==usuarioSeleccionado.id));
      obtenerDatos();
      setModalEliminar(false);
    }).catch(error=>{
      console.log(error);
    })
  }

  const abrirModalInsertar=()=>{
    //usuarioSeleccionado([]);
    setModalInsertar(true);
  }

  const peticionPost=async()=>{
    await axios.post(baseUrl, usuarioSeleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      obtenerDatos();
      setModalInsertar(false);
    }).catch(error=>{
      console.log(error);
    })
  }

  useEffect(() => {
    obtenerDatos()
  }, [])

  const obtenerDatos = async () => {
    const data = await fetch('https://localhost:44358/api/usuarios')
    const usuarios = await data.json()
    setUsuario(usuarios)
  }

  return (
    <div className="container">
      <h2 className="mt-5">Usuarios</h2>

  
      <div className="row">
        <div className="col-6">
          <button className="btn btn-success" onClick={()=>abrirModalInsertar()}><FontAwesomeIcon icon={faUser}/> Agregar usuario</button>
        </div>
        <div className="col-6 col-sm-6 d-flex justify-content-end" >
          <input id="inputFiltrar" className="form-control mb-3 col-6"  type="text" placeholder="Filtrar..."/>
        </div>
      </div>

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
              <button type="button" className="btn btn-basic text-primary" data-bs-toggle="tooltip" title="Editar"
                onClick={()=>seleccionarUsuario(item, 'Editar')}><FontAwesomeIcon icon={faEdit}/></button>
              <button type="button" className="btn btn-basic text-danger" data-bs-toggle="tooltip" title="Eliminar"
                onClick={()=>seleccionarUsuario(item, 'Eliminar')}><FontAwesomeIcon icon={faTrashAlt}/></button>
            </td>
          </tr>
          ))
        }
        </tbody>
      </table> 


      <Modal isOpen={modalEditar}>
        <ModalHeader>
          <div>
            <h3>Editar Usuario</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID</label>
            <input
              className="form-control"
              readOnly
              type="text"
              name="id"
              value={usuarioSeleccionado && usuarioSeleccionado.id}
            />
            <br />

            <label>Nombre de usuario</label>
            <input
              className="form-control"
              type="text"
              name="username"
              value={usuarioSeleccionado && usuarioSeleccionado.username}
              onChange={handleChange}
            />
            <br />

            <label>Email</label>
            <input
              className="form-control"
              type="text"
              name="email"
              value={usuarioSeleccionado && usuarioSeleccionado.email}
              onChange={handleChange}
            />
            <br />

            <label>Teléfono</label>
            <input
              className="form-control"
              type="text"
              name="telefono"
              value={usuarioSeleccionado && usuarioSeleccionado.telefono}
              onChange={handleChange}
            />
            <br />

          </div>
        </ModalBody>
        <ModalFooter>
          <button 
            className="btn btn-primary" 
            onClick={()=>peticionPut()}
          >
            Actualizar
          </button>
          <button
            className="btn btn-danger"
            onClick={()=>setModalEditar(false)}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEliminar}>
        <ModalBody>
          Estás Seguro que deseas eliminar el usuario: {usuarioSeleccionado && usuarioSeleccionado.username}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>setModalEliminar(false)}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalInsertar}>
        <ModalHeader>
          <div>
            <h3>Insertar Usuario</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre de usuario</label>
            <input
              className="form-control"
              type="text"
              name="username"
              value={usuarioSeleccionado ? usuarioSeleccionado.usermane: ''}
              onChange={handleChange}
            />
            <br />

            <label>Email</label>
            <input
              className="form-control"
              type="text"
              name="email"
              value={usuarioSeleccionado ? usuarioSeleccionado.email: ''}
              onChange={handleChange}
            />
            <br />

            <label>Teléfono</label>
            <input
              className="form-control"
              type="text"
              name="telefono"
              value={usuarioSeleccionado ? usuarioSeleccionado.telefono: ''}
              onChange={handleChange}
            />
            <br />

          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success"
            onClick={()=>peticionPost()}>
            Insertar
          </button>
          <button
            className="btn btn-danger"
            onClick={()=>setModalInsertar(false)}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    
    </div>
   
  );
}

export default App;
