import { Add, Remove } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from "styled-components";
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { mobile } from '../responsive';
import StripeCheckout from "react-stripe-checkout";
import { useState } from 'react';
import { userRequest } from '../requestMethods';
import { useHistory } from 'react-router';
import {Link} from 'react-router-dom';

//const KEY = process.env.REACT_APP_STRIPE;
//const KEY = Stripe.setPublishableKey("pk_test_51LuXwjSGYsQgoAqwL8Q05abt8d4iCXSjfaZW4WJMcZela9BiIvs2yFaqceJSoec28sjm5gu11QgdGybIOpm8hjOy00QLWylVJR");
//const KEY = "pk_test_51LuXwjSGYsQgoAqwL8Q05abt8d4iCXSjfaZW4WJMcZela9BiIvs2yFaqceJSoec28sjm5gu11QgdGybIOpm8hjOy00QLWylVJR";


const Container = styled.div`
`
const Wrapper = styled.div`
padding: 20px;
${mobile({width: "75%"})}
`
const Title = styled.h1`
font-weight: 300;
text-align: center;
`
const Top = styled.div`
display: flex;
align-item: center;
justify-content: space-between;
padding: 20px;
`
const TopButton = styled.button`
padding: 10px;
font-weight: 600;
cursor: pointer;
border: ${(props) => props.type === "filled" && "none"}; 
background-color: ${(props) => props.type === "filled" ? "#1A6837" : "transparent"};
color: ${(props) => props.type === "filled" && "white"};
`

const TopTexts = styled.div`
${mobile({display: "none"})}
`
const TopText = styled.span`
text-decoration: underline;
cursor: pointer;
margin: 0px 10px;
`

const Bottom = styled.div`
display: flex;
justify-content: space-between;
${mobile({flexDirection: "column"})}
`
const Info = styled.div`
flex: 3;
`

const Product = styled.div`
display: flex;
justify-content: space-between; 
${mobile({flexDirection: "column"})}
`
const ProductDetail = styled.div`
flex: 2;
display: flex;
`

const Image = styled.img`
width: 200px;
height: 200px;
object-fit: cover;
margin: 20px;
`

const Details = styled.div`
padding: 20px;
display: flex;
flex-direction: column;
justify-content: space-around;
`

const ProductName = styled.span``

const ProductID = styled.div``

const ProductColor = styled.span`
width: 20px;
height: 20px;
border-radius: 50%;
background-color: ${props=>props.color};
`

const PriceDetail = styled.div`
display: flex;
align-items: center;
flex-direction: column;
justify-content: center;
flex: 1;
`

const ProductAmountContainer = styled.div`
display: flex;
align-items: center;
margin-bottom: 20px;
`
const ProductAmount = styled.div`
font-size: 24px;
margin: 5px;
${mobile({margin: "5px 15px"})}
`
const ProductPrice = styled.div`
font-size: 30px;
font-weight: 200;
${mobile({marginBottom: "20px"})}
`

const ProductSize = styled.span``;

const Hr = styled.hr`
background-color: #eee;
border: none;
height: 1px;
`

const Summary = styled.div`
flex: 1;
border: 0.5px solid #1A6837;
border-radius: 10px;
padding: 20px;
height: 50vh;
`

const SummaryTitle = styled.h1`
font-weight: 200;
`

const SummaryItem = styled.div`
margin: 30px 0px;
display: flex;
justify-content: space-between;
font-weight: ${props=>props.type === "total" && "500"};
font-size: ${props=>props.type === "total" && "24px"};
`

const SummaryItemText = styled.span`

`

const SummaryItemPrice = styled.span`

`

const Button = styled.button`
width: 100%;
padding: 10px;
background-color: #1A6837;
color: white;
font-weight: 600;
`


