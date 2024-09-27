import { RecordRepository } from './record.repository.js';
import { Record } from './record.entity.js';
const repository = new RecordRepository();
function sanitizeRecordInput(req, res, next) {
    req.body.sanitizedInput = {
        name: req.body.name,
        artists: req.body.artists,
        songs: req.body.songs,
        artistsID: req.body.artistIds,
    };
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key];
        }
    });
    next();
}
async function findAll(req, res) {
    res.json({ data: await repository.findAll() });
}
async function findOne(req, res) {
    const record = await repository.findOne({ id: req.params.id });
    if (record === undefined) {
        return res.status(404).send({ message: 'Record not found' });
    }
    else {
        res.json({ data: record });
    }
}
async function add(req, res) {
    const input = req.body.sanitizedInput;
    const recordin = new Record(input.name, input.artists, input.songs);
    const recordInput = {
        record: recordin,
        artistIds: input.artistsID,
    };
    const record = await repository.add(recordInput);
    return res.status(201).send({ message: 'Record created', data: record });
}
async function update(req, res) {
    const record = await repository.update(req.params.id, req.body.sanitizedInput);
    if (record === undefined) {
        return res.status(404).send({ message: 'Record not found' });
    }
    else {
        res.status(200).send({ message: 'Record updated', data: record });
    }
}
async function remove(req, res) {
    const id = req.params.id;
    const record = await repository.delete({ id });
    if (record === undefined) {
        res.status(404).send({ message: 'Record not found' });
    }
    else {
        res.status(200).send({ message: 'Record deleted' });
    }
}
export { sanitizeRecordInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=record.controller.js.map