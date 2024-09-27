import { Request, Response, NextFunction } from 'express';
import { SongRepository } from './song.repository.js';
import { Song } from './song.entity.js';

const repository = new SongRepository();

function sanitizeSongInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
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

async function findAll(req: Request, res: Response) {
  res.json({ data: await repository.findAll() });
}

async function findOne(req: Request, res: Response) {
  const song = await repository.findOne({ id: req.params.id });
  if (song === undefined) {
    return res.status(404).send({ message: 'Song not found' });
  } else {
    res.json({ data: song });
  }
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;

  const songInput = new Song(input.name, input.duration, input.record);

  const song = await repository.add(songInput);
  return res.status(201).send({ message: 'Song created', data: song });
}

async function update(req: Request, res: Response) {
  const song = await repository.update(req.params.id, req.body.sanitizedInput);

  if (song === undefined) {
    return res.status(404).send({ message: 'Song not found' });
  } else {
    res.status(200).send({ message: 'Song updated', data: song });
  }
}

async function remove(req: Request, res: Response) {
  const id = req.params.id;
  const song = await repository.delete({ id });

  if (song === undefined) {
    res.status(404).send({ message: 'Song not found' });
  } else {
    res.status(200).send({ message: 'Song deleted' });
  }
}

export { sanitizeSongInput, findAll, findOne, add, update, remove };
