"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { IProduct } from "@/types";
import { getPrimaryImage, truncate } from "@/lib/utils";

interface Props {
  currentId: string;
  categoryId?: string;
}

export default function RelatedProducts({ currentId, categoryId }: Props) {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const params = new URLSearchParams({ limit: "4", isActive: "true" });
    if (categoryId) params.set("category", categoryId);

    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data.filter((p: IProduct) => p._id !== currentId).slice(0, 4));
        }
      });
  }, [currentId, categoryId]);

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-surface border-t border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="gold-line" />
              <span className="section-label">You Might Also Like</span>
            </div>
            <h2 className="font-display text-2xl text-neutral">Related Products</h2>
          </div>
          <Link href="/products" className="btn-outline-gold text-xs py-2.5 px-5">
            All Products <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link key={p._id} href={`/products/${p.slug}`} className="group block bg-primary border border-border rounded-sm hover:border-border-light hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={getPrimaryImage(p.images)}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="p-3">
                {p.category && <span className="section-label text-[9px] block mb-1">{p.category.name}</span>}
                <p className="text-neutral text-sm font-medium leading-snug group-hover:text-accent transition-colors">{p.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
