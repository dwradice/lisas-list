import axios from 'axios';
import { showAlert } from './alerts';

export const postProduct = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/products/postProduct',
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Product posted successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
