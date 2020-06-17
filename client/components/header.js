import Link from 'next/link';

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sell Ticket', href: '/tickets/new' },
    currentUser && {
      label: `Sign Out (${currentUser.email})`,
      href: '/auth/signout',
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map((linkConfig, index) => {
      return (
        <li key={index} className="nav-item">
          <Link href={linkConfig.href}>
            <a className="nav-link">{linkConfig.label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Ticketing App</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex aligh-items-center">{links}</ul>
      </div>
    </nav>
  );
};
