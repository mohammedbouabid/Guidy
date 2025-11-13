import React from "react";
import { motion } from "framer-motion";
import { Compass, Users2, MapPin, Star, ShieldCheck, Globe2 } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Compass,
      title: "Expériences Authentiques",
      description:
        "Des circuits taillés sur mesure avec des experts locaux passionnés par leur région.",
      gradient: "from-[#EB662B] via-orange-500 to-amber-400",
    },
    {
      icon: Users2,
      title: "Communauté Engagée",
      description:
        "Une équipe de guides sélectionnés pour leur savoir-faire et leur sens du partage.",
      gradient: "from-indigo-500 via-blue-500 to-sky-400",
    },
    {
      icon: ShieldCheck,
      title: "Fiabilité & Confiance",
      description:
        "Paiements sécurisés, assistance 24/7 et accompagnement avant, pendant et après le voyage.",
      gradient: "from-emerald-500 via-green-500 to-lime-400",
    },
  ];

  const stats = [
    { label: "Voyageurs satisfaits", value: "12K+" },
    { label: "Destinations", value: "60+" },
    { label: "Guides vérifiés", value: "120" },
    { label: "Note moyenne", value: "4.9/5" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/40 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-radial from-[#EB662B]/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center"
          >
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-[#EB662B]">
                <Globe2 size={18} /> À propos de Planova
              </span>
              <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
                Créez des souvenirs inoubliables grâce à nos guides locaux d'exception
              </h1>
              <p className="text-lg text-gray-600">
                Depuis 2021, Planova connecte les voyageurs aux meilleurs experts du territoire pour des
                expériences immersives et responsables. Nous avons construit une plateforme qui facilite la
                rencontre entre curiosité, authenticité et professionnalisme.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-orange-100 bg-white/70 px-6 py-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-3xl font-bold text-[#EB662B]">{stat.value}</p>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="rounded-3xl bg-gradient-to-br from-white via-orange-100/60 to-white p-8 shadow-xl">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#EB662B] to-orange-500 p-8 text-white">
                  <div className="flex h-full flex-col items-start justify-between">
                    <Star className="mb-6 h-10 w-10 text-white/80" />
                    <div>
                      <h2 className="text-3xl font-bold">Notre mission</h2>
                      <p className="mt-3 text-sm text-orange-100">
                        Faire du voyage une expérience humaine enrichissante et durable pour les guides comme pour les clients.
                      </p>
                    </div>
                    <MapPin className="mt-6 h-10 w-10 text-white/80" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Ce qui nous rend uniques</h2>
            <p className="mt-3 text-gray-500">
              Une plateforme née d'une passion pour le voyage, nourrie par la volonté de proposer une hospitalité sincère.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {highlights.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -6 }}
                className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-lg transition-shadow hover:shadow-2xl"
              >
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-xl transition-transform group-hover:scale-105`}
                >
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#EB662B] via-orange-500 to-amber-400 opacity-90" />
        <div className="container mx-auto px-4 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-semibold sm:text-4xl"
          >
            Rejoignez l'aventure Planova aujourd'hui
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-base text-orange-100"
          >
            Explorez nos expériences, devenez guide, ou commencez à planifier votre prochain voyage.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="/filter"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#EB662B] shadow-lg transition hover:-translate-y-1 hover:bg-orange-50"
            >
              Explorer les expériences
            </a>
            <a
              href="/GuideRegister"
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/10"
            >
              Devenir guide partenaire
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
