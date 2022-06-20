import Link from "next/link";
import { Container, Heading, Navbar } from "react-bulma-components";

function LayoutNavbar() {
  return (
    <Navbar color="primary">
      <Container>
        <Navbar.Brand>
          <Navbar.Item href="/">
            <Heading size={3}>ChainsPlorer</Heading>
          </Navbar.Item>
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Item href="/">
            Chains
          </Navbar.Item>
          <Navbar.Item href="/exchanges">
            Exchanges
          </Navbar.Item>
        </Navbar.Menu>
      </Container>
    </Navbar>
  );
}

export default LayoutNavbar;
