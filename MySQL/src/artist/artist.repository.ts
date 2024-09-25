import { Repository } from '../shared/repository.js';
import { Artist } from './artist.entity.js';
import { pool } from '../shared/conn.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export class ArtistRepository implements Repository<Artist> {
  public async findAll(): Promise<Artist[] | undefined> {
    const [artists] = await pool.query('select * from artists');
    for (const artist of artists as Artist[]) {
      const [records] = await pool.query(
        'select name from records inner join artists-records where idArtist = ? and idRecord = id',
        [artist.id]
      );
      artist.records = (records as { name: string }[]).map(
        (record) => record.name
      );
    }

    return artists as Artist[];
  }

  public async findOne(item: { id: string }): Promise<Artist | undefined> {
    const id = Number.parseInt(item.id);
    const [artists] = await pool.query<RowDataPacket[]>(
      'select * from artists where id = ?',
      [id]
    );
    if (artists.length === 0) {
      return undefined;
    }
    const artist = artists[0] as Artist;
    const [records] = await pool.query(
      'select name from records inner join artists-records where idArtist = ? and idRecord = id',
      [artist.id]
    );
    artist.records = (records as { name: string }[]).map(
      (record) => record.name
    );
    return artist;
  }

  public async add(artistInput: Artist): Promise<Artist | undefined> {
    const { id, records, ...artistRow } = artistInput;
    const [result] = await pool.query<ResultSetHeader>(
      'insert into artists set ?',
      [artistRow]
    );
    artistInput.id = result.insertId;
    for (const record of records) {
      await pool.query('insert into characterItems set ?', {
        characterId: characterInput.id,
        itemName: item,
      });
    }

    return characterInput;
  }

  public async update(
    id: string,
    characterInput: Character
  ): Promise<Character | undefined> {
    const characterId = Number.parseInt(id);
    const { items, ...characterRow } = characterInput;
    await pool.query('update characters set ? where id = ?', [
      characterRow,
      characterId,
    ]);

    await pool.query('delete from characterItems where characterId = ?', [
      characterId,
    ]);

    if (items?.length > 0) {
      for (const itemName of items) {
        await pool.query('insert into characterItems set ?', {
          characterId,
          itemName,
        });
      }
    }
    return await this.findOne({ id });
  }

  public async delete(item: { id: string }): Promise<Character | undefined> {
    try {
      const characterToDelete = await this.findOne(item);
      const characterId = Number.parseInt(item.id);
      await pool.query(
        'delete from characterItems where characterId = ?',
        characterId
      );
      await pool.query('delete from characters where id = ?', characterId);
      return characterToDelete;
    } catch (error: any) {
      throw new Error('unable to delete character');
    }
  }
}
