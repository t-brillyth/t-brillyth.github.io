import React from 'react'
import { Container, Row, Col } from 'reactstrap';
import useGetData from '../custom-hooks/useGetData';
import { db } from '../firebase.config';
import { doc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Users = () => {

    const {data: usersData, loading } = useGetData('users'); 

    const deleteUser = async (id) => {
        await deleteDoc(doc(db, 'users', id));
        toast.success('Eliminado');
    };  

  return (
    <section>
    <Container>
      <Row>
        <Col lg="12">
            <h2 className="text-center fw-bold mb-5">Users</h2>
        </Col>
        <Col lg="12">
          <table className='table'>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Username</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr>
                 <td colSpan="5" className='text-center'>
                <h5 className='pt-5 fw-bold'> Cargando usuarios... </h5>
                </td>
                  </tr>
              ) : (
                usersData ?.map(user => (
                  <tr key={user.uid}>
                    <td><img src={user.photoURL} alt='imagen del usuario' /></td>
                    <td>{user.displayName}</td>
                    <td>{user.email}</td>
                    <td>
                      <button 
                      onClick={() => 
                      {
                        deleteUser(user.uid)
                      }}
                      className='btn btn-danger'>
                        Eliminar
                      </button>
                      <Link to={`/dashboard/users/edit-user/${user.uid}`} className='btn btn-primary mx-2'>
                          Editar
                        </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Col>
      </Row>
    </Container>
  </section>
  )
}

export default Users;