import { ArtistRepository } from './artist.repository.js';
import { Artist } from './artist.entity.js';
const repository = new ArtistRepository();
function sanitizeArtistInput(req, res, next) {
    req.body.sanitizedInput = {
        name: req.body.name,
        age: req.body.age,
        records: req.body.records,
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
    const artist = await repository.findOne({ id: req.params.id });
    if (artist === undefined) {
        return res.status(404).send({ message: 'Artist not found' });
    }
    else {
        res.json({ data: artist });
    }
}
async function add(req, res) {
    const input = req.body.sanitizedInput;
    const artistInput = new Artist(input.name, input.age, input.records);
    const artist = await repository.add(artistInput);
    return res
        .status(201)
        .send({ message: 'Artist created', data: artist });
}
async function update(req, res) {
    const artist = await repository.update(req.params.id, req.body.sanitizedInput);
    if (artist === undefined) {
        return res.status(404).send({ message: 'Artist not found' });
    }
    else {
        res.status(200).send({ message: 'Artist updated', data: artist });
    }
}
async function remove(req, res) {
    const id = req.params.id;
    const artist = await repository.delete({ id });
    if (artist === undefined) {
        res.status(404).send({ message: 'Artist not found' });
    }
    else {
        res.status(200).send({ message: 'Artist deleted' });
    }
}
export { sanitizeArtistInput, findAll, findOne, add, update, remove };
//# sourceMappingURL=artist.controller.js.map