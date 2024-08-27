import {clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)' ,
  "/" , // landing
  "/search(.*)" , // search page
  "/profile(.*)", // search result page
  "/dashboard(.*)", // dashboard page
  "/prof(.*)", // prof adding page
  "/chat(.*)", // ai chat page
]);

export default clerkMiddleware((auth, request) => {
  if(!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};