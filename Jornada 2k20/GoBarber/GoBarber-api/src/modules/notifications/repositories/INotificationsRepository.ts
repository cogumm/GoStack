import ICreateUserDTO from "../dtos/ICreateNotificationDTO";
import Nottification from "../infra/typeorm/schemas/Notification";

export default interface INotificationsRepository {
    create(data: ICreateUserDTO): Promise<Nottification>;
}
