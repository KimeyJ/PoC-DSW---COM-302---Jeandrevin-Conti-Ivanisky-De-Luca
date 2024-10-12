import { Record } from './record.entity.js';
import { orm } from '../shared/orm.js';
const em = orm.em;
function sanitizeRecordInput(req, res, next) {
    req.body.sanitizedInput = {
        id: req.body.id,
        name: req.body.name,
        release_date: req.body.release_date,
        genre: req.body.genre,
        artists: req.body.artists,
        songs: req.body.songs
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
        const records = await em.find(Record, {}, {
            populate: ['songs', 'artists'],
        });
        res.status(200).json({ message: 'Found all records', data: records });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function findOne(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const records = await em.find(Record, { id }, {
            populate: ['songs', 'artists'],
        });
        res.status(200).json({ message: 'Found record', data: records });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function add(req, res) {
    try {
        const records = em.create(Record, req.body.sanitizedInput);
        await em.flush();
        res.status(201).json({ message: 'Record created', data: records });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function update(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const RecordToUpdate = await em.findOneOrFail(Record, { id });
        em.assign(RecordToUpdate, req.body.sanitizedInput);
        await em.flush();
        res.status(200).json({ message: 'Record updated', data: RecordToUpdate });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function remove(req, res) {
    try {
        const id = Number.parseInt(req.params.id);
        const record = em.getReference(Record, id);
        await em.removeAndFlush(record);
        res.status(200).json({ message: 'Record deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export { sanitizeRecordInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=record.controller.js.map