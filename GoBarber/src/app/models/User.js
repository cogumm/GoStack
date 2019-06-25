import Sequelize, { Model } from 'sequelize';

class User extends Model {
	static init(sequelize) {
		super.init(
			{
				name: Sequelize.STRING,
				email: Sequelize.STRING,
				pass_hash: Sequelize.STRING,
				provider: Sequelize.BOOLEAN,
			},
			{
				sequelize,
			}
		);
	}
}

export default User;
