import axiosClient from "./axiosClient";

// Start a new assessment session for a student
export const startAssessment = async (studentId: number) => {
  return axiosClient.post("/tests/start", { studentId });
};

// Fetch next question for a session
export const getNextQuestion = async (sessionId: number) => {
  return axiosClient.get(`/tests/next/${sessionId}`);
};

// Save an answer for a question
export const saveAnswer = async (payload: {
  sessionId: number;
  questionId: number;
  optionId: number;
}) => {
  return axiosClient.post("/tests/answer", payload);
};

// Move to the next stage of the assessment
export const goToNextStage = async (sessionId: number) => {
  return axiosClient.post("/tests/next-stage", { sessionId });
};

// Fetch final aggregated results for a student
export const getFinalResult = async (studentId: number) => {
  return axiosClient.get(`/tests/result/${studentId}`);
};

// Aliases for the assessment stepper (more descriptive names)
export const startAssessmentSession = startAssessment;
export const fetchNextQuestion = getNextQuestion;
export const submitAnswer = saveAnswer;
export const advanceStage = goToNextStage;
export const fetchFinalResults = getFinalResult;







