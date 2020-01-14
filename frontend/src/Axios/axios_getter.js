import axios from 'axios';
axios.defaults.withCredentials = true;


export const getAllItems = (token) => {
  return axios.get('http://localhost:8080/customer/menu', {headers: {'Authorization': 'Bearer ' + token}})
      .then(res => {
        return res.data;
      });
}

export const postMakeOrder = (id, update) => {
  const url = 'http://localhost:8080/customer/' + id + '/placeorder';
  return axios.post(url, update)
      .then(res => {
        return res.data;
     });
}

export const getBaristaOrders = (token) => {
  return axios.get('http://localhost:8080/barista/getorders', {headers: {'Authorization': 'Bearer ' + token}})
      .then(res => {
        return res.data;
      });
}

export const postInProgress = async (id) => {
  const url = 'http://localhost:8080/barista/' + id + '/inprogress';
  let res = await axios.post(url);
  return res.data;
}

export const postComplete = async (id) => {
  const url = 'http://localhost:8080/barista/' + id + '/complete'
  let res = await axios.post(url);
  return res.data;
}

export const postPaid = async (id) => {
  const url = 'http://localhost:8080/barista/' + id + '/paid'
  let res = await axios.post(url);
  return res.data;
}

export const getHistory = (netid, token) => {
  const url = 'http://localhost:8080/customer/' + netid + '/orderhistory'
  return axios.get(url, {headers: {'Authorization': 'Bearer ' + token}})
    .then(res => {
      return res.data;
    });
}

export const contact = (message) => {
  return axios.post('http://localhost:8080/customer/contact', message)
      .then(res => {
        return res.data;
      });
}

export const getDayHistory = (token) => {
  return axios.get('http://localhost:8080/barista/getdayhistory', {headers: {'Authorization': 'Bearer ' + token}})
      .then(res => {
        return res.data;
      });
}

export const authenticate = () => {
  return axios.get('http://localhost:8080/customer/authenticate')
      .then(res => {
        return res.data;
      });
}

export const getUser = () => {
  return axios.get('http://localhost:8080/customer/getuser')
      .then(res => {
        return res.data;
      });
}

export const baristaLogin = (data) => {
  return axios.post('http://localhost:8080/barista/authenticate', data)
      .then(res => {
        return res.data;
      });
}

export const baristaGetUser = (token) => {
  return axios.get('http://localhost:8080/barista/getuser', {headers: {'Authorization': 'Bearer ' + token}})
      .then(res => {
        return res.data;
      });
}

export const clientLogout = () => {
  return axios.get('http://localhost:8080/customer/logout')
      .then(res => {
        return res.data;
      });
}

export const baristaLogout = () => {
  return axios.get('http://localhost:8080/barista/logout')
      .then(res => {
        return res.data;
      });
}

export const getStock = (item, token) => {
  const url = 'http://localhost:8080/barista/' + item + '/getstock';
  return axios.get(url, {headers: {'Authorization': 'Bearer ' + token}})
      .then(res => {
        return res.data;
      });
}

export const changeStock = (item) => {
  const url = 'http://localhost:8080/barista/' + item + '/changestock';
  return axios.post(url)
      .then(res => {
        return res.data;
      });
}

export const addItem = (item) => {
  return axios.post('http://localhost:8080/admin/addinventory', item)
      .then(res => {
        return res.data;
      });
}

export const deleteItem = (item, token) => {
  const url = 'http://localhost:8080/admin/' + item + '/deleteinventory';
  return axios.delete(url, {headers: {'Authorization': 'Bearer ' + token}})
      .then(res => {
        return res.data;
      });
}

export const checkAdmin = (token) => {
  return axios.get('http://localhost:8080/admin/checkstatus', {headers: {'Authorization': 'Bearer ' + token}})
      .then(res => {
        return res.data;
      });
}

export const loadInventory = (token) => {
  return axios.get('http://localhost:8080/barista/loadinventory', {headers: {'Authorization': 'Bearer ' + token}})
      .then(res => {
        return res.data;
      });
}

export const postStoreStatus = () => {
  return axios.post('http://localhost:8080/barista/storestatus')
      .then(res => {
        return res.data;
      });
}

export const getStoreStatus = (token) => {
  return axios.get('http://localhost:8080/customer/storestatus', {headers: {'Authorization': 'Bearer ' + token}})
      .then(res => {
        return res.data;
      });
}
