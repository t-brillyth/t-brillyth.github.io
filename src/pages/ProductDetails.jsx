import React, {useState, useRef, useEffect} from 'react';

import { Container, Row, Col} from "reactstrap";
import { useParams} from "react-router-dom";
import products from '../assets/data/products';
import Helmet from '../components/Helmet/Helmet';
import CommonSection from '../components/UI/CommonSection';
import { motion } from 'framer-motion';
import "../styles/product-details.css";
import ProductsList from "../components/UI/ProductsList";
import { useDispatch } from 'react-redux';
import { cartActions } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import useGetData from '../custom-hooks/useGetData';

const ProductDetails = () => {

  const [ product, setProduct ] = useState({});
  const [tab,setTab] = useState('desc');
  const reviewUser = useRef('');
  const reviewMsg = useRef('');
  const dispatch = useDispatch('');

  const [rating, setRating] = useState(null);
  const {id} = useParams();
  const {data: products} = useGetData('products');

  const docRef = doc(db, 'products', id);
  useEffect(()=> {
    const getProduct = async() =>{
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        setProduct(docSnap.data());
      }else{
        console.log('no hay productos');
      }
    }
    getProduct();
  }, []);
  const { 
    imgUrl, 
    productName, 
    price, 
    //avgRating, 
    //reviews, 
    shortDesc ,
    description, 
    category } = product;
  const relatedProducts = products.filter(item=> item.category === category);
 
  const submitHandler = (e) => {
    e.preventDefault();
    const reviewUserName = reviewUser.current.value;
    const reviewUserMsg = reviewMsg.current.value;

   const reviewObj = {
    userName: reviewUserName,
    text: reviewUserMsg,
    rating,
   }

   console.log(reviewObj);
   toast.success("Opinion enviada");
  };

  const addToCart = () =>{
    dispatch(cartActions.addItem({
      id,
      image:imgUrl,
      productName,
      price,
    })
    );
    toast.success('Poducto añadido con exito')
  };

  useEffect (()=>{
    window.scrollTo(0,0)
  },[product])

  return <Helmet title={productName}>
    <CommonSection title={productName} />
    <section className='pt-0'>
      <Container>
        <Row>
          <Col lg="6">
              <img src={imgUrl} alt="Imagen princiapl del producto" />
          </Col>
          <Col lg="6">
            <div className='product__details'>
              <h2>{productName}</h2>
              <div className='product__rating'>
                <div className='d-flex align-items-center mb-3'>
                  <span><i className='ri-star-s-fill'></i></span>
                  <span><i className='ri-star-s-fill'></i></span>
                  <span><i className='ri-star-s-fill'></i></span>
                  <span><i className='ri-star-s-fill'></i></span>
                  <span><i className='ri-star-half-s-line'></i></span>
                
                </div>
                <div className='d-flex align-item-center gap-5'>
                  <span className='product__price'>${price}</span>
                  <span>Categoria: {category} </span>
                </div>
                
                <p className='mt-3'>{shortDesc}</p>

                <motion.button whileTap={{ scale: 1.2 }} className='buy__btn' onClick={addToCart}>Añadir</motion.button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    <section>
      <Container>
        <Row>
          <Col lg="12">
            <div className='tab__wrapper d-flex align-items-center gap-5'>
                <h6 className={`${tab==='desc' ? 'active__tab' : ''}`} onClick={()=> setTab('desc')}>Descipcion</h6>
                <h6 className={`${tab==='rev' ? 'active__tab' : ''}`} onClick={()=> setTab('rev')}></h6>
            </div>
            {
              tab === 'desc' ? (<div className='tab__content mt-4'>
              <p>{description}</p>
            </div>) : (
              <div className='product__review mt-5'>
                <div className='review__wrapper'>
                 
                  <div className='review__form'>
                  <h4>Deja tu Experiencia</h4>
                    <form action='' onSubmit={submitHandler}>
                      <div className='form__group'>
                        <input type='text' placeholder='Nombre' ref={reviewUser} required />
                      </div>
                      <div className='form__group d-flex align-item-center gap-3 rating__group'>
                          <motion.span whileTap={{ scale:1.2 }} onClick={() => setRating(1)}>1 <i className='ri-star-s-fill'></i></motion.span>
                          <motion.span whileTap={{ scale:1.2 }} onClick={() => setRating(2)}>2 <i className='ri-star-s-fill'></i></motion.span>
                          <motion.span whileTap={{ scale:1.2 }} onClick={() => setRating(3)}>3 <i className='ri-star-s-fill'></i></motion.span>
                          <motion.span whileTap={{ scale:1.2 }} onClick={() => setRating(4)}>4 <i className='ri-star-s-fill'></i></motion.span>
                          <motion.span whileTap={{ scale:1.2 }} onClick={() => setRating(5)}>5 <i className='ri-star-s-fill'></i></motion.span>
                      </div>
                      <div className='form__group'>
                        <textarea  ref={reviewMsg} rows={4} type='text' placeholder='Mensaje...' required />
                      </div>
                      <motion.button whileTap={{ scale:1.2 }} type='submit' className='buy__btn'>Enviar</motion.button>
                    </form>
                  </div>
                </div>
              </div>
            )
            }
            
          </Col>
          <Col lg="12" className='mt-5'>
            <h2 className='related__title'>You might also like</h2>
          </Col>
          <ProductsList  data={relatedProducts} />
        </Row>
      </Container>
    </section>
  </Helmet>
};

export default ProductDetails;
