// this page to be visited by a logged in user
// goal is to get meta data of a ticket and create a ticket in the database
// fields of the form are:
// [1] title, [2] price

import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { errors, doRequest } = useRequest({
    url: '/api/tickets/',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => {
      Router.push('/');
    },
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Create a Ticket</h1>
      <div className="form-group">
        <label>Title</label>
        <input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Price</label>
        <input
          onBlur={onBlur}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
          value={price}
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary">Add Ticket</button>
    </form>
  );
};

export default NewTicket;
