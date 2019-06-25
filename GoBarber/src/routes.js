import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
	const user = await User.create({
		name: 'Gabriel CoGUMm',
		email: 'gabriel@cogumm.net',
		pass_hash: '123456',
	});
	res.json(user);
});

export default routes;
