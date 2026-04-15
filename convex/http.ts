import { httpRouter } from "convex/server";

// No webhook needed — users are created directly via createUserWithPassword mutation
const http = httpRouter();

export default http;
