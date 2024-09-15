import 'reflect-metadata';
import express from 'express';
import { orm, syncSchema } from './shared/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { artistRouter } from './artist/artist.routes.js';
import { recordRouter } from './record/record.routes.js';
import { songRouter } from './song/song.routes.js';
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    RequestContext.create(orm.em, next);
});
app.use('/api/artists', artistRouter);
app.use('/api/records', recordRouter);
app.use('/api/songs', songRouter);
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
await syncSchema();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//# sourceMappingURL=app.js.map