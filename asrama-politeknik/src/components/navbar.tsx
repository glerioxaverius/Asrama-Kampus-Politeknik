import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          Asrama Politeknik
        </Link>
        <div className="space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">
            Beranda
          </Link>
          <Link href="/profile" className="text-gray-300 hover:text-white">
            Profil
          </Link>
          <Link href="/logout" className="text-gray-300 hover:text-white">
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
