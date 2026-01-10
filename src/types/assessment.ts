export interface AssessmentResult {
  topCategory: string;
  scores: Record<string, number>;
}

export interface Career {
  id: number;
  name: string;
}
