import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wordWrap',
  standalone: true
})
export class WordWrapPipe implements PipeTransform {

  transform(value: string, wordsPerLine: number = 3): string {
    if (!value) return value;

    const words = value.split(' ');
    let result = '';
    for (let i = 0; i < words.length; i++) {
      result += words[i] + ' ';
      if ((i + 1) % wordsPerLine === 0) {
        result += '<br>';
      }
    }
    return result.trim();
  }
}
