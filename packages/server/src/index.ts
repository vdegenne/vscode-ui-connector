import Koa from 'koa';
import {SERVER_DEFAULT_PORT} from 'shared/constants';

const app = new Koa();

app.listen(SERVER_DEFAULT_PORT, () => {
	console.log(
		`VSCode UI Connector Server listening at http://localhost:${SERVER_DEFAULT_PORT}/`
	);
});
