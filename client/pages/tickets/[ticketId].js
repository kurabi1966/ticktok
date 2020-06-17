import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const TicketShow = ({ ticket, currentUser }) => {
  if (!ticket) {
    return <h3>Incorrect ticket Id</h3>;
  }

  const { errors, doRequest } = useRequest({
    url: '/api/orders/',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      console.log(order.id);

      Router.push('/orders/[orderId]', `/orders/${order.id}`);
    },
  });

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Title: {ticket.title}</h5>
        <h4 className="card-subtitle mb-2 text-muted">
          Price: ${ticket.price}
        </h4>
        {errors}
        {currentUser.id !== ticket.userId ? (
          <button className="btn btn-primary" onClick={() => doRequest()}>
            Purchase
          </button>
        ) : (
          <button className="btn btn-primary">Edit</button>
        )}
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client, currentUser) => {
  console.debug('-->>> TicketShow.getInitialProps');
  try {
    const { data } = await client.get(`/api/tickets/${context.query.ticketId}`);
    return { ticket: data };
  } catch (error) {
    console.log(error);
  }

  return {};
};
export default TicketShow;
