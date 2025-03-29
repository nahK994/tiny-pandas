import Image from "next/image";

export default function TopBar() {
  return (
    <div className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Image src="/pizza.png" alt="Tiny Panda Logo" width={40} height={40} />
        <span className="text-xl font-bold text-gray-800">Tiny Panda</span>
      </div>

      {/* Right: Auth Buttons */}
      <div className="flex gap-4">
        <button className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100">Login</button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Register</button>
      </div>
    </div>
  );
}
