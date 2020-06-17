import { useState } from 'react';
import axios from 'axios';

export default ({ url, method, body, onSuccess }) => {
  // method should be http method {eg. get, post....}
  const [errors, setErrors] = useState(null);
  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Errors</h4>
          <ul className="my-0">
            {err.response.data.errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};
