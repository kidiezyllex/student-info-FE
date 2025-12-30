export interface IStatisticsResponse {
  success: boolean;
  message: string;
  data: {
    studentsCount: number;
    departmentsCount: number;
    coordinatorsCount: number;
    topicsCount: number;
    topicsByType: {
      event: number;
      scholarship: number;
      notification: number;
      job: number;
      advertisement: number;
      internship: number;
      recruitment: number;
      volunteer: number;
      extracurricular: number;
    };
  };
}
