import { Layout } from './components/Layout/Layout';
import { LoginScreen } from './components/LoginScreen/LoginScreen';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { userEmail } = useAuth();

  return (
    <>
      {userEmail ? <Layout /> : <LoginScreen />}
    </>
  );
}

export default App;
