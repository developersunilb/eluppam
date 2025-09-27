export interface PracticeItem {
  originalWord: string;
  blankedWord: string;
  correctAnswer: string;
  meaning: string;
  transliteration: string;
}

export interface IncorrectAnswerSummaryItem {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
}
