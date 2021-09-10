import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Entry } from '../models/entry.model';
import { Observable } from 'rxjs';
import { FileService } from './file.service';

const FILE_NAME_PARAM = 'fileName';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private readonly httpClient: HttpClient,
    private readonly fileService: FileService) { }

  getResults(entry: Entry): Observable<any> {
    let params = new HttpParams().set(FILE_NAME_PARAM, this.fileService.createFileName(entry));
		return this.httpClient.get(environment.urlResults, {params: params});
  }

  downloadFile(entry: Entry): Observable<any> {
    let params = new HttpParams().set(FILE_NAME_PARAM, this.fileService.createFileName(entry));
		return this.httpClient.get(environment.urlDownload, {params: params, responseType: 'blob'});
  }

  runPredictions(entry: Entry): Observable<any> {
    return this.httpClient.post(environment.urlPredictions, entry);
  }

}
