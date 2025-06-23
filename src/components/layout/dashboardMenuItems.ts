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
		name: "Tổng quan",
		path: "/admin",
		icon: mdiViewDashboard,
	},
	{
		id: "user-management",
		name: "Quản lý người dùng",
		path: "/admin/users",
		icon: mdiAccountGroup,
	},
	{
		id: "department-management",
		name: "Quản lý khoa",
		path: "/admin/departments",
		icon: mdiSchool,
	},
	{
		id: "event-management",
		name: "Quản lý sự kiện",
		path: "/admin/events",
		icon: mdiCalendarMonth,
		subMenu: [
			{
				id: "all-events",
				name: "Tất cả sự kiện",
				path: "/admin/events/all",
				icon: mdiCalendarMonth,
			},
			{
				id: "upcoming-events",
				name: "Sự kiện sắp tới",
				path: "/admin/events",
				icon: mdiCalendarMonth,
			},
		],
	},
	{
		id: "scholarship-management",
		name: "Quản lý học bổng",
		path: "/admin/scholarships",
		icon: mdiGift,
		subMenu: [
			{
				id: "all-scholarships",
				name: "Tất cả học bổng",
				path: "/admin/scholarships/all",
				icon: mdiGift,
			},
			{
				id: "active-scholarships",
				name: "Học bổng đang mở",
				path: "/admin/scholarships",
				icon: mdiGift,
			},
		],
	},
	{
		id: "notification-management",
		name: "Quản lý thông báo",
		path: "/admin/notifications",
		icon: mdiBell,
	},
	{
		id: "message-management",
		name: "Quản lý tin nhắn",
		path: "/admin/messages",
		icon: mdiMessageText,
	},
	{
		id: "ai-management",
		name: "Quản lý AI",
		path: "/admin/ai",
		icon: mdiRobot,
		subMenu: [
			{
				id: "ai-training",
				name: "Train AI",
				path: "/admin/ai/training",
				icon: mdiRobot,
			},
			{
				id: "training-history",
				name: "Lịch sử train AI",
				path: "/admin/ai/training-history",
				icon: mdiChartLine,
			},
		],
	},
	{
		id: "dataset-management", 
		name: "Quản lý dữ liệu",
		path: "/admin/dataset",
		icon: mdiDatabase,
	},
	{
		id: "chat-management",
		name: "Quản lý Chat",
		path: "/admin/chat",
		icon: mdiMessageText,
		subMenu: [
			{
				id: "chat-sessions",
				name: "Phiên chat",
				path: "/admin/chat/sessions",
				icon: mdiMessageText,
			},
			{
				id: "chat-statistics",
				name: "Thống kê chat",
				path: "/admin/chat/statistics",
				icon: mdiChartLine,
			},
		],
	},
]; 