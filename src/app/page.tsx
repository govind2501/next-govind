import Link from "next/link";
import HeroSlideshow from "@/components/HeroSlideshow";

export default function Home() {
  return (
    <div className="bg-slate-50">

      {/* ===== Disclaimer Banner ===== */}
      <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-900 text-xs sm:text-sm text-center py-2 px-4">
        ⚠️ Please independently verify property ownership and documents before any
        transaction. Trade My Property is not responsible for the accuracy of listings
        or disputes between users.
      </div>

     {/* ===== Hero Section ===== */}

<section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden">

  <div className="relative z-10 px-4 max-w-3xl">
    <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
      Find Your Perfect Property, Anywhere in India
    </h1>
    <p className="text-white/90 text-base sm:text-lg mb-8">
      Buy, sell, or rent land, houses, and shops — directly connect with owners across every state and district.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/property"
        className="bg-orange-600 hover:bg-orange-700 text-black font-bold px-8 py-3 rounded-md transition text-lg"
      >
        Browse Properties
      </Link>
      <Link
        href="/property/add"
        className="bg-white hover:bg-gray-100 text-orange-900 font-bold px-8 py-3 rounded-md transition text-lg border-2 border-white"
      >
        List Your Property
      </Link>
    </div>
  </div>
</section>

      {/* ===== Trust / Features Strip ===== */}
      <section className="bg-orange-900 text-white py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 px-4 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-bold">28+</p>
            <p className="text-sm text-orange-100">States Covered</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold">700+</p>
            <p className="text-sm text-orange-100">Districts Listed</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold">100%</p>
            <p className="text-sm text-orange-100">Direct Owner Contact</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold">Verified</p>
            <p className="text-sm text-orange-100">Admin-Approved Listings</p>
          </div>
        </div>
      </section>

      {/* ===== Property Types Showcase ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-900 text-center mb-2">
          Explore by Property Type
        </h2>
        <p className="text-gray-600 text-center mb-10">
          Whatever you're looking for, we've got it covered
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="relative rounded-lg overflow-hidden shadow-md h-64 group">
          <img
              src="/images/land.jpg"
              alt="Land for sale"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-4">
              <h3 className="text-white text-xl font-bold">Land / Plots</h3>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden shadow-md h-64 group">
            <img
              src="/images/house.jpg"
              alt="Houses for sale"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-4">
              <h3 className="text-white text-xl font-bold">Houses / Flats</h3>
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden shadow-md h-64 group">
            <img
              src="/images/shop.jpg"
              alt="Shops for sale"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-4">
              <h3 className="text-white text-xl font-bold">Shops / Commercial</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Why Choose Us Section ===== */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img
            src="/images/family.jpg"
            alt="Happy customers"
            className="rounded-lg shadow-md w-full h-80 object-cover"
          />

          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-900 mb-6">
              Why Choose next-govind?
            </h2>

            <div className="flex flex-col gap-5">
              <div className="flex gap-4">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-bold text-orange-900">Verified Listings</h3>
                  <p className="text-gray-600 text-sm">Every property is reviewed by our admin team before going live.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">📞</span>
                <div>
                  <h3 className="font-bold text-orange-900">Direct Owner Contact</h3>
                  <p className="text-gray-600 text-sm">No middlemen — talk directly to the property owner.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h3 className="font-bold text-orange-900">Pan-India Coverage</h3>
                  <p className="text-gray-600 text-sm">Listings across every state and district in India.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">🙋</span>
                <div>
                  <h3 className="font-bold text-orange-900">Buyer Requirements Welcome</h3>
                  <p className="text-gray-600 text-sm">Looking for a property? Post your requirement and let sellers find you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Call To Action ===== */}
      <section className="bg-orange-600 py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">
            Ready to find your next property?
          </h2>
          <p className="text-black/80 mb-6">
            Join thousands of buyers and sellers already using next-govind
          </p>
          <Link
            href="/signup"
            className="bg-black text-white font-bold px-8 py-3 rounded-md hover:bg-gray-800 transition inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </section>

    </div>
  );
}