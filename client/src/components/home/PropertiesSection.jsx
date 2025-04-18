// Properties Section
// const PropertiesSection = () => {
//     return (
//       <section className="py-20 bg-gray-900">
//         <div className="max-w-7xl mx-auto px-8">
//           <h2 className="font-serif text-4xl font-bold text-white mb-4">
//             Properties based on <span className="text-sky-400">Your Location</span>
//           </h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
//             {[0, 1, 2, 3].map((index) => (
//               <PropertyCard key={index} index={index} />
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   };
  
// export default PropertiesSection;

import PropertyCard from "./PropertyCard";

const PropertiesSection = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="font-serif text-4xl font-bold text-white mb-4">
          Properties based on <span className="text-sky-400">Your Location</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {[0, 1, 2, 3].map((index) => (
            <PropertyCard key={index} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
  
export default PropertiesSection;