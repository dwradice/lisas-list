import axios from 'axios';
import { showAlert } from './alerts';

export const postProduct = async (name, price, category) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:1032/api/v1/products/postProduct',
      data: {
        name,
        price,
        category,
      },
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
