import {
  Entity,
  Property,
  Collection,
  ManyToMany,
  Rel,
  OneToMany,
  Cascade,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/baseEntity.entity.js';
import { Artist } from '../artist/artist.entity.js';
import { Song } from '../song/song.entity.js';

@Entity()
export class Record extends BaseEntity {
  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: true })
  release_date!: string;

  @Property({ nullable: false })
  genre!: string;

  //@ManyToMany(() => Artist, (artist) => artist.records)
  //artists = new Collection<Artist>(this);

  @OneToMany(() => Song, (song) => song.record, {
    cascade: [Cascade.ALL],
  })
  songs = new Collection<Song>(this);
}
