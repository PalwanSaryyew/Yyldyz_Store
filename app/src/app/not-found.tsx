import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-center bg-white p-4">
            <h1 className="text-4xl font-bold">404 - Sahypa Tapylmady</h1>
            <p className="mt-4 text-lg">
                Gözleýän sahpaňyz elýeter däl ýa-da ýa-da başga ýere geçirilen bolmagy ahmal.
            </p>
            <Link
                href="/"
                className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Baş sahypa dolan.
            </Link>
        </div>
    );
}