import { Repository } from '../shared/repository.js';
import { Artist } from './artist.entity.js';
import { pool } from '../shared/conn.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ArtistRepository implements Repository<Artist> {
  public async findAll(): Promise<Artist[] | undefined> {
    const [artists] = await pool.query('select * from artists');
    if (![artists].length) return undefined;
    for (const artist of artists as Artist[]) {
      const [records] = await pool.query(
        'select r.* from records r inner join `artists-records` ar on r.id = ar.idRecord where ar.idArtist = ?',
        [artist.id]
      );
      artist.records = records as any;
    }
    return artists as Artist[];
  }

  public async findOne(item: { id: string }): Promise<Artist | undefined> {
    const id = Number.parseInt(item.id);
    if (isNaN(id) || id < 0) {
      throw new Error('Invalid artist ID');
    }
    const [artists] = await pool.query<RowDataPacket[]>(
      'select * from artists where id = ?',
      [id]
    );
    if (artists.length === 0) {
      return undefined;
    }
    const artist = artists[0] as Artist;
    const [records] = await pool.query(
      'select r.* from records r inner join `artists-records` ar on r.id = ar.idRecord where ar.idArtist = ?',
      [artist.id]
    );
    artist.records = records as any;
    return artist;
  }

  public async add(artistInput: Artist): Promise<Artist | undefined> {
    const { id, records, ...artistRow } = artistInput;
    const [result] = await pool.query<ResultSetHeader>(
      'insert into artists set ?',
      [artistRow]
    );
    artistInput.id = result.insertId;
    /*for (const record of records) {
      await pool.query('insert into records set ?', {
        artistId: artistInput.id,
        name: record,
      });
    }*/

    return artistInput;
  }

  public async update(
    id: string,
    artistInput: Artist
  ): Promise<Artist | undefined> {
    const artistId = Number.parseInt(id);
    const { records, ...artistRow } = artistInput;
    await pool.query('update artists set ? where id = ?', [
      artistRow,
      artistId,
    ]);

    return await this.findOne({ id });
  }

  public async delete(item: { id: string }): Promise<Artist | undefined> {
    try {
      const artistToDelete = await this.findOne(item);
      const artistId = Number.parseInt(item.id);
      await pool.query(
        'delete r, ar from records r inner join `artists-records` ar on r.id = ar.idRecord where ar.idArtist = ?',
        artistId
      );
      await pool.query('delete from artists where id = ?', artistId);
      return artistToDelete;
    } catch (error: any) {
      throw new Error('unable to delete artist');
    }
  }
}
