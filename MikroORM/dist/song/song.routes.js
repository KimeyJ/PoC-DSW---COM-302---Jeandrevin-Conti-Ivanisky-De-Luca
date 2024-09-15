import { Router } from "express";
import { sanitizedSongInput, findAll, findOne, add, update, remove, } from './song.controller.js';
export const songRouter = Router();
songRouter.get('/', findAll);
songRouter.get('/:id', findOne);
songRouter.post('/', sanitizedSongInput, add);
songRouter.put('/:id', sanitizedSongInput, update);
songRouter.patch('/:id', sanitizedSongInput, update);
songRouter.delete('/:id', remove);
//# sourceMappingURL=song.routes.js.map