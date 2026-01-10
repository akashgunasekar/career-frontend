import axiosClient from "./axiosClient";

export const getRecommendedCareers = (studentId: number) =>
  axiosClient.get(`/career/recommended/${studentId}`);

export const getCollegesForCareer = (careerId: number) =>
  axiosClient.get(`/career/colleges/${careerId}`);

export const getCareerSuggestions = (category: string) =>
  axiosClient.get(`/test/career/${category}`);