import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions, getQuestionById, createQuestion, updateQuestion, deleteQuestion } from "../../api/adminApi";
import axiosClient from "../../api/axiosClient";

interface Question {
  id: number;
  test_code?: string;
  test_id?: number;
  question_text: string;
  sequence: number;
  created_at: string;
  options?: Option[];
}

interface Option {
  id: number;
  question_id: number;
  text: string;
  score: number;
  category: string;
}

export default function AdminQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedTest, setSelectedTest] = useState("RIASEC");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tests, setTests] = useState<Array<{ id: number; code: string; name: string }>>([]);

  const [formData, setFormData] = useState({
    test_id: 0,
    question_text: "",
    options: [
      { text: "", score: 1, category: "" },
      { text: "", score: 2, category: "" },
      { text: "", score: 3, category: "" },
      { text: "", score: 4, category: "" }
    ]
  });

  const testTypes = ["RIASEC", "INTEREST", "APTITUDE", "PERSONALITY", "VALUES"];
  const categories = ["Realistic", "Investigative", "Artistic", "Social", "Enterprising", "Conventional"];

  useEffect(() => {
    loadTests();
    loadQuestions();
  }, [selectedTest]);

  const loadTests = async () => {
    try {
      const res = await axiosClient.get("/tests/info/RIASEC");
      // Fetch all tests - we'll get them from the questions endpoint
      const testsRes = await axiosClient.get("/admin/questions?limit=1");
      // For now, we'll use test codes directly
    } catch (err) {
      console.error("Error loading tests:", err);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getQuestions({ test_code: selectedTest });
      setQuestions(response.questions || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load questions");
      console.error("Error loading questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate 4 options are filled
    const validOptions = formData.options.filter(opt => opt.text.trim() !== "");
    if (validOptions.length !== 4) {
      alert("Please fill all 4 options");
      return;
    }

    // Get test_id from test_code
    let testId = formData.test_id;
    if (!testId) {
      try {
        const testRes = await axiosClient.get(`/tests/info/${selectedTest}`);
        testId = testRes.data.id;
      } catch (err) {
        alert("Failed to get test ID. Please try again.");
        return;
      }
    }

    try {
      setError(null);
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, {
          question_text: formData.question_text,
          test_id: testId,
          options: formData.options.map(opt => ({
            text: opt.text,
            score: opt.score,
            ...(opt.category ? { category: opt.category } : {})
          }))
        });
      } else {
        await createQuestion({
          test_id: testId,
          question_text: formData.question_text,
          options: formData.options.map(opt => ({
            text: opt.text,
            score: opt.score,
            ...(opt.category ? { category: opt.category } : {})
          }))
        });
      }
      closeModal();
      loadQuestions();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save question");
      console.error("Error saving question:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        setError(null);
        await deleteQuestion(id);
        loadQuestions();
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to delete question");
        console.error("Error deleting question:", err);
      }
    }
  };

  const openModal = async (question?: Question) => {
    if (question) {
      setEditingQuestion(question);
      
      // Load question with options
      try {
        const fullQuestion = await getQuestionById(question.id);
        
        setFormData({
          test_id: fullQuestion.test_id || question.test_id || 0,
          question_text: question.question_text,
          options: fullQuestion.options && fullQuestion.options.length >= 4
            ? fullQuestion.options.slice(0, 4).map((opt: any) => ({
                text: opt.option_text || opt.text || "",
                score: opt.score || 1,
                category: opt.category || ""
              }))
            : [
                { text: "", score: 1, category: "" },
                { text: "", score: 2, category: "" },
                { text: "", score: 3, category: "" },
                { text: "", score: 4, category: "" }
              ]
        });
      } catch (err) {
        console.error("Error loading question details:", err);
        setFormData({
          test_id: question.test_id || 0,
          question_text: question.question_text,
          options: [
            { text: "", score: 1, category: "" },
            { text: "", score: 2, category: "" },
            { text: "", score: 3, category: "" },
            { text: "", score: 4, category: "" }
          ]
        });
      }
    } else {
      setEditingQuestion(null);
      // Get test_id for selected test
      let testId = 0;
      try {
        const testRes = await axiosClient.get(`/tests/info/${selectedTest}`);
        testId = testRes.data.id;
      } catch (err) {
        console.error("Error getting test ID:", err);
      }
      
      setFormData({
        test_id: testId,
        question_text: "",
        options: [
          { text: "", score: 1, category: "" },
          { text: "", score: 2, category: "" },
          { text: "", score: 3, category: "" },
          { text: "", score: 4, category: "" }
        ]
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingQuestion(null);
  };

  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  // Questions are already filtered by selectedTest from API
  const filteredQuestions = questions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="text-slate-600 hover:text-slate-900"
              >
                ← Back
              </button>
              <h1 className="text-lg font-semibold text-slate-900">Manage Questions</h1>
            </div>
            <button
              onClick={() => openModal()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-card transition"
            >
              + Add Question
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}
        {/* Test Type Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Select Test Type</h3>
          <div className="flex flex-wrap gap-2">
            {testTypes.map((test) => (
              <button
                key={test}
                onClick={() => setSelectedTest(test)}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition ${
                  selectedTest === test
                    ? "bg-blue-600 text-white shadow-card"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {test}
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{filteredQuestions.length}</p>
            <p className="text-sm text-slate-600">Questions in {selectedTest}</p>
          </div>
        </div>

        {/* Questions List */}
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600">Loading questions...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
                No questions found for {selectedTest}. Click "Add Question" to create one.
              </div>
            ) : (
              filteredQuestions.map((question, idx) => (
                <div
                  key={question.id}
                  className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 mb-1">{question.question_text}</p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                              {question.test_code}
                            </span>
                            <span className="text-xs text-slate-500">Seq: {question.sequence}</span>
                            {question.options && (
                              <span className="text-xs text-slate-500">
                                ({question.options.length} options)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => openModal(question)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(question.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingQuestion ? "Edit Question" : "Add Question"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Test Type *
                </label>
                <select
                  required
                  value={selectedTest}
                  onChange={(e) => {
                    setSelectedTest(e.target.value);
                    // Update formData test_id when test changes
                    axiosClient.get(`/tests/info/${e.target.value}`).then(res => {
                      setFormData({ ...formData, test_id: res.data.id });
                    }).catch(() => {});
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {testTypes.map((test) => (
                    <option key={test} value={test}>
                      {test}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Question Text *
                </label>
                <textarea
                  required
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your question here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Options (Exactly 4 required) *
                </label>
                {formData.options.filter(opt => opt.text.trim() === "").length > 0 && (
                  <p className="text-xs text-red-600 mb-2">Please fill all 4 options</p>
                )}
                <div className="space-y-3">
                  {formData.options.map((option, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-xs text-slate-500">Option {idx + 1}</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={option.text}
                        onChange={(e) => updateOption(idx, 'text', e.target.value)}
                        placeholder="Option text"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          required
                          value={option.score}
                          onChange={(e) => updateOption(idx, 'score', parseInt(e.target.value) || 0)}
                          placeholder="Score"
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                        />
                        <select
                          required
                          value={option.category}
                          onChange={(e) => updateOption(idx, 'category', e.target.value)}
                          className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
                        >
                          <option value="">Category</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-card transition"
                >
                  {editingQuestion ? "Update" : "Add"} Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
