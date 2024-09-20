import { orm } from '../shared/orm.js';
import { Song } from './song.entity.js';
const em = orm.em;
function sanitizedSongInput(req, res, next) {
    req.body.sanitizedInput = {
        id: req.body.id,
        name: req.body.name,
        duration: req.body.duration,
        record: req.body.record,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    try {
        const songs = await em.find(Song, {}, {
            populate: ['record'],
        });
        res.status(200).json({ message: 'Found all songs', data: songs });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const song = await em.find(Song, { id }, {
            populate: ['record'],
        });
        res.status(200).json({ message: 'Found song', data: song });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const song = em.create(Song, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'Song created', data: song });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const SongToUpdate = await em.findOneOrFail(Song, { id });
        em.assign(SongToUpdate, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: 'Song updated', data: SongToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const song = em.getReference(Song, id);
        await em.removeAndFlush(song);
        res.status(200).json({ message: 'Song deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizedSongInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=song.controller.js.map