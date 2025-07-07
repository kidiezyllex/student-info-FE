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
	mdiFileDocument
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
		id: "event-management",
		name: "Event Management",
		path: "/admin/events",
		icon: mdiCalendarMonth,
	},
	{
		id: "scholarship-management",
		name: "Scholarship Management",
		path: "/admin/scholarships",
		icon: mdiGift,
	},
	{
		id: "notification-management",
		name: "Notification Management",
		path: "/admin/notifications",
		icon: mdiBell,
	},
	{
		id: "message-management",
		name: "Message Management",
		path: "/admin/messages",
		icon: mdiMessageText,
	},
	{
		id: "ai-management",
		name: "AI Management",
		path: "/admin/ai",
		icon: mdiRobot,
		subMenu: [
			{
				id: "ai-training",
				name: "AI Training",
				path: "/admin/ai/training",
				icon: mdiRobot,
			},
			{
				id: "training-history",
				name: "Training History",
				path: "/admin/ai/training-history",
				icon: mdiChartLine,
			},
		],
	},
	{
		id: "dataset-management", 
		name: "Dataset Management",
		path: "/admin/dataset",
		icon: mdiDatabase,
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
		id: "student-chat",
		name: "AI Chat",
		path: "/student/chat",
		icon: mdiRobot,
	},
	{
		id: "chat-management",
		name: "Chat Management",
		path: "/student/messages",
		icon: mdiChartLine,
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