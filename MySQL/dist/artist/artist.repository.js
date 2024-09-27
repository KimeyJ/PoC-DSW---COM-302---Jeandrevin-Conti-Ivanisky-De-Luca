import { pool } from '../shared/conn.js';
export class ArtistRepository {
    async findAll() {
        const [artists] = await pool.query('select * from artists');
        if (![artists].length)
            return undefined;
        for (const artist of artists) {
            const [records] = await pool.query('select r.* from records r inner join `artists-records` ar on r.id = ar.idRecord where ar.idArtist = ?', [artist.id]);
            artist.records = records;
        }
        return artists;
    }
    async findOne(item) {
        const id = Number.parseInt(item.id);
        if (isNaN(id) || id < 0) {
            throw new Error('Invalid artist ID');
        }
        const [artists] = await pool.query('select * from artists where id = ?', [id]);
        if (artists.length === 0) {
            return undefined;
        }
        const artist = artists[0];
        const [records] = await pool.query('select r.* from records r inner join `artists-records` ar on r.id = ar.idRecord where ar.idArtist = ?', [artist.id]);
        artist.records = records;
        return artist;
    }
    async add(artistInput) {
        const { id, records, ...artistRow } = artistInput;
        const [result] = await pool.query('insert into artists set ?', [artistRow]);
        artistInput.id = result.insertId;
        /*for (const record of records) {
          await pool.query('insert into records set ?', {
            artistId: artistInput.id,
            name: record,
          });
        }*/
        return artistInput;
    }
    async update(id, artistInput) {
        const artistId = Number.parseInt(id);
        const { records, ...artistRow } = artistInput;
        await pool.query('update artists set ? where id = ?', [
            artistRow,
            artistId,
        ]);
        return await this.findOne({ id });
    }
    async delete(item) {
        try {
            const artistToDelete = await this.findOne(item);
            const artistId = Number.parseInt(item.id);
            await pool.query('delete r, ar from records r inner join `artists-records` ar on r.id = ar.idRecord where ar.idArtist = ?', artistId);
            await pool.query('delete from artists where id = ?', artistId);
            return artistToDelete;
        }
        catch (error) {
            throw new Error('unable to delete artist');
        }
    }
}
//# sourceMappingURL=artist.repository.js.map