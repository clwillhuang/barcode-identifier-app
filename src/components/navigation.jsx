import { Container, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'react-bootstrap';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import { Link, useNavigate } from 'react-router-dom';
import { appName, generateHeaders, hasSignInCookie, urlRoot } from '../url';
import styles from './navigation.module.css'
import Cookies from 'js-cookie'
import { useCallback, useEffect, useState } from 'react';

function NavigationBar () {

    const navigate = useNavigate();

	const [loginData, setLoginData] = useState(undefined);

	useEffect(() => {
		if (!hasSignInCookie()) 
			return;
		else 
		fetch(`${urlRoot}/users/`, {
			mode: 'cors',
			credentials: 'include',
			headers: generateHeaders({})
		})
            .then(response => {
				if (response.ok) {
					return response.json();
				} else {
					return undefined;
					
				}
			})
			.then(data => {
				if (data) {
					setLoginData(data);
				}
				else {
					console.log('deleted cookie')
					if (Cookies.get('knox')) {
						Cookies.remove('knox', {path: '/'})
					}
					setLoginData({
						username: 'not'
					});
				}
			})
			.catch()
	}, [hasSignInCookie()])

	const renderUserInformation = useCallback(() => {
		if (!loginData || loginData.username === 'not') {
			return(
				<Nav>
					<NavItem>
						<NavLink as={Link} to='/login'>Login</NavLink>
					</NavItem>
				</Nav>
			)
		} else if (loginData) {
			return(
				<Nav>
					<p className={styles.loggedIn}>Signed in as {loginData.username}</p>
					<NavItem>
						<NavLink as={Link} to='/logout'>Logout</NavLink>
					</NavItem>
				</Nav>
			)
		}
	}, [loginData])

    return(
        <Navbar bg='dark' variant='dark' expand='sm'>
			<Container>
				<NavbarBrand className={styles.brand} onClick={() => navigate('/')}>{appName}</NavbarBrand>
				<Navbar.Toggle aria-controls="basic-navbar-nav"/>
				<NavbarCollapse id="basic-navbar-nav">
					<Nav className='me-auto'>
						<NavItem>
							<NavLink as={Link} to='/libraries'>Libraries</NavLink>
						</NavItem>
						<NavItem>
							<NavLink as={Link} to='/blast'>Run</NavLink>
						</NavItem>
						<NavItem>
							<NavLink href='/docs'>Documentation</NavLink>
						</NavItem>
						<NavItem>
							<NavLink as={Link} to='/credits'>About</NavLink>
						</NavItem>
						<NavItem>
							<NavLink as={Link} to='/api-docs'>API</NavLink>
						</NavItem>
					</Nav>
					{renderUserInformation()}
				</NavbarCollapse>
			</Container>
		</Navbar>
    )
}

export default NavigationBar;