import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  Users,
} from "lucide-react";

const POSTS = [
  {
    handle: "@maya",
    time: "12m",
    text: "Tirbeo Collab just launched a new private space for creators.",
    likes: "1.5K",
    replies: "127",
  },
  {
    handle: "@devon",
    time: "34m",
    text: "The new workspace controls are clean and private — finally.",
    likes: "3.7K",
    replies: "258",
  },
  {
    handle: "@studio",
    time: "1h",
    text: "Live session Friday at 6PM. Bringing the whole design team.",
    likes: "1.2K",
    replies: "97",
  },
];

const TRENDING = [
  { name: "Design Culture", members: "128K" },
  { name: "Builders", members: "94K" },
  { name: "Indie Creators", members: "210K" },
];

export function AppPreview() {
  return (
    <section className="relative overflow-hidden bg-[#f5f1e8] px-4 py-24 text-[#171612] sm:px-6 lg:px-8">

      {/* Decorative blocks */}

      <motion.div
        animate={{ rotate: [8, 11, 8], y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-12 top-20 hidden h-32 w-32 border-2 border-black bg-[#ffd83d] lg:block"
      />

      <motion.div
        animate={{ rotate: [-8, -5, -8], y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-10 bottom-20 hidden h-40 w-40 border-2 border-black bg-[#f47fa5] lg:block"
      />

      <motion.div
        animate={{ rotate: [5, 8, 5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[12%] top-16 hidden h-16 w-16 border-2 border-black bg-[#79a9ef] lg:block"
      />

      <div className="relative mx-auto max-w-6xl">

        {/* Heading */}

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-5 inline-flex border-2 border-black bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] shadow-[3px_3px_0_#171612]">
            <span className="mr-2 text-[#ffb800]">✦</span>
            Meet Tirbeo
          </div>

          <h2 className="text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            WHERE PEOPLE
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">CONNECT.</span>
              <span className="absolute inset-x-0 bottom-1 -z-0 h-4 bg-[#ffd83d] sm:h-6" />
            </span>
            <br />
            CREATE. BELONG.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-[#69665d] sm:text-base">
            A new way for communities, creators, and teams to connect,
            collaborate, and build something meaningful together.
          </p>
        </div>

        {/* Main preview */}

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >

          {/* Shadow layer */}

          <div className="absolute inset-0 translate-x-2 translate-y-2 border-2 border-black bg-black" />

          {/* Window */}

          <div className="relative overflow-hidden border-2 border-black bg-[#fffdf7]">

            {/* Top bar */}

            <div className="flex items-center justify-between border-b-2 border-black bg-white px-4 py-3 sm:px-6">

              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="size-3 border border-black bg-[#ff6f61]" />
                  <span className="size-3 border border-black bg-[#ffd83d]" />
                  <span className="size-3 border border-black bg-[#71d99b]" />
                </div>

                <span className="ml-3 hidden text-[10px] font-black uppercase tracking-[0.25em] sm:block">
                  Tirbeo / Community
                </span>
              </div>

              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-[#77736a]">
                Live Preview
              </div>

            </div>

            {/* Content */}

            <div className="grid lg:grid-cols-[190px_1fr_220px]">

              {/* Sidebar */}

              <aside className="hidden border-r-2 border-black bg-[#f1eee5] p-5 lg:block">

                <div className="mb-7 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center border-2 border-black bg-[#ffd83d] text-xs font-black shadow-[2px_2px_0_#171612]">
                    T
                  </div>

                  <div>
                    <p className="text-xs font-black">@tirbeo</p>
                    <p className="text-[9px] uppercase tracking-wider text-[#77736a]">
                      Community
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  {[
                    "Overview",
                    "Spaces",
                    "Notifications",
                    "Integrations",
                    "Insights",
                    "Settings",
                  ].map((item, i) => (
                    <div
                      key={item}
                      className={`border-2 px-3 py-2 text-[10px] font-black uppercase tracking-wider ${
                        i === 0
                          ? "border-black bg-[#ffd83d]"
                          : "border-transparent hover:border-black"
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

              </aside>

              {/* Feed */}

              <main className="border-b-2 border-black p-4 sm:p-6 lg:border-b-0 lg:border-r-2">

                <div className="mb-5 flex items-center justify-between border-b-2 border-black pb-4">
                  <div>
                    <p className="text-lg font-black uppercase tracking-tight">
                      Community Feed
                    </p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#77736a]">
                      What's happening now
                    </p>
                  </div>

                  <span className="flex items-center gap-2 border-2 border-black bg-[#71d99b] px-2 py-1 text-[9px] font-black uppercase">
                    <span className="size-1.5 bg-black" />
                    Live
                  </span>
                </div>

                <div className="space-y-3">

                  {POSTS.map((post, index) => (
                    <motion.article
                      key={post.handle}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                      }}
                      whileHover={{ y: -3 }}
                      className="border-2 border-black bg-white p-4 shadow-[3px_3px_0_#171612]"
                    >

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-9 items-center justify-center border-2 border-black text-[10px] font-black ${
                            index === 0
                              ? "bg-[#ff91b5]"
                              : index === 1
                                ? "bg-[#79a9ef]"
                                : "bg-[#71d99b]"
                          }`}
                        >
                          {post.handle.slice(1, 3).toUpperCase()}
                        </div>

                        <div>
                          <p className="text-xs font-black">
                            {post.handle}
                          </p>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#77736a]">
                            {post.time}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-sm font-medium leading-6">
                        {post.text}
                      </p>

                      <div className="mt-4 flex items-center gap-4 border-t border-black/10 pt-3 text-[10px] font-bold uppercase tracking-wider text-[#77736a]">

                        <span className="flex items-center gap-1.5">
                          <Heart className="size-3.5" />
                          {post.likes}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <MessageCircle className="size-3.5" />
                          {post.replies}
                        </span>

                        <span className="ml-auto flex items-center gap-1.5">
                          Share
                          <Share2 className="size-3.5" />
                        </span>

                      </div>

                    </motion.article>
                  ))}

                </div>

              </main>

              {/* Trending */}

              <aside className="hidden bg-[#f1eee5] p-5 lg:block">

                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#77736a]">
                  Trending Communities
                </p>

                <div className="mt-5 space-y-4">

                  {TRENDING.map((community, index) => (
                    <div
                      key={community.name}
                      className="border-b border-black/20 pb-4"
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className={`flex size-9 items-center justify-center border-2 border-black ${
                            index === 0
                              ? "bg-[#ffd83d]"
                              : index === 1
                                ? "bg-[#79a9ef]"
                                : "bg-[#ff91b5]"
                          }`}
                        >
                          <Users className="size-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-black">
                            {community.name}
                          </p>

                          <p className="text-[9px] font-bold uppercase tracking-wider text-[#77736a]">
                            {community.members} members
                          </p>
                        </div>

                      </div>

                      <button className="mt-3 w-full border-2 border-black bg-white px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition hover:bg-black hover:text-white">
                        Join Community
                      </button>

                    </div>
                  ))}

                </div>

              </aside>

            </div>

            {/* Bottom bar */}

            <div className="flex flex-col gap-2 border-t-2 border-black bg-black px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">

              <span className="flex items-center gap-2">
                <span className="size-2 bg-[#71d99b]" />
                Private & Secure
              </span>

              <span>
                Built for real conversations.
              </span>

            </div>

          </div>
        </motion.div>

        {/* CTA underneath */}

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <Link
            to="/explore"
            className="group flex items-center gap-3 border-2 border-black bg-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-[4px_4px_0_#ffd83d] transition hover:-translate-y-1"
          >
            Explore Tirbeo
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            to="/how-it-works"
            className="border-2 border-black bg-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] shadow-[3px_3px_0_#171612] transition hover:-translate-y-1"
          >
            See How It Works
          </Link>

        </div>

      </div>
    </section>
  );
}