import '../styles/globals.css'; // Adjust the path as necessary
import ReduxProvider from '../app/provider';


function MyApp({ Component, pageProps }) {
  return (
    <ReduxProvider>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}

export default MyApp;
