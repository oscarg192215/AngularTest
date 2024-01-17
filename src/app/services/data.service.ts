import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private searchDataSubject = new BehaviorSubject<any[]>([]);
  searchData$ = this.searchDataSubject.asObservable();

  updateSearchData(data: any[]): void {
    this.searchDataSubject.next(data);
  }
}
