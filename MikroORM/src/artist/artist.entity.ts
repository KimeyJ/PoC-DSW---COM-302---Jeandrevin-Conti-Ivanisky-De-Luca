import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import { Record } from '../record/record.entity.js';

@Entity()
export class Artist extends BaseEntity {
  @Property({ nullable: true })
  name!: string;

  @Property()
  age!: number;

  @ManyToMany(() => Record)
  records = new Collection<Record>(this);
}
