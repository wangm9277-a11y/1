export interface TcmCase {
  patientName: string;
  appearance: {
    face: string;   // e.g., Pale, Red, Yellow
    tongue: string; // e.g., Pale with white coating
    pulse: string;  // e.g., Floating, Tight
  };
  complaint: string; // The dialogue from the patient
  correctDiagnosis: string;
  wrongOptions: string[];
  explanation: string; // Educational feedback
}

export type GameState = 'MENU' | 'LOADING' | 'PLAYING' | 'FEEDBACK' | 'GAME_OVER';

export interface GameStats {
  score: number;
  lives: number;
  streak: number;
}
