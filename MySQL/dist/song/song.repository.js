import { pool } from '../shared/conn.js';
export class SongRepository {
    async findAll() {
        const [songs] = await pool.query('select * from songs');
        if (![songs].length)
            return undefined;
        for (const song of songs) {
            const [record] = await pool.query('select r.* from records r inner join songs s on r.id = s.record where s.id = ?', [song.id]);
            song.record = record;
        }
        return songs;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        const [songs] = await pool.query('select * from songs where id = ?', [id]);
        if (songs.length === 0) {
            return undefined;
        }
        const song = songs[0];
        const [record] = await pool.query('select r.* from records r inner join songs s on r.id = s.record where s.id = ?', [song.id]);
        return song;
    }
    async add(songInput) {
        const { id, ...songRow } = songInput;
        const [result] = await pool.query('insert into songs set ?', [songRow]);
        songInput.id = result.insertId;
        return songInput;
    }
    async update(id, songInput) {
        const songId = Number.parseInt(id);
        const { record, ...songRow } = songInput;
        await pool.query('update songs set ? where id = ?', [songRow, songId]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const songToDelete = await this.findOne(item);
            const songId = Number.parseInt(item.id);
            await pool.query('delete from songs where id = ?', songId);
            return songToDelete;
        }
        catch (error) {
            throw new Error('unable to delete song');
        }
    }
}
//# sourceMappingURL=song.repository.js.map