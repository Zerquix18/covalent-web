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
      </Container>
    </Navbar>
  );
}

export default LayoutNavbar;
