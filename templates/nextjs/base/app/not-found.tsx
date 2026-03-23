import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Link href="/" className="btn-primary px-6 py-2 text-white rounded-lg">
        Back to home
      </Link>
    </div>
  );
}
