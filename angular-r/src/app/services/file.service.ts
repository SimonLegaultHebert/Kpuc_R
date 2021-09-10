import { Injectable } from '@angular/core';
import { Entry } from '../models/entry.model';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  createFileName(entry: Entry) {
    return `${entry.chromosome}_${entry.startPosition}_${entry.stopPosition}_${entry.type}.tsv`;
  }
}
