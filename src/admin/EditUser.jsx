import React, { useState, useEffect } from 'react';
import Helmet from '../components/Helmet/Helmet';
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link } from 'react-router-dom';
import { updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from "../firebase.config";
import { storage } from '../firebase.config';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import "../styles/login.css";
import { useNavigate } from 'react-router-dom';

const EditUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null); // Use null instead of an empty string
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setUsername(user.displayName || '');
          setEmail(user.email || '');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const updateProfileData = async () => {
    setLoading(true);

    try {
      const user = auth.currentUser;

      if (user) {
        await updateProfile(user, {
          displayName: username,
        });

        if (file) {
          const storageRef = ref(storage, `images/${Date.now() + username}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on('error', (error) => {
            toast.error(error.message);
          });

          uploadTask.on('state_changed', (snapshot) => {
            // Handle the upload progress if needed
          }, (error) => {
            toast.error(error.message);
          }, async () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              // Update the user's photoURL if needed
              await updateProfile(user, {
                photoURL: downloadURL,
              });

              // Store user data
              const userDocRef = doc(db, 'users', user.uid);
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                await updateDoc(userDocRef, {
                  displayName: username,
                  email,
                  photoURL: downloadURL,
                });
              }

              setLoading(false);
              toast.success('Perfil actualizado con éxito');
              navigate('/profile'); // Navigate to the profile page
            });
          });
        } else {
          // If no file was selected, only update the user's display name
          // and navigate to the profile page
          await updateDoc(doc(db, 'users', user.uid), {
            displayName: username,
          });

          setLoading(false);
          toast.success('Perfil actualizado con éxito');
          navigate('/dashboard/users'); // Navigate to the profile page
        }
      }
    } catch (error) {
      setLoading(false);
      toast.error('Algo salió mal');
    }
  };

  return (
    <Helmet title="Edit Profile">
      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className='text-center'>
                <h5 className='fw-bold'>Loading...</h5>
              </Col>
            ) : (
              <Col lg="6" className='m-auto text-center'>
                <h1 className='fw-bold fs-4 mb-4'>Editar Perfil</h1>
                <Form className='auth__form' onSubmit={updateProfileData}>
                  <FormGroup className='form__group'>
                    <input type="text" placeholder='Username' value={username} onChange={e => setUsername(e.target.value)} />
                  </FormGroup>
                  <FormGroup className='form__group'>
                    <input type="email" placeholder='aaa@gmail.com' value={email} onChange={e => setEmail(e.target.value)} />
                  </FormGroup>
                  <FormGroup className='form__group'>
                    <input type="file" onChange={e => setFile(e.target.files[0])} />
                  </FormGroup>
                  <button type='submit' className='buy__btn auth__btn w-80'>Guardar Cambios</button>
                  <p>¿Deseas cancelar? <Link to='/dashboard/users'>Volver</Link></p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default EditUser;