import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardDataStatsProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	total: number | string;
	description?: string;
	link?: string;
	variant?: "small" | "big";
}

export default function StatsCard({
	title,
	total,
	link,
	description,
	variant = "small",
	className,
}: CardDataStatsProps) {
	let content = null;
	if (variant === "small") {
		content = (
			<Card
				className={cn(
					"gap-0 py-4 h-full min-w-[200px]",
					link === undefined ? className : undefined,
				)}
			>
				<CardHeader className="px-4">
					<CardTitle className="text-sm flex justify-between items-center">
						<span>{title}</span>
						<span>
							{link === undefined ? null : (
								<ArrowRight className="-translate-x-2 group-hover:translate-x-0 transition-transform ease-in-out" />
							)}
						</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="px-4">
					<div className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
						{total}
					</div>
				</CardContent>
				<CardFooter className="px-4">
					<CardDescription>{description}</CardDescription>
				</CardFooter>
			</Card>
		);

		if (link) {
			return (
				<Link href={link} className={cn("group flex-1", className)}>
					{content}
				</Link>
			);
		}
	} else if (variant === "big") {
		content = (
			<Card
				className={cn(
					"w-full h-full gap-2",
					link === undefined ? className : undefined,
				)}
			>
				<CardHeader className="px-4">
					<CardTitle className="text-base">{title}</CardTitle>
				</CardHeader>
				<CardContent className="px-4">
					<div className="text-5xl font-semibold tabular-nums @[250px]/card:text-6xl">
						{total}
					</div>
				</CardContent>
				{description === undefined ? null : (
					<CardFooter className="px-4">
						<CardDescription>{description}</CardDescription>
					</CardFooter>
				)}
			</Card>
		);
		if (link) {
			return (
				<Link href={link} className={cn("group w-full", className)}>
					{content}
				</Link>
			);
		}
	}
	return content;
}
