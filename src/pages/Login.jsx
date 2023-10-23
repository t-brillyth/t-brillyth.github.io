import React, { useState } from 'react';
import Helmet from '../components/Helmet/Helmet';
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Cambio aquí
import { auth } from '../firebase.config'; // Importa getAuth para obtener el objeto auth
import { toast } from 'react-toastify';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      const user = userCredential.user;

      console.log(user);
      
      if (user.uid === '057HUOBaLQUyBJitLzRD01EgtiJ3') {
        navigate("/dashboard");
      }else {
        navigate("/checkout");
      }
      setLoading(false);
      toast.success('Inicio de sesión correcta');
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }

  return (
    <Helmet title="Login">
      <section>
        <Container>
          <Row>
            {
              loading ? (
                <Col lg="12" className='text-center'>
                  <h5 className='fw-bold'>Loading...</h5>
                </Col>
              ) : (
                <Col lg="6" className='m-auto text-center'>
                  <h1 className='fw-bold fs-4 mb-4'>Inicio Sesión</h1>

                  <Form className='auth__form' onSubmit={signIn}>
                    <FormGroup className='form__group'>
                      <input type="email" placeholder='aaa@gmail.com' value={email} onChange={e => setEmail(e.target.value)} />
                    </FormGroup>
                    <FormGroup className='form__group'>
                      <input type="password" placeholder='Contraseña' value={password} onChange={e => setPassword(e.target.value)} />
                    </FormGroup>
                    <button type='submit' className='buy__btn auth__btn w-80'>Iniciar Sesión</button>
                    <p>¿Tienes cuenta? <Link to='/signup'>Crear cuenta</Link></p>
                  </Form>
                </Col>
              )
            }
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;