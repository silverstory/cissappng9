export interface Office {
  _id: string;
  code: String;
  name: String;
  datemodified: Date;
}

export class OfficeObj implements Office {
  _id: string;
  code: String;
  name: String;
  datemodified: Date;

  constructor(item?: Office) {
    if (item !== undefined) {
      // tslint:disable-next-line:forin
      for (const key in item) {
        try { this[key] = item[key]; } catch (e) { }
      }
    }
  }
}
