import { Record } from "../record/record.entity.js";

export class Song {
  constructor(
    public name: string,
    public duration: number,
    public record:Record,
    public id?: number
  ) {}
}
