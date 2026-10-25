import { useEffect, useState } from "react";
import { iconicCars } from "../data/iconicCars";
import { showroomProfiles } from "../data/showroomProfiles";

const slides = [
  ...iconicCars.map((car) => ({
    id: car.slug,
    name: `${car.brand} ${car.name}`,
    image: car.image,
    kind: "Real-world icon",
    tagline: car.headline,
    type: "iconic" as const,
  })),
  ...showroomProfiles.map((car) => ({
    id: car.slug,
    name: `Northstar ${car.model}`,
    image: car.image,
    kind: "Design concept",
    tagline: car.tagline,
    type: "showroom" as const,
  })),
];

interface Props {
  onOpenIconic: (slug: string) => void;
  onOpenShowroom: (slug: string) => void;
}

export function FeaturedCarousel({ onOpenIconic, onOpenShowroom }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const slide = slides[index];

  useEffect(() => {
    if (
      paused ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  const move = (direction: number) =>
    setIndex(
      (current) => (current + direction + slides.length) % slides.length,
    );
  const open = () =>
    slide.type === "iconic" ? onOpenIconic(slide.id) : onOpenShowroom(slide.id);

  return (
    <section
      aria-label="Swipe through all featured cars"
      className="mt-12 overflow-hidden rounded-[2rem] border border-stone-800 bg-[#171717]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
      onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const delta = event.changedTouches[0]?.clientX - touchStart;
        if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1);
        setTouchStart(null);
      }}
    >
      <div className="relative min-h-[380px] sm:min-h-[500px]">
        <img
          key={slide.id}
          src={slide.image}
          alt={`Illustrative portrait of ${slide.name}`}
          className="carousel-enter absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-transparent" />
        <div className="relative flex min-h-[380px] flex-col justify-end p-7 sm:min-h-[500px] sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
            The moving gallery · {slide.kind}
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-black tracking-[-0.05em] sm:text-5xl">
            {slide.name}
          </h2>
          <p className="mt-3 max-w-md text-stone-200">{slide.tagline}</p>
          <button
            onClick={open}
            className="mt-6 w-fit rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-500"
          >
            Explore this car ↗
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-6 py-4 sm:px-10">
        <p className="text-sm font-semibold text-stone-300">
          <span aria-live="polite">{String(index + 1).padStart(2, "0")}</span> /{" "}
          {String(slides.length).padStart(2, "0")}{" "}
          <span className="ml-2 hidden text-stone-500 sm:inline">
            Swipe or use the arrows
          </span>
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous car"
            onClick={() => move(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-stone-600 text-white hover:border-red-500"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next car"
            onClick={() => move(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-stone-600 text-white hover:border-red-500"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
