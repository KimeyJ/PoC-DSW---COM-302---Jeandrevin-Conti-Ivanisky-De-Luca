import { Request, Response, NextFunction } from 'express';
import { RecordRepository } from './record.repository.js';
import { Record } from './record.entity.js';

interface RecordInputWithArtists extends Record {
  record: Record;
  artistIds: number[];
}

const repository = new RecordRepository();

function sanitizeRecordInput(req: Request, res: Response, next: NextFunction) {
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

async function findAll(req: Request, res: Response) {
  res.json({ data: await repository.findAll() });
}

async function findOne(req: Request, res: Response) {
  const record = await repository.findOne({ id: req.params.id });
  if (record === undefined) {
    return res.status(404).send({ message: 'Record not found' });
  } else {
    res.json({ data: record });
  }
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;
  const recordin = new Record(input.name, input.artists, input.songs);
  const recordInput = {
    record: recordin,
    artistIds: input.artistsID,
  } as RecordInputWithArtists;
  const record = await repository.add(recordInput);
  return res.status(201).send({ message: 'Record created', data: record });
}

async function update(req: Request, res: Response) {
  const record = await repository.update(
    req.params.id,
    req.body.sanitizedInput
  );

  if (record === undefined) {
    return res.status(404).send({ message: 'Record not found' });
  } else {
    res.status(200).send({ message: 'Record updated', data: record });
  }
}

async function remove(req: Request, res: Response) {
  const id = req.params.id;
  const record = await repository.delete({ id });

  if (record === undefined) {
    res.status(404).send({ message: 'Record not found' });
  } else {
    res.status(200).send({ message: 'Record deleted' });
  }
}

export { sanitizeRecordInput, findAll, findOne, add, update, remove };
