import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IProduct } from "@/types";
import { getPrimaryImage, truncate } from "@/lib/utils";

export default function ProductCard({ product }: { product: IProduct }) {
  const image = getPrimaryImage(product.images);

  return (
    <Link href={`/products/${product.slug}`} className="group block card-surface card-hover">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <Image
          src={image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay */}
        <div className="img-overlay opacity-40 group-hover:opacity-70 transition-opacity duration-300" />

        {/* Featured Badge */}
        {product.isFeatured && (
          <div className="absolute top-4 left-4">
            <span className="bg-accent text-primary text-[10px] font-label font-bold uppercase tracking-widest px-2.5 py-1">
              Featured
            </span>
          </div>
        )}

        {/* Quick View on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-2 bg-primary/90 text-accent border border-accent/50 px-5 py-2.5 font-label text-xs uppercase tracking-wider">
            View Details <ArrowRight size={13} />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        {product.category && (
          <span className="section-label text-[10px] mb-2 block">
            {product.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="font-display text-lg text-neutral group-hover:text-accent transition-colors duration-200 mb-2 leading-snug">
          {product.title}
        </h3>

        {/* Short Desc */}
        {product.shortDesc && (
          <p className="text-muted text-sm leading-relaxed mb-3">
            {truncate(product.shortDesc, 80)}
          </p>
        )}

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-label text-muted border border-border px-2 py-0.5 uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Gold line reveal on hover */}
      <div className="h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Link>
  );
}
