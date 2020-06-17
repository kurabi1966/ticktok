import Link from 'next/link';

const LandingPage = ({ tickets, currentUser }) => {
  console.debug('-->>> LandingPage');
  if (tickets.length === 0) {
    return <h3>No tickets</h3>;
  }
  const ticketList = () => {
    return tickets.map((ticket) => {
      return (
        <tr key={ticket.id}>
          <td>
            <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
              <a>{ticket.title}</a>
            </Link>
          </td>
          <td>${ticket.price}</td>
        </tr>
      );
    });
  };
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList()}</tbody>
      </table>
    </div>
  );
  // const cardFooter = (ticket) => {
  //   if (currentUser && ticket.userId === currentUser.id) {
  //     return (
  //       <div className="card-footer bg-dark">
  //         <Link href="/tickets/edit">
  //           <a className="card-link">Edit</a>
  //         </Link>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div className="card-footer bg-primary">
  //         <Link href="/tickets/buy">
  //           <a className="card-link text-white">Buy</a>
  //         </Link>
  //       </div>
  //     );
  //   }
  // };

  // return (
  //   <div>
  //     <h1>Tickets</h1>
  //     {/* <div className="card-group"> */}
  //     {tickets.map((ticket) => {
  //       return (
  //         <div
  //           key={ticket.id}
  //           className="card float-left"
  //           style={{ width: '18rem', margin: '5px' }}
  //         >
  //           <div className="card-body">
  //             <h5 className="card-title">{ticket.title}</h5>
  //             <h6 className="card-subtitle mb-2 text-muted">
  //               Price: ${ticket.price}
  //             </h6>
  //           </div>
  //           {cardFooter(ticket)}
  //         </div>
  //       );
  //     })}
  //   </div>
  //   // </div>
  // );
};
LandingPage.getInitialProps = async (context, client, currentUser) => {
  console.debug('-->>> LandingPage.getInitialProps');
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};
export default LandingPage;
