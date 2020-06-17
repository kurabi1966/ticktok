import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
import Link from 'next/link';
export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { errors, doRequest } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: (res) => {
      console.log(res);
      Router.push('/');
    },
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <div className="form-group">
          <label>Email Address</label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            value={email}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            value={password}
            className="form-control"
            type="password"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Sign In</button>
        <div>
          <Link href="/auth/signup">
            <a> Don't have an account? Sign Up</a>
          </Link>
        </div>
      </form>
    </div>
  );
};
