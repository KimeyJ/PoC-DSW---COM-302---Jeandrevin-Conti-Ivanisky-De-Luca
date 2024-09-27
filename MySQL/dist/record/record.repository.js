import { pool } from '../shared/conn.js';
export class RecordRepository {
    async findAll() {
        const [records] = await pool.query('select * from records');
        for (const record of records) {
            const [artists] = await pool.query('select a.* from artists a inner join `artists-records` ar on ar.idArtist = a.id and ar.idrecord = ?', [record.id]);
            record.artists = artists;
        }
        return records;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [records] = await pool.query('select * from records where id = ?', [id]);
        if (records.length === 0) {
            return undefined;
        }
        const record = records[0];
        const [artists] = await pool.query('select a.* from artists a inner join `artists-records` ar on ar.idArtist = a.id where idRecord = ?', [record.id]);
        record.artists = artists;
        return record;
    }
    async add(recordInputWithArtists) {
        const { record, artistIds } = recordInputWithArtists;
        const { id, artists, ...recordRow } = record;
        const [result] = await pool.query('insert into records set ?', [record]);
        record.id = result.insertId;
        const values = artistIds.map((artistId) => [artistId, record.id]);
        await pool.query('insert into `artists-records` (idArtist,idRecord) values ?', [values]);
        return record;
    }
    async update(id, recordInput) {
        const recordId = Number.parseInt(id);
        const { artists, ...recordRow } = recordInput;
        await pool.query('update records set ? where id = ?', [
            recordRow,
            recordId,
        ]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const recordToDelete = await this.findOne(item);
            const recordId = Number.parseInt(item.id);
            await pool.query('delete ar from `artists-records`ar where idRecord = ?', recordId);
            await pool.query('delete from records where id = ?', recordId);
            return recordToDelete;
        }
        catch (error) {
            throw new Error('unable to delete record');
        }
    }
}
//# sourceMappingURL=record.repository.js.map