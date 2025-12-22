import type { MenuItem } from "@/interface/types";
import {
	mdiViewDashboard,
	mdiAccountGroup,
	mdiSchool,
	mdiCalendarMonth,
	mdiGift,
	mdiBell,
	mdiRobot,
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