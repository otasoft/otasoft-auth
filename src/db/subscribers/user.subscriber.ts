import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';

import { UserEntity } from '../entities';
import { LogRepository } from '../repositories';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor(
    connection: Connection,
    private readonly logRepository: LogRepository,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return UserEntity;
  }

  async afterInsert(event: InsertEvent<UserEntity>) {
    const newLog = this.logRepository.create({
      entity_name: 'user',
      event_name: 'after_insert',
      record_id: event.entity.id,
      record_value: event.entity.email,
      timestamp: new Date(),
    })

    try {
      await newLog.save()
    } catch (error) {
      console.log('error when logging after insert event')
    }
  }

  async beforeUpdate(event: UpdateEvent<UserEntity>) {
    const newLog = this.logRepository.create({
      entity_name: 'user',
      event_name: 'before_update',
      record_id: event.entity.id,
      record_value: event.entity.email,
      timestamp: new Date(),
    })

    try {
      await newLog.save()
    } catch (error) {
      console.log('error when logging before update event')
    }
  }

  async afterUpdate(event: UpdateEvent<UserEntity>) {
    const newLog = this.logRepository.create({
      entity_name: 'user',
      event_name: 'after_update',
      record_id: event.entity.id,
      record_value: event.entity.email,
      timestamp: new Date(),
    })

    try {
      await newLog.save()
    } catch (error) {
      console.log('error when logging after update event')
    }
  }

  async beforeRemove(event: RemoveEvent<UserEntity>) {
    const newLog = this.logRepository.create({
      entity_name: 'user',
      event_name: 'before_delete',
      record_id: event.entity.id,
      record_value: event.entity.email,
      timestamp: new Date(),
    })

    try {
      await newLog.save()
    } catch (error) {
      console.log('error when logging before delete event')
    }
  }
}
