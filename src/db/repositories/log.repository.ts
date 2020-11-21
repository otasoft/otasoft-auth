import { EntityRepository, Repository } from "typeorm";
import { LogEntity } from "../entities";

@EntityRepository(LogEntity)
export class LogRepository extends Repository<LogEntity> {}