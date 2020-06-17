import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    const baseURL =
      'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local';
    return axios.create({ baseURL, headers: req.headers });
  }

  return axios.create({});
};
