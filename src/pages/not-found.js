import Wrapper from '../components/wrapper';

function NotFound() {
	return (
		<Wrapper>
			<div>
				<h1>Error 404: Page not found</h1>
				<strong>Sorry, we could not find the page you were looking for.</strong>
                <p>Check the website link and try reloading the page.</p>
			</div>
		</Wrapper>
	);
}

export default NotFound;
