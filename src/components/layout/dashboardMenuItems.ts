import type { MenuItem } from "@/interface/types";
import {
	mdiViewDashboard,
	mdiAccountGroup,
	mdiSchool,
	mdiCalendarMonth,
	mdiGift,
	mdiBell,
	mdiRobot,
	mdiAlphaTCircle,
	mdiHistory,
	mdiTicket
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
		id: "activity-logs",
		name: "Activity Logs",
		path: "/admin/activity-logs",
		icon: mdiHistory,
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
		path: "/coordinator",
		icon: mdiViewDashboard,
	},
	{
		id: "student-management",
		name: "Student Management",
		path: "/coordinator/students",
		icon: mdiAccountGroup,
	},
	{
		id: "coordinator-topic-management",
		name: "Topic Management",
		path: "/coordinator/topics",
		icon: mdiAlphaTCircle,
	},
	{
		id: "coordinator-ticket-management",
		name: "Support Tickets",
		path: "/coordinator/tickets",
		icon: mdiTicket,
	},
];  