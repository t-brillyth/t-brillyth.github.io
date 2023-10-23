import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { toast } from "react-toastify";

import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  const [enterTitle, setEnterTitle] = useState("");
  const [enterShortDesc, setEnterShortDesc] = useState("");
  const [enterDescription, setEnterDescription] = useState("");
  const [enterCategory, setEnterCategory] = useState("");
  const [enterPrice, setEnterPrice] = useState("");
  const [enterProductImg, setEnterProductImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addProduct = async (e) => {
    e.preventDefault();
    if (!enterProductImg) {
      toast.error("Por favor, selecciona una imagen del producto.");
      return;
    }

    setLoading(true);

    try {
      const docRef = await collection(db, "products");
      const storageRef = ref(
        storage,
        `productImages/${Date.now() + enterProductImg.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, enterProductImg);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          setLoading(false);
          toast.error("Error al subir imagen: " + error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              await addDoc(docRef, {
                productName: enterTitle,
                shortDesc: enterShortDesc,
                description: enterDescription,
                category: enterCategory,
                price: enterPrice,
                imgUrl: downloadURL,
              });
              setLoading(false);
              toast.success("Producto añadido con éxito");
              navigate("/dashboard/all-products");
            })
            .catch((error) => {
              setLoading(false);
              toast.error(
                "Error al obtener la URL de la imagen: " + error.message
              );
            });
        }
      );
    } catch (err) {
      setLoading(false);
      toast.error("Error al añadir el producto: " + err.message);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            {loading ? (
              <h4 className="py-5">Cargando....</h4>
            ) : (
              <div>
                <h2 className="mb-5">Añadir Producto</h2>
                <Form onSubmit={addProduct}>
                  <FormGroup className="form__group">
                    <span>Nombre del Producto</span>
                    <input
                      type="text"
                      placeholder="Doodle Sofa"
                      value={enterTitle}
                      onChange={(e) => setEnterTitle(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <span>Descripción corta</span>
                    <input
                      type="text"
                      placeholder="Lorem....."
                      value={enterShortDesc}
                      onChange={(e) => setEnterShortDesc(e.target.value)}
                      required
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <span>Descripción</span>
                    <input
                      type="text"
                      placeholder="Lorem....."
                      value={enterDescription}
                      onChange={(e) => setEnterDescription(e.target.value)}
                      required
                    />
                  </FormGroup>

                  <div className="d-flex align-items-center justify-content-between gap-5">
                    <FormGroup className="form__group w-50">
                      <span>Precio</span>
                      <input
                        type="number"
                        placeholder="$1200"
                        value={enterPrice}
                        onChange={(e) => setEnterPrice(e.target.value)}
                        required
                      />
                    </FormGroup>
                    <FormGroup className="form__group w-50">
                      <span>Categoría</span>
                      <select
                        className="w-100 p-2"
                        value={enterCategory}
                        onChange={(e) => setEnterCategory(e.target.value)}
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
                  <div>
                    <FormGroup className="form__group">
                      <span>Imagen del Producto</span>
                      <input
                        type="file"
                        onChange={(e) => setEnterProductImg(e.target.files[0])}
                        required
                      />
                    </FormGroup>
                  </div>
                  <button className="buy__btn mt-4" type="submit">
                    Añadir Producto
                  </button>
                </Form>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AddProducts;
