import { Record } from '../record/record.entity.js';

export class Artist {
  constructor(
    public name: string,
    public age: number,
    public records: Record[],
    public id?: number
  ) {}
}
