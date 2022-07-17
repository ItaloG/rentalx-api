import { ICreateCarDTO } from "../dtos/IcreateCarsDTO";

interface ICarsRepository {
    create(data: ICreateCarDTO): Promise<void>
}

export { ICarsRepository };
