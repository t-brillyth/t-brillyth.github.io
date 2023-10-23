import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup } from 'reactstrap';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { id } = useParams();
  const [editedProduct, setEditedProduct] = useState({
    productName: '',
    shortDesc: '',
    description: '',
    category: '',
    price: '',
    imgUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', id);
        const productData = await getDoc(productRef);
        if (productData.exists()) {
          const product = productData.data();
          setEditedProduct({
            productName: product.productName,
            shortDesc: product.shortDesc,
            description: product.description,
            category: product.category,
            price: product.price,
            imgUrl: product.imgUrl,
          });
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        toast.error('Error al cargar el producto');
      }
    };

    fetchProduct();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, editedProduct);

      toast.success('Producto editado con éxito');
      setLoading(false);
      navigate('/dashboard/all-products');
    } catch (error) {
      console.error('Error al editar el producto:', error);
      toast.error('Error al editar el producto');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/all-products');
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <h2 className="mb-5">Editar Producto</h2>
            <Form onSubmit={handleEdit}>
              <FormGroup className="form__group">
                <span>Nombre del Producto</span>
                <input
                  type="text"
                  placeholder="Doodle Sofa"
                  value={editedProduct.productName}
                  onChange={(e) => setEditedProduct({ ...editedProduct, productName: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup className="form__group">
                <span>Descripción corta</span>
                <input
                  type="text"
                  placeholder="Lorem....."
                  value={editedProduct.shortDesc}
                  onChange={(e) => setEditedProduct({ ...editedProduct, shortDesc: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup className="form__group">
                <span>Descripción</span>
                <input
                  type="text"
                  placeholder="Lorem....."
                  value={editedProduct.description}
                  onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                  required
                />
              </FormGroup>
              <div className="d-flex align-items-center justify-content-between gap-5">
                <FormGroup className="form__group w-50">
                  <span>Precio</span>
                  <input
                    type="number"
                    placeholder="$1200"
                    value={editedProduct.price}
                    onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup className="form__group w-50">
                  <span>Categoría</span>
                  <select
                    className="w-100 p-2"
                    value={editedProduct.category}
                    onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                    required
                  >
                    <option>Selecciona una categoría</option>
                    <option value="chair">Chair</option>
                    <option value="sofa">Sofa</option>
                    <option value="mobile">Mobile</option>
                    <option value="watch">Watch</option>
                    <option value="wireless">Wireless</option>
                  </select>
                </FormGroup>
              </div>
              <button className="btn btn-success mt-4" type="submit">
                Guardar Cambios
              </button>
              <button className="btn btn-danger mt-4 mx-2" onClick={handleCancel}>
                Cancelar
              </button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default EditProduct;