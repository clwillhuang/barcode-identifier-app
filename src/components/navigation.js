import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'react-bootstrap';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import { Link, useNavigate } from 'react-router-dom';
import { appName } from '../url';


function NavigationBar () {

    const navigate = useNavigate();

    return(
        <Navbar bg='dark' variant='dark' expand='sm'>
				<Container>
					<NavbarBrand onClick={() => navigate('/')}>{appName}</NavbarBrand>
					<Navbar.Toggle aria-controls="basic-navbar-nav"/>
					<NavbarCollapse id="basic-navbar-nav">
						<Nav className='me-auto'>
							<NavItem>
								<NavLink as={Link} to='/database'>Database</NavLink>
							</NavItem>
							<NavItem>
								<NavLink as={Link} to='/blast'>Run</NavLink>
							</NavItem>
							<NavItem>
								<NavLink as={Link} to='/manual'>Manual</NavLink>
							</NavItem>
							<NavItem>
								<NavLink as={Link} to='/credits'>About</NavLink>
							</NavItem>
							<NavItem>
								<NavLink as={Link} to='/api-docs'>API</NavLink>
							</NavItem>
						</Nav>
					</NavbarCollapse>
				</Container>
			</Navbar>
    )
}

export default NavigationBar;