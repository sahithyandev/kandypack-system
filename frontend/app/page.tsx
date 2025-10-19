"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

const productCategories = [
	{
		id: 1,
		title: "Beverages",
		desc: "Refreshing drinks crafted for every moment.",
		img: "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=800&q=80",
	},
	{
		id: 2,
		title: "Snacks",
		desc: "Crunchy and delicious snacks for all ages.",
		img: "https://images.unsplash.com/photo-1604908177373-fb53ed4c8b0d?auto=format&fit=crop&w=800&q=80",
	},
	{
		id: 3,
		title: "Condiments",
		desc: "Flavorful additions that elevate every meal.",
		img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80",
	},
	{
		id: 4,
		title: "Personal Care",
		desc: "Quality hygiene products for your daily essentials.",
		img: "https://images.unsplash.com/photo-1606813902789-8e6a688c8e2b?auto=format&fit=crop&w=800&q=80",
	},
];

export default function HomePage() {
	return (
		<div className="bg-gradient-to-b from-sky-50 via-white to-lime-50 dark:from-slate-950 dark:via-slate-900 dark:to-black text-foreground">
			{/* NAVBAR */}
			<header className="sticky top-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/30">
				<div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
					<span className="font-bold text-xl tracking-tight">Kandypack</span>
					<nav className="hidden md:flex gap-8 text-sm font-medium">
						<a href="#about" className="hover:text-primary transition-colors">
							About
						</a>
						<a
							href="#products"
							className="hover:text-primary transition-colors"
						>
							Products
						</a>
						<a
							href="#distribution"
							className="hover:text-primary transition-colors"
						>
							Distribution
						</a>
						<a href="#contact" className="hover:text-primary transition-colors">
							Contact
						</a>
					</nav>
					<Button asChild>
						<a href="/login">Login</a>
					</Button>
				</div>
			</header>

			{/* HERO */}
			<section className="relative overflow-hidden py-28">
				<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center px-6">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="z-10 space-y-6"
					>
						<h1 className="text-5xl font-extrabold leading-tight">
							Delivering Quality FMCG Products Across Sri Lanka
						</h1>
						<p className="text-muted-foreground text-lg max-w-md">
							Kandypack connects Sri Lanka with reliable, sustainable, and
							affordable packaged goods — powered by a hybrid rail and road
							network.
						</p>
						<div className="flex gap-4">
							<Button>Learn More</Button>
							<Button variant="outline">Contact</Button>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.9 }}
						className="relative"
					>
						<div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-green-400/10 blur-3xl" />
						<Image
							src="https://images.unsplash.com/photo-1607083206173-06f4c2b71c5d?auto=format&fit=crop&w=900&q=80"
							alt="Distribution network"
							width={800}
							height={600}
							className="relative z-10 rounded-3xl shadow-2xl object-cover"
						/>
					</motion.div>
				</div>
			</section>

			{/* TRUST STRIP */}
			<section className="py-8 border-y border-border/20 bg-background/40 backdrop-blur-sm">
				<div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
					<span>🚛 Nationwide Delivery</span>
					<span>•</span>
					<span>🏭 30+ Years of Excellence</span>
					<span>•</span>
					<span>🤝 400+ Retail Partners</span>
				</div>
			</section>

			{/* ABOUT */}
			<section
				id="about"
				className="py-24 px-6 max-w-5xl mx-auto text-center space-y-6"
			>
				<motion.h2
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="text-3xl font-bold"
				>
					Our Commitment to Quality and Sustainability
				</motion.h2>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Founded in Kandy, Kandypack has grown into one of Sri Lanka’s most
					trusted FMCG manufacturers. We believe in delivering consistent
					quality through efficient production, responsible sourcing, and
					innovative logistics.
				</p>
			</section>

			{/* DISTRIBUTION */}
			<section
				id="distribution"
				className="relative py-24 bg-gradient-to-r from-primary/5 to-green-100/10 dark:from-slate-900 dark:to-slate-800"
			>
				<div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
					<div>
						<Image
							src="https://images.unsplash.com/photo-1581092787763-9f2c1aef0e1c?auto=format&fit=crop&w=900&q=80"
							alt="Distribution"
							width={700}
							height={500}
							className="rounded-3xl shadow-xl"
						/>
					</div>
					<div>
						<h3 className="text-3xl font-bold mb-4">
							Efficient Hybrid Distribution
						</h3>
						<p className="text-muted-foreground mb-4">
							Kandypack’s logistics network combines the efficiency of railway
							transport for bulk distribution with road-based last-mile
							delivery, ensuring timely supply to retailers across Sri Lanka.
						</p>
						<div className="flex gap-4 text-sm text-muted-foreground">
							<div>🚂 Railway Freight</div>
							<div>🚚 Road Delivery</div>
						</div>
					</div>
				</div>
			</section>

			{/* PRODUCTS - Horizontal Scroll */}
			<section
				id="products"
				className="py-28 overflow-x-auto snap-x snap-mandatory"
			>
				<h2 className="text-center text-3xl font-bold mb-10">Our Product</h2>
				<div className="flex gap-8 px-6 min-w-max justify-center">
					{productCategories.map((p) => (
						<motion.div
							key={p.id}
							whileHover={{ scale: 1.03 }}
							className="snap-center"
						>
							<Card className="rounded-3xl border-border/50 bg-background/60 shadow-lg backdrop-blur-sm w-[320px] flex-shrink-0">
								<Image
									src={p.img}
									alt={p.title}
									width={400}
									height={300}
									className="rounded-t-3xl h-48 w-full object-cover"
								/>
								<CardContent className="p-3">
									<CardTitle className="mb-1 mt-1">{p.title}</CardTitle>
									<CardDescription>{p.desc}</CardDescription>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</section>

			{/* CONTACT */}
			<section id="contact" className="py-28 text-center px-6">
				<h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
				<p className="text-muted-foreground mb-8 max-w-md mx-auto">
					Have a business inquiry or want to learn more about our products?
					Reach out to our team.
				</p>
				<Button size="lg">Contact Us</Button>
			</section>

			{/* FOOTER */}
			<footer className="py-12 border-t border-border/30 bg-background/60 text-muted-foreground">
				<div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
					{/* Company Info */}
					<div>
						<h4 className="text-lg font-bold mb-4">Kandypack</h4>
						<p className="text-sm">
							Delivering quality FMCG products across Sri Lanka with a
							commitment to sustainability and innovation.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h4 className="text-lg font-bold mb-4">Quick Links</h4>
						<ul className="space-y-2 text-sm">
							<li>
								<a
									href="#about"
									className="hover:text-primary transition-colors"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="#products"
									className="hover:text-primary transition-colors"
								>
									Our Products
								</a>
							</li>
							<li>
								<a
									href="#distribution"
									className="hover:text-primary transition-colors"
								>
									Distribution
								</a>
							</li>
							<li>
								<a
									href="#contact"
									className="hover:text-primary transition-colors"
								>
									Contact
								</a>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h4 className="text-lg font-bold mb-4">Contact</h4>
						<ul className="space-y-2 text-sm">
							<li>📍 Kandy, Sri Lanka</li>
							<li>📞 +94 77 123 4567</li>
							<li>📧 info@kandypack.lk</li>
						</ul>
					</div>

					{/* Social Media */}
					<div>
						<h4 className="text-lg font-bold mb-4">Follow Us</h4>
						<div className="flex gap-4">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors flex items-center gap-2"
							>
								Facebook
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors flex items-center gap-2"
							>
								Twitter
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors flex items-center gap-2"
							>
								Instagram
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-primary transition-colors flex items-center gap-2"
							>
								LinkedIn
							</a>
						</div>
					</div>
				</div>
				<div className="mt-8 text-center text-xs">
					© {new Date().getFullYear()} Kandypack (Pvt) Ltd. All rights reserved.
				</div>
			</footer>
		</div>
	);
}
