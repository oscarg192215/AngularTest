import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[customInput]'
})
export class CustomInputDirective {

  @Input() max = Infinity;
  @Input() customPattern?: string | RegExp;
  @Input() min = -Infinity;
  @Input() mask!: (RegExp | string)[];

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const inputValue = this.el.nativeElement.value;

    if (this.customPattern) {
      const pattern = new RegExp(this.customPattern);
      if (!pattern.test(inputValue)) {
        this.el.nativeElement.value = '';
        return;
      }
    }

    if (typeof this.max !== 'undefined') {
      const numericValue = parseInt(inputValue, 10);
      if (!isNaN(numericValue) && numericValue > this.max) {
        this.el.nativeElement.value = this.max.toString();
        return;
      }
    }

    const numericValue = inputValue.replace(/[^0-9]/g, '');

    if (inputValue !== numericValue) {
      this.el.nativeElement.value = numericValue;
    }
  }
}