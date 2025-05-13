import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-black font-bold text-xl">
          Asrama Politeknik
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-black hover:text-gray-700">
            Beranda
          </Link>
          <Link href="/profile" className="text-black hover:text-gray-700">
            Profil
          </Link>
          <button className="bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700">
            <Link href="/logout" className="text-white">
              Logout
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
