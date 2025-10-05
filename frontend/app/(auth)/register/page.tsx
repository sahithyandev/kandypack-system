import SimpleAuthForm from "@/components/simple-auth-form";

export default function RegisterPage() {
	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
			<SimpleAuthForm mode="register" />
		</div>
	);
}