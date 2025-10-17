export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <main className="w-full">{children}</main>;
}
