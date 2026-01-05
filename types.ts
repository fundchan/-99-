export interface Question {
  num1: number;
  num2: number;
  product: number;
}

export enum GameState {
  THINKING, // User sees the question
  REVEALED, // User sees the answer
}

export interface MnemonicResponse {
  rhyme: string;
  visualCue: string;
  emojis: string;
}