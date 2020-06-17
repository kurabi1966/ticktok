const OrderIndex = ({ orders, currentUser }) => {
  if (orders.length === 0) {
    return <h3>You do not have any Order!</h3>;
  }
  const orderList = () => {
    return orders.map((order) => {
      return (
        <tr key={order.id}>
          <td>{order.id}</td>
          <td>{order.ticket.id}</td>
          <td>{order.ticket.title}</td>
          <td>{order.ticket.price}</td>
        </tr>
      );
    });
  };
  return (
    <div>
      <h1>orders</h1>
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Order ID</th>
            <th>Ticket ID</th>
            <th>Ticket Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{orderList()}</tbody>
      </table>
    </div>
  );
};
OrderIndex.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/orders');
  return { orders: data };
};
export default OrderIndex;
