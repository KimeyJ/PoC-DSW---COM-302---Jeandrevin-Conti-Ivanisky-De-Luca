import { Repository } from '../shared/repository.js';
import { Record } from './record.entity.js';
import { pool } from '../shared/conn.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface RecordInputWithArtists extends Record {
  record: Record;
  artistIds: number[];
}

export class RecordRepository implements Repository<Record> {
  public async findAll(): Promise<Record[] | undefined> {
    const [records] = await pool.query('select * from records');
    for (const record of records as Record[]) {
      const [artists] = await pool.query(
        'select a.* from artists a inner join `artists-records` ar on ar.idArtist = a.id and ar.idrecord = ?',
        [record.id]
      );
      record.artists = artists as any;
    }

    return records as Record[];
  }

  public async findOne(item: { id: string }): Promise<Record | undefined> {
    const id = Number.parseInt(item.id);
    const [records] = await pool.query<RowDataPacket[]>(
      'select * from records where id = ?',
      [id]
    );
    if (records.length === 0) {
      return undefined;
    }
    const record = records[0] as Record;
    const [artists] = await pool.query(
      'select a.* from artists a inner join `artists-records` ar on ar.idArtist = a.id where idRecord = ?',
      [record.id]
    );
    record.artists = artists as any;
    return record;
  }

  public async add(
    recordInputWithArtists: RecordInputWithArtists
  ): Promise<Record | undefined> {
    const { record, artistIds } = recordInputWithArtists;
    const { id, artists, ...recordRow } = record;
    const [result] = await pool.query<ResultSetHeader>(
      'insert into records set ?',
      [record]
    );
    record.id = result.insertId;
    const values = artistIds.map((artistId) => [artistId, record.id]);
    await pool.query(
      'insert into `artists-records` (idArtist,idRecord) values ?',
      [values]
    );
    return record;
  }

  public async update(
    id: string,
    recordInput: Record
  ): Promise<Record | undefined> {
    const recordId = Number.parseInt(id);
    const { artists, ...recordRow } = recordInput;
    await pool.query('update records set ? where id = ?', [
      recordRow,
      recordId,
    ]);

    return await this.findOne({ id });
  }

  public async delete(item: { id: string }): Promise<Record | undefined> {
    try {
      const recordToDelete = await this.findOne(item);
      const recordId = Number.parseInt(item.id);
      await pool.query(
        'delete ar from `artists-records`ar where idRecord = ?',
        recordId
      );
      await pool.query('delete from records where id = ?', recordId);
      return recordToDelete;
    } catch (error: any) {
      throw new Error('unable to delete record');
    }
  }
}
