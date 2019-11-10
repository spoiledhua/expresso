import axios from 'axios';

export const getOrderInfo = (attribute) => {
  return axios.get('http://localhost:8080/customer/orderinfo')
      .then(res => {
        return res.data[0][attribute];
      });
}

export const postMakeOrder = (update) => {
  axios.post('http://localhost:8080/customer/makeorder', update)
      .then(res => {
     });
}
