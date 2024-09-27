import { Router } from 'express';
import {
  sanitizeSongInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './song.controller.js';

export const songRouter = Router();

songRouter.get('/', findAll);
songRouter.get('/:id', findOne);
songRouter.post('/', sanitizeSongInput, add);
songRouter.put('/:id', sanitizeSongInput, update);
songRouter.patch('/:id', sanitizeSongInput, update);
songRouter.delete('/:id', remove);
