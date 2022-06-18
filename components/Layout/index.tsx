import { Container } from 'react-bulma-components';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <Container style={{ marginTop: 30 }}>
        { children }
      </Container>
    </div>
  );
}

export default Layout;
