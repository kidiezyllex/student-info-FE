"use client";

import type { MenuItem } from "@/interface/types";
import { cn } from "@/lib/utils";
import { useMenuSidebar } from "@/stores/useMenuSidebar";
import { Icon } from "@mdi/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";
import DashboardHeader from "../Common/DashboardHeader";
import { getDashboardMenuItems } from "./dashboardMenuItems";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { RippleEffect } from "@/components/ui/ripple-effect";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [hoverMenu, setHoverMenu] = useState<string | null>(null);
	const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
	const pathname = usePathname();
	const { isOpen } = useMenuSidebar();
	const dashboardMenuItems = getDashboardMenuItems();

	const isMenuActive = (menu: MenuItem) => {
		if (menu.path && pathname === menu.path) return true;
		return false;
	};

	const handleMouseEnter = (menuId: string) => {
		if (!isOpen) {
			setHoverMenu(menuId);
		}
	};

	const handleMouseLeave = () => {
		setHoverMenu(null);
	};

	const handleMenuClick = (menu: MenuItem) => {
		if (menu.subMenu && menu.subMenu.length > 0) {
			setExpandedMenu(expandedMenu === menu.id ? null : menu.id);
		}
	};

	return (
		<div className="flex min-h-screen bg-mainDarkBackgroundV1">
			<div
				className={cn(
					"bg-mainDarkBackgroundV1 fixed top-0 left-0 right-0 z-50 mt-[78px]   min-h-screen transition-all duration-300",
					isOpen ? "w-[260px]" : "w-0 md:w-16 overflow-hidden flex justify-center",
				)}
			>
				<div className="flex flex-col h-full bg-mainDarkBackgroundV1">
					<nav className="flex-1 overflow-y-auto py-4 bg-mainDarkBackgroundV1">
						<ul className={cn("", isOpen ? "px-2" : "px-1")}>
							{dashboardMenuItems.map((menu) => (
								<li key={menu.id}>
									<div
										className="relative"
										onMouseEnter={() => handleMouseEnter(menu.id)}
										onMouseLeave={handleMouseLeave}
										onClick={() => handleMenuClick(menu)}
									>
										{(!menu.subMenu || menu.subMenu.length === 0) ? (
											<Link href={menu.path}>
												<RippleEffect
													rippleColor="rgba(68, 215, 182, 0.3)"
													duration={500}
												>
													<div
														className={cn(
															"flex items-center rounded-lg p-[10px] h-[46px] text-sm font-medium transition-colors",
															isMenuActive(menu)
																? "bg-[#29323A] text-white"
																: "text-white/70 hover:bg-[#29323A]",
															!isOpen && "!justify-center w-[46px]",
														)}
													>
														<div
															className={cn(
																"!w-7 !h-7 flex-shrink-0 rounded-sm flex items-center justify-center bg-[#29323A]",
																isOpen ? "mr-4" : "mr-0",
															)}
														>
															<Icon
																path={menu.icon}
																size={0.8}
																className={cn(
																	isMenuActive(menu)
																		? "!text-white flex-shrink-0"
																		: "!text-white/70 flex-shrink-0",
																)}
															/>
														</div>
														{isOpen && <span className="text-nowrap">{menu.name}</span>}
													</div>
												</RippleEffect>
											</Link>
										) : (
											<RippleEffect
												rippleColor="rgba(68, 215, 182, 0.3)"
												duration={500}
											>
												<div
													className={cn(
														"flex items-center  rounded-lg p-[10px] h-[46px] text-sm font-medium transition-colors cursor-pointer",
														isMenuActive(menu)
															? "bg-[#29323A] text-white"
															: "text-white/70 hover:bg-[#29323A]",
														!isOpen && "!justify-center w-[46px]",
													)}
												>
													<div
														className={cn(
															"!w-7 !h-7 flex-shrink-0 rounded-sm flex items-center justify-center bg-[#29323A] ",
															isOpen ? "mr-4" : "mr-0",
														)}
													>
														<Icon
															path={menu.icon}
															size={0.8}
															className={cn(
																isMenuActive(menu)
																	? "!text-white flex-shrink-0"
																	: "!text-white/70 flex-shrink-0",
															)}
														/>
													</div>
													{isOpen && (
														<span className="text-nowrap flex items-center justify-between gap-1 flex-1">
															{menu.name}
															{expandedMenu === menu.id ? (
																<IconChevronUp size={18} className="ml-1" />
															) : (
																<IconChevronDown size={18} className="ml-1" />
															)}
														</span>
													)}
												</div>
											</RippleEffect>
										)}
										{/* SubMenu expand/collapse */}
										{isOpen && menu.subMenu && menu.subMenu.length > 0 && (
											<AnimatePresence initial={false}>
												{expandedMenu === menu.id && (
													<motion.ul
														className="ml-8 mt-1"
														initial="collapsed"
														animate="open"
														exit="collapsed"
														variants={{
															open: { opacity: 1, height: "auto" },
															collapsed: { opacity: 0, height: 0 }
														}}
														transition={{ duration: 0.3, ease: "easeInOut" }}
														style={{ overflow: "hidden" }}
													>
														{menu.subMenu.map((sub) => (
															<li key={sub.id}>
																<Link href={sub.path} onClick={(e) => e.stopPropagation()}>
																	<RippleEffect
																		rippleColor="rgba(68, 215, 182, 0.2)"
																		duration={400}
																	>
																		<div
																			className={cn(
																				"flex items-center rounded-lg p-[8px] h-[38px] text-sm font-normal transition-colors",
																			pathname === sub.path
																				? "bg-[#29323A] text-white"
																				: "text-white/70 hover:bg-[#29323A]",
																			)}
																		>
																			<Icon
																				path={sub.icon || ""}
																				size={0.7}
																				className={cn(
																					pathname === sub.path
																						? "!text-white flex-shrink-0"
																						: "!text-white/70 flex-shrink-0",
																					"mr-3"
																				)}
																			/>
																			<span>{sub.name}</span>
																		</div>
																	</RippleEffect>
																</Link>
															</li>
														))}
													</motion.ul>
												)}
											</AnimatePresence>
										)}
										{!isOpen && hoverMenu === menu.id && (
											<AnimatePresence>
												<motion.div
													initial={{ opacity: 0, x: -5 }}
													animate={{ opacity: 1, x: 0 }}
													exit={{ opacity: 0, x: -5 }}
													transition={{ duration: 0.2 }}
													className="fixed ml-16 mt-[-30px] bg-[#29323A] border border-lightBorderV1 text-white text-xs py-1.5 px-3 rounded-md shadow-light-grey z-50 whitespace-nowrap flex items-center"
												>
													<span className="w-1.5 h-1.5 rounded-full bg-mainActiveV1 mr-1.5"></span>
													<span className="font-medium">{menu.name}</span>
												</motion.div>
											</AnimatePresence>
										)}
									</div>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</div>

			{/* Main content */}
			<div className="flex-1 flex flex-col">
				<DashboardHeader />
				<main
					className={`flex-1 overflow-auto bg-mainDarkBackgroundV1 ${isOpen ? "pl-[276px]" : "pl-[68px]"} mt-[78px] min-h-screen transition-all duration-300 p-4`}
				>
					{children}
				</main>
			</div>
		</div>
	);
}
