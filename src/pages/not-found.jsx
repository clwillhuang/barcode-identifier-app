import CustomHelmet from '../components/custom-helmet';
import Layout from '../components/layout';
import Wrapper from '../components/wrapper';

function NotFound() {
	return (
		<Wrapper>
			<CustomHelmet
				title='404 Not Found'
				description='We could not find the page you were looking for.'
				canonical='/'
			/>
			<Layout>
				<div>
					<h1>Error 404: Page not found</h1>
					<strong>Sorry, we could not find the page you were looking for.</strong>
					<p>Check the website link and try reloading the page.</p>
				</div>
			</Layout>
		</Wrapper>
	);
}

export default NotFound;
