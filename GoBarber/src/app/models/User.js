import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
				email: Sequelize.STRING,
				// Campo virtual, só existe no lado do código e não na base
				pass: Sequelize.VIRTUAL,
				pass_hash: Sequelize.STRING,
				provider: Sequelize.BOOLEAN,
			},
			{
				sequelize,
			}
		);
		// Trexo de código que será executado antes de qualquer save em um usuário
		this.addHook('beforeSave', async user => {
			if (user.pass) {
				user.pass_hash = await bcrypt.hash(user.pass, 8);
			}
		});
		return this;
	}

	// Método para chegar a senha
	checkPassword(pass) {
		return bcrypt.compare(pass, this.pass_hash);
	}
}

export default User;
