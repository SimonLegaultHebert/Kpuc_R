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
  genes: any[] | undefined;
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
      this.results = this.results[0];
      this.genes = this.createGenesList(this.results);
    },
      (err: any) => {
        console.log(err);
      },
      () => {

      });
  }

  private createGenesList(results: any) {
    const genesList = [];
    const genesNameList = results.Genes.split(',');
    const pliList = results.pLI.split(',');
    const loeufList = results.LOEUF.split(',');
    const oeList = results.OE.split(',');
    const ndGenesCategoryList = results.DNMref.split(';');
    const sfariGenesCategoryList = results.SFARIref.split(',');

    for (let i = 0; i < genesNameList.length; ++i) {
      let gene = {
        name: genesNameList[i],
        pli: pliList[i].replace('NA', '0.00e+0'),
        loeuf: loeufList[i].replace('NA', '0.00'),
        oe: oeList[i].replace('NA', '0.00e+0'),
        ndGenesCategory: ndGenesCategoryList[i],
        sfariGenesCategory: sfariGenesCategoryList[i]
      }
      genesList.push(gene);
    }

    return genesList;
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
