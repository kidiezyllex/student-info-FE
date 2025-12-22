import { TopicType } from "@/interface/response/topic";

export const topicTypes: TopicType[] = [
  "event",
  "scholarship",
  "notification",
  "job",
  "advertisement",
  "internship",
  "recruitment",
  "volunteer",
  "extracurricular",
];

export const typeColorMap: Record<TopicType, string> = {
  event: "#3B82F6",
  scholarship: "#10B981",
  notification: "#F59E0B",
  job: "#6366F1",
  advertisement: "#A855F7",
  internship: "#06B6D4",
  recruitment: "#14B8A6",
  volunteer: "#34D399",
  extracurricular: "#EC4899",
};

export const typeLabels: Record<TopicType, string> = {
  event: "Event",
  scholarship: "Scholarship",
  notification: "Notification",
  job: "Job",
  advertisement: "Advertisement",
  internship: "Internship",
  recruitment: "Recruitment",
  volunteer: "Volunteer",
  extracurricular: "Extracurricular",
};

