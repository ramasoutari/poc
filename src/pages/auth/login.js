import { Helmet } from 'react-helmet-async';
// sections
import { JwtLoginView } from '../../sections/auth';

// ----------------------------------------------------------------------

export default function LoginPage() {


  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <JwtLoginView />
    </>
  );
}
