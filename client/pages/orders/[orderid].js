import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  if (!order) {
    console.log(order);
    return <h3>Incorrect OrderId</h3>;
  }

  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments/',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => {
      Router.push('/orders');
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft}
      <div>
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey="pk_test_51ECVEMGWoubHTSRhO0GzY5c7twiKedPod3pOZqUgXSmaNIVKhVw5svVePETNk7s5g3gRwXTcyZbGuaGMbdjd5m4o009TMXhKjj"
          amount={order.ticket.price * 100}
          email={currentUser.email}
        />
      </div>
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client, currentUser) => {
  const { orderid } = context.query;
  // console.log('---- Order Id ---->> ', orderid);

  try {
    const { data } = await client.get(`/api/orders/${orderid}`);
    return { order: data };
  } catch (error) {
    console.log(error);
  }
  // return {};
};

export default OrderShow;
