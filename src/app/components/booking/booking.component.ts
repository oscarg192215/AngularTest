import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PropertyDetail } from 'src/app/models/property.model';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service'; 

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  subscriptions: Subscription[] = [];
  pdtSubscription: Subscription = new Subscription();
  propertiesList: any[] = [];

  propertyData: PropertyDetail[] = [];
  searchForm: FormGroup;

  constructor(private apiSrv: ApiService, private formBuilder: FormBuilder, private dataService: DataService
  ) {
    this.searchForm = this.formBuilder.group({
      name: [''],
      codeInternal: [''],
      price: [''],
      year: ['']
    });
  }

  ngOnInit(): void {
    this.getProperties();
  }

  getProperties() {
    this.apiSrv.listProperties().subscribe((res: any) => {
      this.propertiesList = res.data;
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
    })
  }

  searchProperties() {
    const priceControl = this.searchForm.get('price');
    debugger;
    if (!priceControl?.value) {
      priceControl?.setValue(0);
    }
    const yearControl = this.searchForm.get('year');
    if (!yearControl?.value) {
      yearControl?.setValue(0);
    }
    const criteria = this.searchForm.value;
    this.apiSrv.searchProperties(criteria).subscribe((res: any) => {
      this.propertiesList = res.data;   
      this.subscriptions.push(this.pdtSubscription)
      this.searchForm = this.formBuilder.group({
        name: [''],
        codeInternal: [''],
        price: [''],
        year: ['']
      });
      this.dataService.updateSearchData(res.data);      
    })
  }
}
