import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/orm.js';
import { Song } from './song.entity.js';
import { Record } from '../record/record.entity.js';

const em = orm.em;

function sanitizedSongInput(req: Request, res: Response, next: NextFunction) {
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

async function findAll(req: Request, res: Response) {
  try {
    const songs = await em.find(
      Song,
      {},
      {
        populate: ['record'],
      }
    );
    res.status(200).json({ message: 'Found all songs', data: songs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const song = await em.find(
      Song,
      { id },
      {
        populate: ['record'],
      }
    );
    res.status(200).json({ message: 'Found song', data: song });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.body.record);
    const record = await em.findOneOrFail(Record, {id});
    const song = em.create(Song, req.body.sanitizedInput);
    await em.flush();
    await record.songs.add(song);
    res.status(201).json({ message: 'Song created', data: song });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const SongToUpdate = await em.findOneOrFail(Song, { id });
    em.assign(SongToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'Song updated', data: SongToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const song = em.getReference(Song, id);
    await em.removeAndFlush(song);
    res.status(200).json({ message: 'Song deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizedSongInput, findAll, findOne, add, update, remove };
