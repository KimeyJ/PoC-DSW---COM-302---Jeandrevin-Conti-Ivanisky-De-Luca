import { Router } from 'express';
import {
  sanitizedRecordInput,
  findAll,
  findOne,
  add,
  update,
  remove,
} from './record.controller.js';

export const recordRouter = Router();

recordRouter.get('/', findAll);
recordRouter.get('/:id', findOne);
recordRouter.post('/', sanitizedRecordInput, add);
recordRouter.put('/:id', sanitizedRecordInput, update);
recordRouter.patch('/:id', sanitizedRecordInput, update);
recordRouter.delete('/:id', remove);