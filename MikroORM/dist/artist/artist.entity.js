var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import { Record } from '../record/record.entity.js';
export let Artist = class Artist extends BaseEntity {
    constructor() {
        super(...arguments);
        this.records = new Collection(this);
    }
};
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Artist.prototype, "name", void 0);
__decorate([
    Property(),
    __metadata("design:type", Number)
], Artist.prototype, "age", void 0);
__decorate([
    ManyToMany(() => Record),
    __metadata("design:type", Object)
], Artist.prototype, "records", void 0);
Artist = __decorate([
    Entity()
], Artist);
//# sourceMappingURL=artist.entity.js.map