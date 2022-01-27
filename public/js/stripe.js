/*eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51KMXIJGG0YRkuCQl1DqfBCddkVEbd4zDvF1CmpFd38XpvqEoPzhJkH7OyAH1JFYwqHsrmKpnJIbKK6djM3X4v3jb00btiX6COY'
);

export const bookTour = async tourId => {
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert('error', err);
  }
};
