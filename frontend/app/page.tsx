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
		desc: "Refreshing drinks crafted for every moment. Perfect for quenching your thirst anytime.",
		img: "https://images.unsplash.com/photo-1625865019845-7b2c89b8a8a9?auto=format&fit=crop&w=800&q=80",
	},
	{
		id: 2,
		title: "Snacks",
		desc: "Crunchy and delicious snacks for all ages. Enjoy a tasty treat on the go or at home.",
		img: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80",
	},
	{
		id: 3,
		title: "Condiments",
		desc: "Flavorful additions that elevate every meal. Enhance your dishes with our quality condiments.",
		img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80",
	},
	{
		id: 4,
		title: "Personal Care",
		desc: "Quality hygiene products for your daily essentials. Stay fresh and confident every day.",
		img: "https://images.unsplash.com/photo-1577467013350-7c22a844e1a9?auto=format&fit=crop&w=800&q=80",
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
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					className="max-w-7xl mx-auto flex flex-col gap-16 items-center px-6 text-center"
				>
					<h1 className="text-5xl font-extrabold leading-tight max-w-[32ch] mx-auto text-balance">
						Delivering Quality FMCG Products Across Sri Lanka
					</h1>
					<p className="text-muted-foreground text-lg max-w-prose mx-auto">
						Kandypack connects Sri Lanka with reliable, sustainable, and
						affordable packaged goods — powered by a hybrid rail and road
						network.
					</p>
				</motion.div>
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
				className="py-24 px-6 max-w-7xl mx-auto text-left space-y-6"
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
				<p className="text-muted-foreground max-w-2xl">
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
				<div className="max-w-7xl mx-auto px-6 flex flex-col items-end text-right">
					<h3 className="text-3xl font-bold mb-4">
						Efficient Hybrid Distribution
					</h3>
					<p className="text-muted-foreground mb-4 max-w-prose">
						Kandypack’s logistics network combines the efficiency of railway
						transport for bulk distribution with road-based last-mile delivery,
						ensuring timely supply to retailers across Sri Lanka.
					</p>
					<div className="flex gap-4 text-sm">
						<div className="px-4 py-2 bg-primary/40 text-primary-foreground font-medium rounded-lg shadow-sm">
							🚂 Railway Freight
						</div>
						<div className="px-4 py-2 bg-primary/40 text-primary-foreground font-medium rounded-lg shadow-sm">
							🚚 Road Delivery
						</div>
					</div>
				</div>
			</section>

			{/* PRODUCTS - Horizontal Scroll */}
			<section
				id="products"
				className="py-28 overflow-x-auto snap-x snap-mandatory"
			>
				<h2 className="text-center text-3xl font-bold mb-10">Our Products</h2>
				<div className="flex gap-5 px-6 min-w-max justify-center">
					{productCategories.map((p) => (
						<motion.div
							key={p.id}
							whileHover={{ scale: 1.03 }}
							className="snap-center"
						>
							<Card className="rounded-3xl border-border/50 bg-background/60 shadow-lg backdrop-blur-sm w-[320px] flex-shrink-0 gap-0 py-0 h-full">
								<Image
									src={p.img}
									alt={p.title}
									width={400}
									height={300}
									className="rounded-t-3xl h-48 w-full object-cover"
								/>
								<CardContent className="p-3">
									<CardTitle className="mb-2.5 mt-1">{p.title}</CardTitle>
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
						<h4 className="text-lg font-bold mb-4 text-foreground/90">
							Kandypack
						</h4>
						<p className="text-sm max-w-prose text-pretty">
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
						<div className="flex gap-3 flex-col">
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
