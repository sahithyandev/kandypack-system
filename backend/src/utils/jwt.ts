import jwt from "@elysiajs/jwt";

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined in environment variables");
}

const jwtInstance = jwt({
	name: "jwt",
	secret: process.env.JWT_SECRET,
});
export default jwtInstance;
