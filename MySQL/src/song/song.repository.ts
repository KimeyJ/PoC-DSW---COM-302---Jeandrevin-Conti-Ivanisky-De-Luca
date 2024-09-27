import { Repository } from '../shared/repository.js';
import { Song } from './song.entity.js';
import { pool } from '../shared/conn.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class SongRepository implements Repository<Song> {
  public async findAll(): Promise<Song[] | undefined> {
    const [songs] = await pool.query('select * from songs');
    /*for (const record of records as Record[]) {
      const [artists] = await pool.query(
        'select name from artists inner join artists-records where idRecord = ? and idArtist = id',
        [record.id]
      );
      record.artists = (artists as { name: string }[]).map(
        (artist) => artist.name
      );
    }*/

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
    /*const [artists] = await pool.query(
      'select name from artists inner join artists-records where idRecord = ? and idArtist = id',
      [record.id]
    );
    record.artists = (artists as { name: string }[]).map(
      (artist) => artist.name
    );*/
    return song;
  }

  public async add(songInput: Song): Promise<Song | undefined> {
    const { id, record, ...songRow } = songInput;
    const [result] = await pool.query<ResultSetHeader>(
      'insert into songs set ?',
      [songRow]
    );
    songInput.id = result.insertId;
    /*for (const artist of artists) {
        await pool.query('insert into artists-records set ?', {
        artistId: artist.id,
        name: record,
        });
    }*/ // REVISAR
    return songInput;
  }

  public async update(
    id: string,
    songInput: Song
  ): Promise<Song | undefined> {
    const songId = Number.parseInt(id);
    const { record, ...songRow } = songInput;
    await pool.query('update songs set ? where id = ?', [
      songRow,
      songId,
    ]);

    //await pool.query('delete from records where characterId = ?', [artistId]);

    /*if (records?.length > 0) {
      for (const record of records) {
        await pool.query('insert into records set ?', {
          artistId,
          record,
        });
      }
    }*/
    return await this.findOne({ id });
  }

  public async delete(item: { id: string }): Promise<Song | undefined> {
    try {
      const songToDelete = await this.findOne(item);
      const songId = Number.parseInt(item.id);
      /*await pool.query(
        'delete from artists-records where idRecord = ?',
        recordId
      );*/
      await pool.query('delete from songs where id = ?', songId);
      return songToDelete;
    } catch (error: any) {
      throw new Error('unable to delete song');
    }
  }
}
