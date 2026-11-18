import React from 'react';
import { Heart, MapPin, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Property } from '../types';
import { formatINR } from '../data/bhopalData';
import { useApp } from '../context/AppContext';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { navigate, favorites, toggleFavorite } = useApp();
  const isFav = favorites.includes(property.id);

  return (
    <article className="group bg-white rounded-xl border border-[#E6EAE6] overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col">
      {/* Image */}
      <div
        onClick={() => navigate('property-detail', property.id)}
        className="relative aspect-[4/3] bg-[#EAEFEA] overflow-hidden cursor-pointer"
      >
        <img
          src={property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          aria-label={isFav ? 'Remove from saved' : 'Save property'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#202822] hover:bg-white transition-colors shadow-sm cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-[#202822]'}`} />
        </button>

        {property.verified && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#163D32]/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F4B740]" />
            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <div className="text-lg font-extrabold text-[#163D32] tabular-nums">
              {formatINR(property.rent)}
              <span className="text-xs font-medium text-[#747B75]"> / month</span>
            </div>
            <span className="text-xs font-medium text-[#747B75]">
              {property.listedBy}
            </span>
          </div>

          <h3
            onClick={() => navigate('property-detail', property.id)}
            className="text-base font-bold text-[#202822] line-clamp-1 hover:text-[#163D32] cursor-pointer transition-colors"
          >
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-[#747B75] mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#2E8B57]" />
            <span className="truncate">{property.locality}, {property.city}</span>
          </div>

          {/* Clean unboxed metadata with typographic separators */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#525B54] mt-3 pt-3 border-t border-[#F0F2F0] tabular-nums">
            {property.bhk > 0 ? (
              <>
                <span className="font-semibold text-[#202822]">{property.bhk} BHK</span>
                <span aria-hidden="true">·</span>
              </>
            ) : (
              <>
                <span className="font-semibold text-[#202822]">{property.type}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>{property.areaSqFt.toLocaleString('en-IN')} sq. ft.</span>
            <span aria-hidden="true">·</span>
            <span>{property.furnishing}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#747B75] tabular-nums">
            Deposit: {formatINR(property.deposit)}
          </span>
          <button
            onClick={() => navigate('property-detail', property.id)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#163D32] hover:text-[#2E8B57] transition-colors cursor-pointer"
          >
            View Details <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
