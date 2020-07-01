import axios from 'axios';
import { showAlert } from './alerts';

export const updateProduct = async (data, id) => {
  try {
    const url = `/api/v1/products/${id}`;
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Product updated successfully!');
      window.setTimeout(() => {
        location.assign('/me/listings');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteProduct = async id => {
  try {
    const url = `/api/v1/products/${id}`;

    const res = await axios({
      method: 'DELETE',
      url,
    });

    console.log(res.status);

    if (res.status === 204) {
      showAlert('success', 'Product deleted successfully!');
      window.setTimeout(() => {
        location.assign('/me/listings');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
