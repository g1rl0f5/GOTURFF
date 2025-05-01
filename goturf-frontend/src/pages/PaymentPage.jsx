

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './PaymentPage.css'; 

const stripePromise = loadStripe('pk_test_51RItdQ2cvcZB0KBYX2b724zFZwHepEmPzl0FS6VNywclJA2w34upZkDXokwiEC6iuCbIVuVX3QotjxSNuQZh1NND00ocgrHSl5');

const CheckoutForm = ({ clientSecret, bookingAmount }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        alert('Payment Successful!');
       
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <CardElement className="stripe-card-element" />
      <button type="submit" disabled={!stripe} className="payment-button">
        Pay ₹{(bookingAmount / 100).toFixed(2)}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { bookingId } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [bookingAmount, setBookingAmount] = useState(0);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:5000/api/payments/create-payment-intent/${bookingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientSecret(res.data.clientSecret);
      setBookingAmount(res.data.amount);
    };

    fetchPaymentIntent();
  }, [bookingId]);

  return (
    <div className="payment-container">
      <h1 className="payment-title">Stripe Payment</h1>
      {clientSecret && (
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} bookingAmount={bookingAmount} />
        </Elements>
      )}
    </div>
  );
};

export default PaymentPage;













// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import axios from 'axios';

// const stripePromise = loadStripe('pk_test_51RItdQ2cvcZB0KBYX2b724zFZwHepEmPzl0FS6VNywclJA2w34upZkDXokwiEC6iuCbIVuVX3QotjxSNuQZh1NND00ocgrHSl5'); // 🔥 Your PUBLISHABLE KEY from Stripe dashboard

// const CheckoutForm = ({ clientSecret, bookingAmount }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!stripe || !elements) return;

//     const result = await stripe.confirmCardPayment(clientSecret, {
//       payment_method: {
//         card: elements.getElement(CardElement),
//       },
//     });

//     if (result.error) {
//       console.error(result.error.message);
//     } else {
//       if (result.paymentIntent.status === 'succeeded') {
//         alert('Payment Successful!');
//         // You can update backend Payment model here if needed
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
//       <CardElement />
//       <button 
//         type="submit" 
//         disabled={!stripe}
//         className="mt-6 w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
//       >
//         Pay ₹{(bookingAmount / 100).toFixed(2)}
//       </button>
//     </form>
//   );
// };

// const PaymentPage = () => {
//   const { bookingId } = useParams();
//   const [clientSecret, setClientSecret] = useState('');
//   const [bookingAmount, setBookingAmount] = useState(0);

//   useEffect(() => {
//     const fetchPaymentIntent = async () => {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         `http://localhost:5000/api/payments/create-payment-intent/${bookingId}`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setClientSecret(res.data.clientSecret);
//       setBookingAmount(res.data.amount);
//     };

//     fetchPaymentIntent();
//   }, [bookingId]);

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold text-center mb-6">Stripe Payment</h1>
//       {clientSecret && (
//         <Elements stripe={stripePromise}>
//           <CheckoutForm clientSecret={clientSecret} bookingAmount={bookingAmount} />
//         </Elements>
//       )}
//     </div>
//   );
// };




// export default PaymentPage;
