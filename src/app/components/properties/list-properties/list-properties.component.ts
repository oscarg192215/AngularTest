import { Component, Input, OnInit } from '@angular/core';
import { PropertyDetail } from 'src/app/models/property.model';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-list-properties',
  templateUrl: './list-properties.component.html',
  styleUrls: ['./list-properties.component.css']
})
export class ListPropertiesComponent implements OnInit {
  subscriptions: Subscription[] = [];
  pdtSubscription: Subscription = new Subscription();
  propertiesList: any[] = [];
  searchForm: FormGroup;
  propertyData: PropertyDetail[] = [];

  constructor(private apiSrv: ApiService, private formBuilder: FormBuilder, private dataService: DataService
  ) {
    this.searchForm = this.formBuilder.group({
      name: [''],
      codInternal: [''],
      price: [''],
      year: ['']
    });
  }

  ngOnInit(): void {
    this.dataService.searchData$.subscribe(data => {
      debugger;
      if (data !== null && data !== undefined && data.length > 0) {
        this.propertiesList = [];
        this.propertyData = [];
        this.propertiesList = data;
        this.setPropertyValues();
      }
      else {
        this.getProperties();
      }
    });
  }

  setPropertyValues() {
    this.propertiesList.forEach(item => {
      const property: PropertyDetail = {
        idProperty: item.idProperty,
        name: item.name,
        address: item.address,
        price: item.price,
        codeInternal: item.codeInternal,
        year: item.year,
        idOwner: item.idOwner,
        value: item.propertyTrace[0].value,
        tax: item.propertyTrace[0].tax,
        dateSale: item.propertyTrace[0].dateSale,
        files: item.propertyImage[0].files
      };
      this.propertyData.push(property);
    })
    this.subscriptions.push(this.pdtSubscription)
  }

  getProperties() {
    this.apiSrv.listProperties().subscribe((res: any) => {
      this.propertiesList = res.data;
      this.setPropertyValues();
    })
  }
}
