
import ReactGA from 'react-ga4';

const initializeGA = () => {
  ReactGA.initialize('G-3QPZCCGZVD');
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export default initializeGA;
