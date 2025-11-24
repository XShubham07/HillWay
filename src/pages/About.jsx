export default function About() {
  return (
    <div className="mt-24 max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">About Us</h1>

      <p className="text-lg text-gray-600 leading-8">
        We are a premium tour agency specializing in Sikkim & Northeast India.
        Our mission is to provide safe, comfortable and memorable trips with 
        full customization, expert guides and transparent pricing.
      </p>

      <img src="/about.jpg" className="w-full mt-10 rounded-xl shadow-lg" />
    </div>
  );
}
