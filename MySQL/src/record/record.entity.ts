import { Artist } from '../artist/artist.entity.js';
import { Song } from '../song/song.entity.js';

export class Record {
  constructor(
    public name: string,
    public artists: Artist[],
    public songs: Song[],
    public id?: number
  ) {}
}
