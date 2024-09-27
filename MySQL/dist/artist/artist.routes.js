import { Router } from 'express';
import { sanitizeArtistInput, findAll, findOne, add, update, remove, } from './artist.controller.js';
export const artistRouter = Router();
artistRouter.get('/', findAll);
artistRouter.get('/:id', findOne);
artistRouter.post('/', sanitizeArtistInput, add);
artistRouter.put('/:id', sanitizeArtistInput, update);
artistRouter.patch('/:id', sanitizeArtistInput, update);
artistRouter.delete('/:id', remove);
//# sourceMappingURL=artist.routes.js.map