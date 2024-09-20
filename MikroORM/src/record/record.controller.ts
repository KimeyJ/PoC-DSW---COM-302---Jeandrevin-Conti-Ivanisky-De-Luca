import { Record } from './record.entity.js';
import { orm } from '../shared/orm.js';
import { Request, Response, NextFunction } from 'express';

const em = orm.em;

function sanitizeRecordInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    id: req.body.id,
    name: req.body.name,
    release_date: req.body.release_date,
    genre: req.body.genre,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

async function findAll(req: Request, res: Response) {
  try {
    const records = await em.find(
      Record,
      {},
      {
        populate: ['songs', 'artists'],
      }
    );
    res.status(200).json({ message: 'Found all records', data: records });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const records = await em.find(
      Record,
      { id },
      {
        populate: ['songs', 'artists'],
      }
    );
    res.status(200).json({ message: 'Found record', data: records });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const records = em.create(Record, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Record created', data: records });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const RecordToUpdate = await em.findOneOrFail(Record, { id });
    em.assign(RecordToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'Record updated', data: RecordToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const record = em.getReference(Record, id);
    await em.removeAndFlush(record);
    res.status(200).json({ message: 'Record deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeRecordInput, findAll, findOne, add, update, remove };
