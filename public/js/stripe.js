import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51H1z3NDnhHNdBPc2DImWZaS96y6YXYLNdiEaxn7929zL8eaJoxQFPJvL7XMrVsQPounXIMM9A8L5JxgwY4inwp0H00rBLmCInB'
);

export const purchaseProduct = async productID => {
  try {
    // Get session from server
    const session = await axios(
      `/api/v1/purchases/checkout-session/${productID}`
    );

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

    // Create checkout form and charge credit card
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