const Cart = () => {
    const cart = useSelector((state) => state.cart);
    const [stripeToken,setStripeToken] = useState(null);
    const history = useHistory();
    const [quantity, setQuantity] = useState(1);

    const onToken = (token)=>{
        setStripeToken(token);
    };
    
    const handleQuantity = (type) =>{
        if (type === "dec"){
            quantity > 1 && setQuantity(quantity-1)
        }
        else{
            setQuantity(quantity+1)
        }
      }

    useEffect(()=>{
        const makeRequest = async ()=>{
            try{
                const res = await userRequest.post("/checkout/payment",{
                    tokenId: stripeToken.id,
                    //amount: cart.total * 100,
                    amount: 500,
                });
                history.push("/success",{stripeData: res.data, data: res.data});
            } catch{}
        };
        stripeToken && makeRequest();
    },[stripeToken, cart.total, history]);
  return (
    <Container>
        <Navbar/>
        <Announcement/>
        <Wrapper>
            <Title>Your Cart</Title>
            <Top><Link to="/">
                <TopButton>Continue Shopping</TopButton></Link>
                <TopTexts>
                    <TopText>Shopping Bag(2)</TopText>
                    <TopText>Your Wishlist(0)</TopText>
                </TopTexts>
                <TopButton type="filled">Our Goal</TopButton>
                </Top>
            <Bottom>
                <Info>
                    {cart.products.map(product=>(
                        <Product>
                        <ProductDetail>
                            <Image src={product.img} />
                            <Details>
                                <ProductName><b>Product: </b>{product.title}</ProductName>
                                <ProductID><b>ID: </b>{product._id}</ProductID>
                                <ProductColor color={product.color}/>
                                <ProductSize>
                                    <b>Size:</b> {product.size}
                                </ProductSize>
                            </Details>
                        </ProductDetail>
                        <PriceDetail>
                            <ProductAmountContainer>
                                <Add onClick={()=>handleQuantity("inc")}/>
                                <ProductAmount>{product.quantity}</ProductAmount>
                                <Remove onClick={()=>handleQuantity("dec")}/>
                            </ProductAmountContainer>
                            <ProductPrice>₹ {product.price*product.quantity}</ProductPrice>
                        </PriceDetail>
                    </Product>))}
                    <Hr/>
                    
                </Info>
                <Summary>
                    <SummaryTitle>Order Summary</SummaryTitle>
                    <SummaryItem>
                        <SummaryItemText>Subtotal</SummaryItemText>
                        <SummaryItemPrice>₹ {cart.total}</SummaryItemPrice>
                    </SummaryItem>
                    <SummaryItem>
                        <SummaryItemText>Estimated Shipping</SummaryItemText>
                        <SummaryItemPrice>₹ 899</SummaryItemPrice>
                    </SummaryItem>
                    <SummaryItem>
                        <SummaryItemText>Discount</SummaryItemText>
                        <SummaryItemPrice>₹ -899</SummaryItemPrice>
                    </SummaryItem>
                    <SummaryItem  type="total">
                        <SummaryItemText>Total</SummaryItemText>
                        <SummaryItemPrice>₹ {cart.total}</SummaryItemPrice>
                    </SummaryItem>
                    <StripeCheckout
                    name="GreenSteam Shop"
                    image="https://www.nicepng.com/png/full/73-730285_it-benefits-per-users-icon-user-png-green.png"
                    billingAddress
                    shippingAddress
                    description={`Your total is $${cart.total}`}
                    amount={cart.total * 100}
                    token={onToken}
                    stripeKey="pk_test_51LuXwjSGYsQgoAqwL8Q05abt8d4iCXSjfaZW4WJMcZela9BiIvs2yFaqceJSoec28sjm5gu11QgdGybIOpm8hjOy00QLWylVJR"
                    >
                    <Button>BUY NOW!</Button>
                    </StripeCheckout>
                </Summary>
            </Bottom>
        </Wrapper>
        <Footer/>
    </Container>
  )
}

export default Cart;