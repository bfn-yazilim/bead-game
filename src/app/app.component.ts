import { Component } from '@angular/core';
import { GridItem } from './app.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'bead-game';
  isWinning = true;

  colors = ['red', 'blue', 'yellow', 'green', 'purple'];
  gridItems: GridItem[] = [];

  constructor() {
    this.initializeGame();
  }

  private initializeGame() {
    // Kazanma durumu için renkleri düzenle (5x5 grid)
    const winningColors = ['red', 'blue', 'yellow', 'green', 'purple'];
    // Grid items oluştur
    this.gridItems = [];

    // Renk sayımlarını takip etmek için bir nesne oluştur
    const colorCounts = this.colors.reduce<{ [key: string]: number }>(
      (acc, color) => {
        acc[color] = 0;
        return acc;
      },
      {}
    );

    for (let i = 0; i < 25; i++) {
      let color: string;
      do {
        color = winningColors[Math.floor(Math.random() * 5)];
      } while (colorCounts[color] >= 5); // Her renkten en fazla 5 tane olabilir

      colorCounts[color]++;

      this.gridItems.push({
        color: i === 12 ? 'empty' : color, // 13. item (ortadaki) boş olacak
        isEmpty: i === 12,
      });
    }
    this.isWinning = false;

    // Başlangıçta kazanma durumunu kontrol et
    this.checkWinCondition();
  }

  startNewGame() {
    this.initializeGame();
  }

  onItemClick(clickedIndex: number) {
    if (this.isWinning) return;

    const emptyIndex = this.gridItems.findIndex((item) => item.isEmpty);

    // Check if clicked item is adjacent to empty space
    if (this.isAdjacent(clickedIndex, emptyIndex)) {
      // Swap items
      const temp = { ...this.gridItems[clickedIndex] };
      this.gridItems[clickedIndex] = { ...this.gridItems[emptyIndex] };
      this.gridItems[emptyIndex] = temp;
      console.log(this.gridItems);
      // Check win condition after each move
      this.checkWinCondition();
    }
  }

  private isAdjacent(index1: number, index2: number): boolean {
    const row1 = Math.floor(index1 / 5);
    const col1 = index1 % 5;
    const row2 = Math.floor(index2 / 5);
    const col2 = index2 % 5;

    // Check if positions are adjacent horizontally or vertically
    return (
      (Math.abs(row1 - row2) === 1 && col1 === col2) || // Vertical
      (Math.abs(col1 - col2) === 1 && row1 === row2) // Horizontal
    );
  }

  private checkWinCondition() {
    // Get all non-empty items
    const nonEmptyItems = this.gridItems;

    // Yeni kazanma kuralına göre grupları kontrol et
    const firstGroup = nonEmptyItems.slice(0, 5); // 0-5 arası
    const secondGroup = nonEmptyItems.slice(5, 10); // 5-10 arası
    const thirdGroup = nonEmptyItems.slice(10, 15); // 10-15 arası
    const fourthGroup = nonEmptyItems.slice(15, 20); // 15-20 arası
    const fifthGroup = nonEmptyItems.slice(20); // 20-25 arası

    const isFirstGroupValid = this.areAllSameColor(firstGroup);
    const isSecondGroupValid = this.areAllSameColor(secondGroup);
    const isThirdGroupValid = this.areAllSameColor(thirdGroup);
    const isFourthGroupValid = this.areAllSameColor(fourthGroup);
    const isFifthGroupValid = this.areAllSameColor(fifthGroup);
    console.log(firstGroup, secondGroup, thirdGroup, fourthGroup, fifthGroup);

    console.log(
      isFirstGroupValid,
      isSecondGroupValid,
      isThirdGroupValid,
      isFourthGroupValid,
      isFifthGroupValid
    );
    if (
      isFirstGroupValid &&
      isSecondGroupValid &&
      isThirdGroupValid &&
      isFourthGroupValid &&
      isFifthGroupValid
    ) {
      this.isWinning = true;
    }
  }

  private areAllSameColor(items: GridItem[]): boolean {
    if (items.length === 0) return false;
    const i = items.filter((item) => item.color !== 'empty');
    const firstColor = i[0].color;
    return i.every((item) => item.color === firstColor);
  }
}
