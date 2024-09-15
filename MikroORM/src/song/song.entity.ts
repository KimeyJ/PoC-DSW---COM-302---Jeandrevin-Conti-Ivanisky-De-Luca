import { Entity, ManyToOne, Property, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../shared/baseEntity.entity.js";
import { Record } from "../record/record.entity.js";


@Entity()
export class Song extends BaseEntity{
    @Property({nullable: false})
    name !: string
    @Property({nullable : false})
    duration !: number

    @ManyToOne(() => Record, {nullable: false})
    record !: Rel<Record>;
}