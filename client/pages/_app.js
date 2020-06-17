import 'bootstrap/dist/css/bootstrap.css';
// https://github.com/vercel/next.js/blob/canary/errors/css-global.md

import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  console.debug('-->>> AppComponent');

  return (
    <div className="container">
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  console.debug('-->>> AppComponent.getInitialProps');
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }

  return { pageProps, ...data }; // ...data contains now currentuser object
};
export default AppComponent;
