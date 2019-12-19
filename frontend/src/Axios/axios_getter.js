import axios from 'axios';
axios.defaults.withCredentials = true;

let token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NzY2MTg2MzcsIm5iZiI6MTU3NjYxODYzNywianRpIjoiMjUyY2QyODAtNGM3Mi00NmUwLTk3MDQtN2Y5MGQ2YzljYTY0IiwiZXhwIjoxNTc2NjE5NTM3LCJpZGVudGl0eSI6ImNjX2JhcmlzdGEiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ._wJ4Y2mgl7KAk6024GY3DxIGHGFysaIWvTf6SJZdSF4';

export const getAllItems = () => {
  return axios.get('http://localhost:8080/customer/menu')
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

export const getBaristaOrders = () => {
  return axios.get('http://localhost:8080/barista/getorders', {
    headers: {"Authorization": "Bearer " + token}
  }).then(res => {
        return res.data;
      });
}

export const postInProgress = (id) => {
  const url = 'http://localhost:8080/barista/' + id + '/inprogress';
  axios.post(url, id, {
    headers: {"Authorization": "Bearer " + token}
  })
      .then(res => {
      });
}

export const postComplete = (id) => {
  const url = 'http://localhost:8080/barista/' + id + '/complete'
  axios.post(url, id, {
    headers: {"Authorization": "Bearer " + token}
  })
      .then(res => {
      });
}

export const postPaid = (id) => {
  const url = 'http://localhost:8080/barista/' + id + '/paid'
  axios.post(url, id, {
    headers: {"Authorization": "Bearer " + token}
  })
      .then(res => {
      });
}

export const getHistory = (netid) => {
  const url = 'http://localhost:8080/customer/' + netid + '/orderhistory'
  return axios.get(url)
    .then(res => {
      return res.data;
    })
}

export const getDayHistory = () => {
  return axios.get('http://localhost:8080/barista/getdayhistory', {
    headers: {"Authorization": "Bearer " + token}
  }).then(res => {
        return res.data;
      });
}

export const getAllHistory = () => {
  return axios.get('http://localhost:8080/barista/getallhistory', {
    headers: {"Authorization": "Bearer " + token}
  }).then(res => {
        return res.data;
      });
}

export const authenticate = () => {
  return axios.get('http://localhost:8080/authenticate')
      .then(res => {
        return res.data;
      });
}

export const getUser = () => {
  return axios.get('http://localhost:8080/getuser')
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

export const baristaGetUser = () => {
  return axios.get('http://localhost:8080/barista/getuser')
      .then(res => {
        return res.data;
      });
}

export const clientLogout = () => {
  return axios.get('http://localhost:8080/logout')
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

export const getStock = (item) => {
  const url = 'http://localhost:8080/barista/' + item + '/getstock';
  return axios.get(url, {
    headers: {"Authorization": "Bearer " + token}
  })
      .then(res => {
        return res.data;
      });
}

export const changeStock = (item) => {
  const url = 'http://localhost:8080/barista/' + item + '/changestock';
  return axios.post(url,item, {
    headers: {"Authorization": "Bearer " + token}
  })
      .then(res => {
        return res.data;
      });
}
