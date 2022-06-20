import { Container, Content, Footer } from 'react-bulma-components';
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
      <Footer style={{ marginTop: 20 }}>
        <Content textAlign="center">
          Built by Luis using Covalent
        </Content>
      </Footer>
    </div>
  );
}

export default Layout;
