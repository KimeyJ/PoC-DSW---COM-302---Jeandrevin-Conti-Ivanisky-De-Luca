import { Request, Response, NextFunction } from 'express';
import { Artist } from './artist.entity.js';
import { orm } from '../shared/orm.js';

const em = orm.em;

function sanitizeArtistInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    id: req.body.id,
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

async function findAll(req: Request, res: Response) {
  try {
    const artists = await em.find(
      Artist,
      {},
      {
        populate: ['records'],
      }
    );
    res.status(200).json({ message: 'Found all artist', data: artists });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const artist = await em.find(Artist, { id });
    res.status(200).json({ message: 'Found artist', data: artist });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const artist = em.create(Artist, req.body.sanitizedInput);
    await em.flush();
    res.status(201).json({ message: 'Artist created', data: artist });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const ArtistToUpdate = await em.findOneOrFail(Artist, { id });
    em.assign(ArtistToUpdate, req.body.sanitizedInput);
    await em.flush();
    res.status(200).json({ message: 'Artist updated', data: ArtistToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const artist = em.getReference(Artist, id);
    await em.removeAndFlush(artist);
    res.status(200).json({ message: 'Artist deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeArtistInput, findAll, findOne, add, update, remove };
