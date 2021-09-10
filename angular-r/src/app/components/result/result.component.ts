import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import * as fileSaver from 'file-saver';
import { Entry } from '../../models/entry.model';
import { FileService } from '../../services/file.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  title: string;
  results: any;
  currentEntry: Entry = new Entry();

  constructor(
    private readonly apiService: ApiService,
    private readonly fileService: FileService,
    private readonly stateService: StateService) { 

    this.title = 'Results';
  }

  ngOnInit(): void {
    this.currentEntry = this.stateService.currentEntry.getValue();
    this.getResult();
  }

  private getResult() {
    this.apiService.getResults(this.currentEntry).subscribe((response: any) => {
      this.results = response;
    },
      (err: any) => {
        console.log(err);
      },
      () => {

      });
  }

  downloadFile() {
    this.apiService.downloadFile(this.currentEntry).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'text/tsv; charset=utf-8' });
      fileSaver.saveAs(blob, this.fileService.createFileName(this.currentEntry));
    },
      (err: any) => {
        console.log(err);
      },
      () => {

      });
  }

}
