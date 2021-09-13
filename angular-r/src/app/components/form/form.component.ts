import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Entry } from 'src/app/models/entry.model';
import { NavigationService } from 'src/app/services/navigation.service';
import { StateService } from 'src/app/services/state.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  title: string;
  form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly navigationService: NavigationService,
    private readonly apiService: ApiService,
    private readonly stateService: StateService) {

    this.title = 'MIND•CNV prediction tool v3.0';
    this.form = this.createForm();
  }

  ngOnInit(): void {

  }

  // TODO Retirer les valeurs par défaut
  createForm(): FormGroup {
    return this.form = this.formBuilder.group({
      chromosome: ['chr1', [Validators.required]],
      startPosition: ['1234', [Validators.required]],
      stopPosition: ['1233445', [Validators.required]],
      type: ['DEL', [Validators.required]]
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.logInfo();
      const entry = this.createEntry(this.form);
      this.stateService.currentEntry.next(entry);
      this.runPredictions(entry);
    }
  }

  private runPredictions(entry: Entry): void {
    this.apiService.runPredictions(entry).subscribe((response) => {
      this.navigationService.navigateToResult();
    },
      (err: any) => {
        console.log(err);
      },
      () => {

      });
  }

  private createEntry(formGroup: FormGroup): Entry {
    const entry = new Entry();
    entry.chromosome = formGroup.controls.chromosome.value;
    entry.startPosition = formGroup.controls.startPosition.value;
    entry.stopPosition = formGroup.controls.stopPosition.value;
    entry.type = formGroup.controls.type.value;

    return entry;
  }

  private logInfo(): void {
    console.log('chromosome:', this.form.controls.chromosome.value);
    console.log('startPosition:', this.form.controls.startPosition.value);
    console.log('stopPosition:', this.form.controls.stopPosition.value);
    console.log('type:', this.form.controls.type.value);
  }

}
