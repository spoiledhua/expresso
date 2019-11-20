import axios from 'axios';

const headers = {
  'Access-Control-Allow-Origin': '*'
}

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
  axios.post('http://localhost:8080/customer/placeorder', update, { headers: headers})
      .then(res => {
     });
}

export const getBaristaOrders = () => {
  return axios.get('http://localhost:8080/barista/getorders')
      .then(res => {
        return res.data;
      });
}

export const postInProgress = (id) => {
  const url = 'http://localhost:8080/barista/' + id + '/inprogress'
  axios.post(url)
      .then(res => {
      });
}

export const postComplete = (id) => {
  const url = 'http://localhost:8080/barista/' + id + '/complete'
  axios.post(url)
      .then(res => {
      });
}
