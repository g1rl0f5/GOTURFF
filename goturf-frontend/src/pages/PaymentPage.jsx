import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PaymentPage.css';

const BACKEND_URL = "https://goturff.onrender.com";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');

  const handleCheckout = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/payments/initiate-payment/${bookingId}`,
        { paymentMethod },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (paymentMethod === 'Cash') {
        alert('Booking confirmed with cash. You can view it in your bookings.');
        navigate('/my-bookings');
      } else {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Failed to initiate payment');
    }
    setLoading(false);
  };

  return (
    <div className="payment-container">
      {status === 'success' ? (
        <>
          <h1 className="payment-title">Payment Successful!</h1>
          <p>Your turf has been booked successfully. 🎉</p>
        </>
      ) : status === 'cancelled' ? (
        <>
          <h1 className="payment-title">Payment Cancelled</h1>
          <p>Payment was not completed. You can try again later.</p>
        </>
      ) : (
        <>
          <h1 className="payment-title">Proceed to Payment</h1>
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{' '}
              UPI
            </label>
            <label>
              <input
                type="radio"
                value="Credit Card"
                checked={paymentMethod === 'Credit Card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{' '}
              Credit Card
            </label>
            <label>
              <input
                type="radio"
                value="Debit Card"
                checked={paymentMethod === 'Debit Card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{' '}
              Debit Card
            </label>
            <label>
              <input
                type="radio"
                value="Cash"
                checked={paymentMethod === 'Cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />{' '}
              Cash at Venue
            </label>
          </div>
          <button onClick={handleCheckout} className="payment-button" disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </>
      )}
    </div>
  );
};

export default PaymentPage;




































// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import './PaymentPage.css';

// const BACKEND_URL = "https://goturff.onrender.com";

// const PaymentPage = () => {
//   const { bookingId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   // Read query parameters
//   const queryParams = new URLSearchParams(location.search);
//   const status = queryParams.get('status');

//   const handleCheckout = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token');
//     try {
//       const res = await axios.post(
//         `${BACKEND_URL}/api/payments/create-checkout-session/${bookingId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       window.location.href = res.data.url; // redirect to Stripe checkout
//     } catch (error) {
//       console.error('Payment failed:', error);
//       alert('Failed to initiate payment');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="payment-container">
//       {status === 'success' ? (
//         <>
//           <h1 className="payment-title">Payment Successful!</h1>
//           <p>Your turf has been booked successfully. 🎉</p>
//         </>
//       ) : status === 'cancelled' ? (
//         <>
//           <h1 className="payment-title">Payment Cancelled</h1>
//           <p>Payment was not completed. You can try again later.</p>
//         </>
//       ) : (
//         <>
//           <h1 className="payment-title">Proceed to Payment</h1>
//           <button onClick={handleCheckout} className="payment-button" disabled={loading}>
//             {loading ? 'Redirecting...' : 'Pay Now'}
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default PaymentPage;

