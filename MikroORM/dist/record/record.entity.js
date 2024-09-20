var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, Collection, ManyToMany, OneToMany, Cascade, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import { Artist } from '../artist/artist.entity.js';
import { Song } from '../song/song.entity.js';
export let Record = class Record extends BaseEntity {
    constructor() {
        super(...arguments);
        this.artists = new Collection(this);
        this.songs = new Collection(this);
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Record.prototype, "name", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Date)
], Record.prototype, "release_date", void 0);
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", String)
], Record.prototype, "genre", void 0);
__decorate([
    ManyToMany(() => Artist, (artist) => artist.records),
    __metadata("design:type", Object)
], Record.prototype, "artists", void 0);
__decorate([
    OneToMany(() => Song, (song) => song.record, {
        cascade: [Cascade.ALL],
    }),
    __metadata("design:type", Object)
], Record.prototype, "songs", void 0);
Record = __decorate([
    Entity()
], Record);
//# sourceMappingURL=record.entity.js.map