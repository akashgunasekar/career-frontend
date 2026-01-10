import { useState } from "react";

interface Props {
  question: any;
  options: any[];
  onAnswer: (id: number) => void;
  stage: string;
  progress: number;
  totalQuestions?: number;
}

export default function QuestionScreen({ question, options, onAnswer, stage, progress, totalQuestions = 10 }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!question) return null;

  const progressPercent = totalQuestions > 0 ? (progress / totalQuestions) * 100 : 0;

  const handleOptionClick = (optionId: number) => {
    setSelectedOption(optionId);
    // Auto-submit after a brief delay for better UX
    setTimeout(() => {
      onAnswer(optionId);
      setSelectedOption(null);
    }, 300);
  };

  // Map option text to letter labels
  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        {/* Question Tag */}
        <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          Question {progress}
        </div>

        {/* Question Text */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
          {question.question_text}
        </h2>

        {/* Instruction */}
        <p className="text-slate-600 mb-6">Select the option that best describes you:</p>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedOption === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`w-full text-left bg-white border-2 rounded-xl px-5 py-4 transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                } flex items-center justify-between group`}
              >
                <span className="text-base font-medium text-slate-800 flex-1">
                  {option.option_text || option.text}
                </span>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected
                    ? "border-blue-600 bg-blue-600"
                    : "border-slate-300 group-hover:border-blue-400"
                }`}>
                  {isSelected ? (
                    <i className="fas fa-check text-white text-sm"></i>
                  ) : (
                    <span className="text-slate-600 text-sm font-semibold">{optionLabels[index]}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
