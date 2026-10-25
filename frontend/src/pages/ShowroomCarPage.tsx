import {
  showroomProfiles,
  type ShowroomProfile,
} from "../data/showroomProfiles";

interface Props {
  profile: ShowroomProfile;
  onBack: () => void;
  onNavigate: (slug: string) => void;
}

export function ShowroomCarPage({ profile, onBack, onNavigate }: Props) {
  const related = showroomProfiles
    .filter((item) => item.slug !== profile.slug)
    .slice(0, 3);
  const videoUrl = `https://www.youtube.com/watch?v=${profile.inspiration.videoId}`;

  return (
    <article>
      <button
        onClick={onBack}
        className="mb-6 text-sm font-semibold text-stone-300 hover:text-white"
      >
        ← All cars
      </button>
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#171717]">
        <img
          src={profile.image}
          alt={`Illustrative ${profile.model} concept`}
          className="h-[360px] w-full object-cover sm:h-[580px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
            Northstar design concept · {profile.category}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Northstar {profile.model}
          </h1>
          <p className="mt-3 text-lg text-stone-200">{profile.tagline}</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-stone-400">
        Illustrative image and model. Northstar showroom concepts are fictional,
        not live inventory or orderable production vehicles.
      </p>

      <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.7fr)]">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
            The idea
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Meet {profile.model}
          </h2>
          <p className="mt-5 text-lg leading-8 text-stone-300">
            {profile.story}
          </p>
        </section>
        <aside className="rounded-3xl border border-red-900/50 bg-gradient-to-br from-[#2a0808] to-[#171717] p-6">
          <h2 className="text-xl font-bold">Concept highlights</h2>
          <ul className="mt-5 space-y-4 text-sm text-stone-200">
            {profile.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3">
                <span className="text-red-400">✦</span>
                {highlight}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="mt-16">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
          Explore the vision
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Design, cabin & drive
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { title: "Exterior design", copy: profile.design },
            { title: "Cabin concept", copy: profile.cabin },
            { title: "Driving character", copy: profile.drive },
          ].map((part) => (
            <div
              key={part.title}
              className="rounded-3xl border border-stone-800 bg-[#171717] p-6"
            >
              <h3 className="text-xl font-bold">{part.title}</h3>
              <p className="mt-4 text-sm leading-7 text-stone-400">
                {part.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-stone-800 bg-[#171717] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-400">
          Performance inspiration
        </p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          See a real car in motion
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-400">
          This official {profile.inspiration.maker} YouTube video shows a real
          vehicle for inspiration. It does not depict Northstar {profile.model}{" "}
          or demonstrate its performance; no such footage or verified
          performance figures exist for this fictional concept.
        </p>
        <div className="mt-6 aspect-video max-w-4xl overflow-hidden rounded-2xl bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${profile.inspiration.videoId}`}
            title={`${profile.inspiration.title} — real-car inspiration, not Northstar ${profile.model}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex rounded-full border border-stone-600 px-5 py-2.5 text-sm font-semibold text-white hover:border-red-500"
        >
          Watch “{profile.inspiration.title}” on YouTube ↗
        </a>
      </section>

      <section className="mt-16 rounded-3xl border border-stone-800 bg-stone-900 p-6 text-sm leading-7 text-stone-400 sm:p-8">
        <h2 className="text-xl font-bold text-white">A note on concept cars</h2>
        <p className="mt-2">
          All descriptions on this page are creative design briefs, not tested
          specifications. The showroom price shown elsewhere is illustrative. No
          payment, order or reservation is possible for this concept.
        </p>
      </section>

      <section className="mt-20">
        <h2 className="text-3xl font-bold tracking-tight">Keep exploring</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {related.map((item) => (
            <button
              key={item.slug}
              onClick={() => onNavigate(item.slug)}
              className="overflow-hidden rounded-2xl border border-stone-800 bg-[#171717] text-left transition hover:border-red-500"
            >
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
              <span className="block p-5 font-bold">
                Northstar {item.model} <span className="text-red-400">↗</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}
