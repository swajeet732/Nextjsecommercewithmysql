// src/pages/signup.js
import { useDispatch } from 'react-redux';
import SignupForm from '@/components/pages/signuppage/signup';
import { register } from '@/redux/actions/signup';

const SignupPage = () => {
  const dispatch = useDispatch();

  const handleSignup = (userData) => {
    dispatch(register(userData));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Sign Up</h1>
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
};

export default SignupPage;
