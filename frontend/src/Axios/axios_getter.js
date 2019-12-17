import axios from 'axios';


export const getAllItems = () => {
  return axios.get('http://coffeeclub.princeton.edu/alpha2/customer/menu')
      .then(res => {
        return res.data;
      });
}

export const postMakeOrder = (id, update) => {
  const url = 'http://coffeeclub.princeton.edu/alpha2/customer/' + id + '/placeorder';
  return axios.post(url, update, { withCredentials:true })
      .then(res => {
        return res.data;
     });
}

export const getBaristaOrders = () => {
  return axios.get('http://coffeeclub.princeton.edu/alpha2/barista/getorders', { withCredentials:true })
      .then(res => {
        return res.data;
      });
}

export const postInProgress = (id) => {
  const url = 'http://coffeeclub.princeton.edu/alpha2/barista/' + id + '/inprogress';
  axios.post(url, { withCredentials:true })
      .then(res => {
      });
}

export const postComplete = (id) => {
  const url = 'http://coffeeclub.princeton.edu/alpha2/barista/' + id + '/complete'
  axios.post(url, { withCredentials:true })
      .then(res => {
      });
}

export const postPaid = (id) => {
  const url = 'http://coffeeclub.princeton.edu/alpha2/barista/' + id + '/paid'
  axios.post(url, { withCredentials:true })
      .then(res => {
      });
}

export const getHistory = (netid) => {
  const url = 'http://coffeeclub.princeton.edu/alpha2/customer/' + netid + '/orderhistory'
  return axios.get(url, { withCredentials:true })
    .then(res => {
      console.log(res.data)
      return res.data;
    })
}

export const getDayHistory = () => {
  return axios.get('http://coffeeclub.princeton.edu/alpha2/barista/getdayhistory', { withCredentials:true })
      .then(res => {
        return res.data;
      });
}

export const getAllHistory = () => {
  return axios.get('http://coffeeclub.princeton.edu/alpha2/barista/getallhistory', { withCredentials:true })
      .then(res => {
        return res.data;
      });
}

export const authenticate = () => {
  return axios.get('http://coffeeclub.princeton.edu/alpha2/authenticate')
      .then(res => {
        return res.data;
      });
}

export const getUser = () => {
  return axios.get('http://coffeeclub.princeton.edu/alpha2/getuser', { withCredentials:true })
      .then(res => {
        return res.data;
      });
}

export const baristaLogin = (data) => {
  return axios.post('http://coffeeclub.princeton.edu/alpha2/barista/authenticate', data, {withCredentials:true})
      .then(res => {
      });
}

export const baristaGetUser = () => {
  return axios.get('http://coffeeclub.princeton.edu/alpha2/barista/getuser', {withCredentials:true})
      .then(res => {
        return res.data;
      });
}

export const clientLogout = () => {
  return axios.get('http://coffeeclub.princeton.edu/alpha2/logout', {withCredentials:true})
      .then(res => {
        return res.data;
      });
}

export const baristaLogout = () => {
  return axios.get('http://coffeeclub.princeton.edu/alpha2/barista/logout', {withCredentials:true})
      .then(res => {
        return res.data;
      });
}

export const getStock = (item) => {
  const url = 'http://coffeeclub.princeton.edu/alpha2/barista/' + item + '/getstock';
  return axios.get(url)
      .then(res => {
        return res.data;
      });
}

export const changeStock = (item) => {
  const url = 'http://coffeeclub.princeton.edu/alpha2/barista/' + item + '/changestock';
  return axios.post(url, {withCredentials:true})
      .then(res => {
        return res.data;
      });
}
