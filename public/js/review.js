import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async (rating, content, seller, purchase) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews/',
      data: {
        rating,
        content,
        seller,
        purchase,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Created review!');
      window.setTimeout(() => {
        location.assign('/me/purchases');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
