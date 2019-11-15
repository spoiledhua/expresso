import axios from 'axios';

export const getLastOrder = () => {
  return axios.get('http://localhost:8080/customer/orderinfo')
      .then(res => {
        return res.data[0];
      });
}

export const getAllItems = () => {
  return axios.get('http://localhost:8080/customer/menu')
      .then(res => {
        return res.data;
      })
}

export const postMakeOrder = (update) => {
  axios.post('http://localhost:8080/customer/makeorder', update)
      .then(res => {
     });
}
