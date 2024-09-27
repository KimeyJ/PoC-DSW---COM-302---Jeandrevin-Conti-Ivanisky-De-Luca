import { Repository } from '../shared/repository.js';
import { Song } from './song.entity.js';
import { pool } from '../shared/conn.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class SongRepository implements Repository<Song> {
  public async findAll(): Promise<Song[] | undefined> {
    const [songs] = await pool.query('select * from songs');
    if (![songs].length) return undefined;
    for (const song of songs as Song[]) {
      const [record] = await pool.query(
        'select r.* from records r inner join songs s on r.id = s.record where s.id = ?',
        [song.id]
      );
      song.record = record as any;
    }
    return songs as Song[];
  }

  public async findOne(item: { id: string }): Promise<Song | undefined> {
    const id = Number.parseInt(item.id);
    const [songs] = await pool.query<RowDataPacket[]>(
      'select * from songs where id = ?',
      [id]
    );
    if (songs.length === 0) {
      return undefined;
    }
    const song = songs[0] as Song;
    const [record] = await pool.query(
      'select r.* from records r inner join songs s on r.id = s.record where s.id = ?',
      [song.id]
    );
    return song;
  }

  public async add(songInput: Song): Promise<Song | undefined> {
    const { id, ...songRow } = songInput;
    const [result] = await pool.query<ResultSetHeader>(
      'insert into songs set ?',
      [songRow]
    );
    songInput.id = result.insertId;
    return songInput;
  }

  public async update(id: string, songInput: Song): Promise<Song | undefined> {
    const songId = Number.parseInt(id);
    const { record, ...songRow } = songInput;
    await pool.query('update songs set ? where id = ?', [songRow, songId]);
    return await this.findOne({ id });
  }

  public async delete(item: { id: string }): Promise<Song | undefined> {
    try {
      const songToDelete = await this.findOne(item);
      const songId = Number.parseInt(item.id);
      await pool.query('delete from songs where id = ?', songId);
      return songToDelete;
    } catch (error: any) {
      throw new Error('unable to delete song');
    }
  }
}
