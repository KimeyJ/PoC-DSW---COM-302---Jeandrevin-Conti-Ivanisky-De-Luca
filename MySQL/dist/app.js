import express from 'express';
import { artistRouter } from './artist/artist.routes.js';
import { recordRouter } from './record/record.routes.js';
import { songRouter } from './song/song.routes.js';
const app = express();
app.use(express.json());
app.use('/api/artists', artistRouter);
app.use('/api/records', recordRouter);
app.use('/api/songs', songRouter);
app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found' });
});
app.listen(3000, () => {
    console.log('Server runnning on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map