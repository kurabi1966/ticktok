import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const { errors, doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => {
      Router.push('/');
    },
  });

  useEffect(() => {
    doRequest();
    console.log('errors: ', errors);
  }, []);
  return <div>Signing you out...</div>;
};
