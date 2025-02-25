import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
	async store(req, res) {
		// Validações com Yup
		const schema = Yup.object().shape({
			email: Yup.string()
				.email()
				.required(),
			pass: Yup.string().required(),
		});

		if (!(await schema.isValid(req.body))) {
			return res.status(400).json({ error: 'Falha na validação.' });
		}

		const { email, pass } = req.body;
		const user = await User.findOne({ where: { email } });

		if (!user) {
			return res.status(401).json({ error: 'Usuário não encontrado' });
		}

		if (!(await user.checkPassword(pass))) {
			return res.status(401).json({ error: 'Senha inválida.' });
		}

		const { id, name } = user;
		return res.json({
			user: {
				id,
				name,
				email,
			},

			token: jwt.sign({ id }, authConfig.secret, {
				expiresIn: authConfig.expiresIn,
			}),
		});
	}
}

export default new SessionController();
