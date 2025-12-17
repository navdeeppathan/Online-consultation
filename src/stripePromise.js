// src/stripePromise.js
import { loadStripe } from "@stripe/stripe-js";

// Replace this with your Stripe test publishable key
// Load Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51S7ptwHWgCuPKYcQXBb2QXKaGpqDs5LesQZTBlTepxGKXKxA8ln9H0bs37mo1durlZJyxL1jtvb5hOmPoKzJTtiy002WvEG6y9"
); // Replace with your key

export default stripePromise;
