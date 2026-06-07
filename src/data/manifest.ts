import type { PlaylistManifest } from "@/types";

const HAZZA_LICENSE = {
  source: "https://server11.mp3quran.net/",
  author: "Hazza Al-Baloushi / mp3quran.net",
  terms: "Free for non-commercial use. Quranic audio from mp3quran.net.",
  acquisitionDate: "2025-06-01",
} as const;

const OMAR_LICENSE = {
  source: "https://soundcloud.com/omarsab32",
  author: "Omar Al-Sab' (عمر السبع) / SoundCloud",
  terms: "Free for non-commercial use. Audio retrieved via SoundCloud API.",
  acquisitionDate: "2025-06-01",
} as const;

const manifest: PlaylistManifest = {
  title: "Quran Mosque Experience",
  videoRotationIntervalSeconds: 120,

  reciters: [
    {
      id: "hazza",
      name: "Hazza Al-Baloushi",
      nameArabic: "هزاع البلوشي",
      type: "direct",
      urlTemplate: "https://server11.mp3quran.net/download/hazza/{surah}.mp3",
      license: HAZZA_LICENSE,
    },
    {
      id: "omar",
      name: "Omar Al-Sab'",
      nameArabic: "عمر السبع",
      type: "soundcloud",
      clientId: "Yks9HNwSpw5Bo7goMq3jv8cyDYgoLpZr",
      license: OMAR_LICENSE,
    },
  ],

  audioTracks: [
    // Hazza Al-Baloushi: 114 surahs
    ...Array.from({ length: 114 }, (_, i) => {
      const n = i + 1;
      const padded = String(n).padStart(3, "0");
      return {
        id: `hazza-${padded}`,
        reciterId: "hazza" as const,
        surahNumber: n,
        durationSeconds: 0,
      };
    }),

    // Omar Al-Sab': 7 tracks from SoundCloud
    {
      id: "omar-001",
      reciterId: "omar",
      surahNumber: 2,
      displayTitle: "ليلة 1 رمضان 2016 - سورة البقرة",
      soundcloudTrackId: "267825858",
      durationSeconds: 3900,
      license: OMAR_LICENSE,
    },
    {
      id: "omar-002",
      reciterId: "omar",
      surahNumber: 2,
      displayTitle: "ليلة 2 رمضان - سورة البقرة",
      soundcloudTrackId: "267973046",
      durationSeconds: 3900,
      license: OMAR_LICENSE,
    },
    {
      id: "omar-003",
      reciterId: "omar",
      surahNumber: 2,
      displayTitle: "ليلة 3 رمضان - سورة البقرة",
      soundcloudTrackId: "268163922",
      durationSeconds: 3900,
      license: OMAR_LICENSE,
    },
    {
      id: "omar-004",
      reciterId: "omar",
      surahNumber: 2,
      displayTitle: "ليلة 4 رمضان 2016 - البقرة",
      soundcloudTrackId: "268318556",
      durationSeconds: 3900,
      license: OMAR_LICENSE,
    },
    {
      id: "omar-005",
      reciterId: "omar",
      surahNumber: 3,
      displayTitle: "ليلة 5 رمضان 2016 - آخر البقرة و أول ال عمران",
      soundcloudTrackId: "268552315",
      durationSeconds: 1722,
      license: OMAR_LICENSE,
    },
    {
      id: "omar-006",
      reciterId: "omar",
      surahNumber: 78,
      displayTitle: "سورة النبأ",
      soundcloudTrackId: "145672784",
      durationSeconds: 480,
      license: OMAR_LICENSE,
    },
    {
      id: "omar-007",
      reciterId: "omar",
      surahNumber: 9,
      displayTitle: "آيات التوبة",
      soundcloudTrackId: "144568525",
      durationSeconds: 600,
      license: OMAR_LICENSE,
    },
  ],

  videos: [
    {
      id: "drone-mosque",
      mosqueName: "Drone Footage of a Mosque",
      location: "Dagestan, Russia",
      url: "/videos/drone-mosque.mp4",
      durationSeconds: 18,
      license: {
        source: "https://www.pexels.com/video/drone-footage-of-a-mosque-6576070/",
        author: "Khalid Khalitov (Pexels)",
        terms: "Free for commercial use, no attribution required (Pexels License)",
        acquisitionDate: "2025-06-07",
      },
    },
    {
      id: "blue-mosque",
      mosqueName: "The Blue Mosque",
      location: "Istanbul, Turkey",
      url: "/videos/blue-mosque.mp4",
      durationSeconds: 13,
      license: {
        source: "https://www.pexels.com/video/the-blue-mosque-in-istanbul-turkey-16192402/",
        author: "Yiğit Ali Atak (Pexels)",
        terms: "Free for commercial use, no attribution required (Pexels License)",
        acquisitionDate: "2025-06-07",
      },
    },
    {
      id: "mosque-interior",
      mosqueName: "Serene Mosque Interior",
      location: "Istanbul, Turkey",
      url: "/videos/mosque-interior.mp4",
      durationSeconds: 8,
      license: {
        source: "https://www.pexels.com/video/serene-mosque-interior-with-red-carpet-36192723/",
        author: "Villefranche Lyon (Pexels)",
        terms: "Free for commercial use, no attribution required (Pexels License)",
        acquisitionDate: "2025-06-07",
      },
    },
    {
      id: "istanbul-evening",
      mosqueName: "Istanbul New Mosque at Evening",
      location: "Istanbul, Turkey",
      url: "/videos/istanbul-evening.mp4",
      durationSeconds: 13,
      license: {
        source: "https://www.pexels.com/video/evening-at-istanbul-s-new-mosque-36222459/",
        author: "Murat ACAR (Pexels)",
        terms: "Free for commercial use, no attribution required (Pexels License)",
        acquisitionDate: "2025-06-07",
      },
    },
    {
      id: "clear-sky-mosque",
      mosqueName: "Mosque Under Clear Sky",
      location: "Turkey",
      url: "/videos/clear-sky-mosque.mp4",
      durationSeconds: 16,
      license: {
        source: "https://www.pexels.com/video/clear-sky-over-mosque-10779949/",
        author: "Rohit Bhardwaj (Pexels)",
        terms: "Free for commercial use, no attribution required (Pexels License)",
        acquisitionDate: "2025-06-07",
      },
    },
    {
      id: "selimiye-mosque",
      mosqueName: "Selimiye Mosque Aerial View",
      location: "Edirne, Turkey",
      url: "/videos/selimiye-mosque.mp4",
      durationSeconds: 6,
      license: {
        source: "https://www.pexels.com/video/aerial-view-of-selimiye-mosque-in-edirne-31815502/",
        author: "Furkan Türker (Pexels)",
        terms: "Free for commercial use, no attribution required (Pexels License)",
        acquisitionDate: "2025-06-07",
      },
    },
  ],
};

export default manifest;
