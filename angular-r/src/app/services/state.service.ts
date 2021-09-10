import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Entry } from '../models/entry.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  currentEntry = new BehaviorSubject<Entry>(new Entry());

  constructor() { }
}
