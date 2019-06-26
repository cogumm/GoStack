import User from '../models/User';

class UserController {
	async store(req, res) {
		const userExists = await User.findOne({
			where: { email: req.body.email },
		});
		if (userExists) {
			return res.status(400).json({ error: 'Usuário já existe.' });
		}

		const { id, name, email, provider } = await User.create(req.body);

		return res.json({
			id,
			name,
			email,
			provider,
		});
	}

	async update(req, res) {
		const { email, oldPass } = req.body;
		const user = await User.findByPk(req.userId);
		/* ! == diferente */
		if (email !== user.email) {
			const userExists = await User.findOne({ where: { email } });

			if (userExists) {
				return res.status(400).json({ error: 'Usuário já existe.' });
			}
		}
		// Verificação se a senha antiga é igual a nova senha
		if (oldPass && !(await user.checkPassword(oldPass))) {
			return res.status(401).json({ error: 'A senha não coincide.' });
		}
		// Se tudo estiver ok, atualiza o usuário
		const { id, name, provider } = await user.update(req.body);
		return res.json({
			id,
			name,
			email,
			provider,
		});
	}
}

export default new UserController();
