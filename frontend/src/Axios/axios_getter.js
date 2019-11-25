import axios from 'axios';
//axios.defaults.withCredentials = true;

const headers = {
  'Access-Control-Allow-Credentials': true
}

export const getAllItems = () => {
  return axios.get('http://ccmobile.deptcpanel.princeton.edu/alpha/customer/menu')
      .then(res => {
        return res.data;
      });
}

export const postMakeOrder = (update) => {
  axios.post('http://ccmobile.deptcpanel.princeton.edu/alpha/customer/placeorder', update)
      .then(res => {
     });
}

export const getBaristaOrders = () => {
  return axios.get('http://ccmobile.deptcpanel.princeton.edu/alpha/barista/getorders')
      .then(res => {
        return res.data;
      });
}

export const postInProgress = (id) => {
  const url = 'http://ccmobile.deptcpanel.princeton.edu/alpha/barista/' + id + '/inprogress'
  axios.post(url)
      .then(res => {
      });
}

export const postComplete = (id) => {
  const url = 'http://ccmobile.deptcpanel.princeton.edu/alpha/barista/' + id + '/complete'
  axios.post(url)
      .then(res => {
      });
}

export const postPaid = (id) => {
  const url = 'http://ccmobile.deptcpanel.princeton.edu/alpha/barista/' + id + '/paid'
  console.log(url)
  axios.post(url)
      .then(res => {
      });
}

export const getHistory = (netid) => {
  const url = 'http://ccmobile.deptcpanel.princeton.edu/alpha/customer/' + netid + '/orderhistory'
  return axios.get(url)
    .then(res => {
      return res.data;
    })
}

export const getDayHistory = () => {
  return axios.get('http://ccmobile.deptcpanel.princeton.edu/alpha/barista/getdayhistory')
      .then(res => {
        return res.data;
      });
}

export const getAllHistory = () => {
  return axios.get('http://ccmobile.deptcpanel.princeton.edu/alpha/barista/getallhistory')
      .then(res => {
        return res.data;
      });
}

export const authenticate = () => {
  return axios.get('http://ccmobile.deptcpanel.princeton.edu/alpha/authenticate')
      .then(res => {
        return res.data;
      });
}

export const getUser = () => {
  return axios.get('http://ccmobile.deptcpanel.princeton.edu/alpha/getuser', { withCredentials:true })
      .then(res => {
        return res.data;
      });
}

export const baristaLogin = (data) => {
  return axios.post('http://ccmobile.deptcpanel.princeton.edu/alpha/barista/authenticate', data, {withCredentials:true})
    .then(res => {
      return res.data;
    });
}

export const baristaGetUser = () => {
  return axios.get('http://ccmobile.deptcpanel.princeton.edu/alpha/barista/getuser', {withCredentials:true})
      .then(res => {
        return res.data;
      });
}

export const clientLogout = () => {
  return axios.get('http://ccmobile.deptcpanel.princeton.edu/alpha/logout', {withCredentials:true})
      .then(res => {
        return res.data;
      });
}
