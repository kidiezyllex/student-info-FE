import type { MenuItem } from "@/interface/types";
import {
	mdiViewDashboard,
	mdiAccountGroup,
	mdiAccount,
	mdiAccountTie,
	mdiSchool,
	mdiCalendarMonth,
	mdiGift,
	mdiBell,
	mdiMessageText,
	mdiRobot,
	mdiDatabase,
	mdiCog,
	mdiChartLine,
	mdiAlphaTCircle
} from "@mdi/js";

export const getDashboardMenuItems = (): MenuItem[] => [
	{
		id: "dashboard",
		name: "Overview",
		path: "/admin",
		icon: mdiViewDashboard,
	},
	{
		id: "user-management",
		name: "User Management",
		path: "/admin/users",
		icon: mdiAccountGroup,
	},
	{
		id: "department-management",
		name: "Department Management",
		path: "/admin/departments",
		icon: mdiSchool,
	},
	{
		id: "topic-management",
		name: "Topic Management",
		path: "/admin/topics",
		icon: mdiAlphaTCircle,
	},
	{
		id: "dataset-management", 
		name: "Dataset Management",
		path: "/admin/dataset",
		icon: mdiDatabase,
	},
	{
		id: "ai-chat",
		name: "AI Chat",
		path: "/admin/chat",
		icon: mdiRobot,
	},
]; 

export const getStudentMenuItems = (): MenuItem[] => [
	{
		id: "student-dashboard",
		name: "Dashboard",
		path: "/student",
		icon: mdiViewDashboard,
	},
	{
		id: "ai-chat",
		name: "AI Chat",
		path: "/student/chat",
		icon: mdiRobot,
	},
	{
		id: "student-scholarships",
		name: "Scholarships",
		path: "/student/scholarships",
		icon: mdiGift,
	},
	{
		id: "student-events",
		name: "Events",
		path: "/student/events",
		icon: mdiCalendarMonth,
	},
	{
		id: "student-notifications",
		name: "Notifications",
		path: "/student/notifications",
		icon: mdiBell,
	},
];

export const getCoordinatorMenuItems = (department: string): MenuItem[] => [
	{
		id: "coordinator-dashboard",
		name: "Dashboard",
		path: `/coordinator/${department}`,
		icon: mdiViewDashboard,
	},
	{
		id: "coordinator-event-management",
		name: "Event Management",
		path: `/coordinator/${department}/events`,
		icon: mdiCalendarMonth,
	},
	{
		id: "coordinator-scholarship-management",
		name: "Scholarship Management",
		path: `/coordinator/${department}/scholarships`,
		icon: mdiGift,
	},
	{
		id: "coordinator-notification-management",
		name: "Notification Management",
		path: `/coordinator/${department}/notifications`,
		icon: mdiBell,
	},
]; 