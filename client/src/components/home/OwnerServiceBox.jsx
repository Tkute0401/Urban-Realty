import { ChevronRightIcon } from "@heroicons/react/24/outline";


// Owner Service Block
const OwnerServiceBlock = () => {
  return (
    <section className="py-16 bg-[#0c0d0e]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-6">
          {/* Text alignment adjusted to match the design exactly */}
          <span className="text-gray-400 font-sans font-bold block tracking-wide">ARE YOU AN OWNER?</span>
          <h2 className="font-serif text-4xl font-bold text-white leading-tight">
            Sell or Rent <span className="text-[#78cadc]">Your Property</span> Faster with
            <br />Urban Realty 360
          </h2>
          <p className="font-sans text-gray-300 mt-2 tracking-wide text-sm">
            SELL OR RENT YOUR RESIDENTIAL/COMMERCIAL PROPERTY.
          </p>
        </div>
        
        <button className="flex items-center gap-2 bg-[#78cadc] text-[#0c0d0e] font-bold px-6 py-3 rounded-lg hover:bg-sky-300 transition-colors">
          <span>Post Your Property</span>
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default OwnerServiceBlock;