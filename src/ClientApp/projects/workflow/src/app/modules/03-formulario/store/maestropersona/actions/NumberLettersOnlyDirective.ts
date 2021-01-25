

import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[number-letters-only]"
})

export class NumberLettersOnlyDirective {
  @Input()
  decimals: number = 0;

  @Input('disable-number-letters-only') disabled = false;

  // Allow decimal numbers. The \. is only allowed once to occur
  private regexNumberLetters: RegExp = new RegExp(/[^0-9a-zA-Z\s]/);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  constructor(private el: ElementRef) { }
  @HostListener("keypress", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (this.disabled)
      return true;
    const keyCode = event.keyCode || event.which;
    const keyValue = event.key || String.fromCharCode(keyCode);

    if (this.regexNumberLetters.test(keyValue)) {
      event.preventDefault();
    }
  }
  @HostListener("paste", ["$event"])
  blockPaste(e: any) {
    if (this.disabled)
      return true;

    const clipboardData: any = e.clipboardData;
    const text = clipboardData.getData('text');
    if (this.regexNumberLetters.test(text)) {
      event.preventDefault();
    }
  }
}
