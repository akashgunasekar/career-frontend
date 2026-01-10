import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  startAssessmentSession,
  fetchNextQuestion,
  submitAnswer,
  advanceStage,
} from "../../../api/testApi";
import { useAuth } from "../../../context/AuthContext";
import QuestionScreen from "./QuestionScreen";
import axiosClient from "../../../api/axiosClient";

export default function AssessmentStepper() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [questionData, setQuestionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [testName, setTestName] = useState("Assessment");
  const [totalQuestions, setTotalQuestions] = useState(10);

  const start = async () => {
    if (!user) {
      navigate("/student/login");
      return;
    }

    setLoading(true);
    try {
      const { data } = await startAssessmentSession(user.id);
      setSessionId(data.sessionId);
      
      // Get test name and total questions
      await loadTestInfo(data.currentStage);
      await loadNext(data.sessionId);
    } catch (err: any) {
      console.error("Assessment start error:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to start assessment";
      alert(`Error: ${errorMsg}`);
      navigate("/student/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadTestInfo = async (testCode: string) => {
    try {
      const res = await axiosClient.get(`/tests/info/${testCode}`);
      const data = res.data;
      if (data.name) setTestName(data.name);
      if (data.totalQuestions) setTotalQuestions(data.totalQuestions);
    } catch (err: any) {
      console.error("Error loading test info:", err);
      // Don't fail the assessment if test info fails to load
    }
  };

  const loadNext = async (id: number) => {
    try {
      const { data: next } = await fetchNextQuestion(id);

      // Stage complete → move to next stage
      if (next.stageComplete) {
        try {
          const { data: step } = await advanceStage(id);
          if (step.finished) {
            navigate("/student/assessment/results");
            return;
          }
          // Load test info for next stage
          if (step.nextStage) {
            await loadTestInfo(step.nextStage);
          }
          await loadNext(id);
          return;
        } catch (err: any) {
          console.error("Advance stage error:", err);
          const errorMsg = err?.response?.data?.message || "Failed to advance to next stage";
          alert(`Error: ${errorMsg}`);
        }
        return;
      }

      if (!next.question) {
        console.error("No question in response:", next);
        alert("No question available. Please try again.");
        navigate("/student/dashboard");
        return;
      }

      setQuestionData(next);
      if (next.totalQuestions) {
        setTotalQuestions(next.totalQuestions);
      }
    } catch (err: any) {
      console.error("Load next question error:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to load question";
      alert(`Error: ${errorMsg}`);
      navigate("/student/dashboard");
    }
  };

  const handleAnswer = async (optionId: number) => {
    if (!sessionId || !questionData.question) return;

    setAnswering(true);
    try {
      await submitAnswer({
        sessionId,
        questionId: questionData.question.id,
        optionId,
      });
      await loadNext(sessionId);
    } catch (err: any) {
      console.error("Answer submission error:", err);
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to save answer";
      alert(`Error: ${errorMsg}`);
    } finally {
      setAnswering(false);
    }
  };

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!questionData || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-clipboard-list text-blue-600"></i>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">{testName}</h1>
              <p className="text-sm text-slate-500">Question {questionData.progress} of {totalQuestions}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to exit? Your progress will be saved.")) {
                navigate("/student/dashboard");
              }
            }}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <QuestionScreen
          question={questionData.question}
          options={questionData.options}
          progress={questionData.progress}
          stage={questionData.stage}
          totalQuestions={totalQuestions}
          onAnswer={handleAnswer}
        />

        {answering && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Saving answer...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
