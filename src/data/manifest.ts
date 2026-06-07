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
      id: "kaaba-1",
      mosqueName: "Kaaba Timelapse",
      location: "Makkah, Saudi Arabia",
      url: "/videos/kaaba-1.mp4",
      durationSeconds: 13,
      license: {
        source: "https://www.youtube.com/watch?v=mcs55EwaXFM",
        author: "FreeStockFootage (YouTube)",
        terms: "Free stock footage - no copyright",
        acquisitionDate: "2025-06-07",
      },
    },
    {
      id: "kaaba-2",
      mosqueName: "Kaaba Cinematic",
      location: "Makkah, Saudi Arabia",
      url: "/videos/kaaba-2.mp4",
      durationSeconds: 6,
      license: {
        source: "https://www.youtube.com/watch?v=2KvP3Khu5XY",
        author: "Free Stock Footage (YouTube)",
        terms: "Free stock footage - no copyright",
        acquisitionDate: "2025-06-07",
      },
    },
    {
      id: "quds-1",
      mosqueName: "Al-Aqsa Mosque Interior",
      location: "Jerusalem, Palestine",
      url: "/videos/quds-1.mp4",
      durationSeconds: 89,
      license: {
        source: "https://www.youtube.com/watch?v=MdAhl4tPDhA",
        author: "FreeStockFootage (YouTube)",
        terms: "Free stock footage - no copyright",
        acquisitionDate: "2025-06-07",
      },
    },
    {
      id: "quds-2",
      mosqueName: "Al-Aqsa Mosque Exterior",
      location: "Jerusalem, Palestine",
      url: "/videos/quds-2.mp4",
      durationSeconds: 6,
      license: {
        source: "https://www.youtube.com/watch?v=WG_cleby2B0",
        author: "Free Stock Footage (YouTube)",
        terms: "Free stock footage - no copyright",
        acquisitionDate: "2025-06-07",
      },
    },
  ],
  slideshowClips: [
    {
      id: "medina-1",
      mosqueName: "Masjid an-Nabawi",
      location: "Al-Madinah, Saudi Arabia",
      imageUrl: "/images/medina-1.jpg",
      durationSeconds: 20,
      license: {
        source: "https://pxhere.com/en/photo/1629482",
        author: "miftahi (PxHere CC0)",
        terms: "CC0 Public Domain - Free for commercial use, no attribution required",
        acquisitionDate: "2025-06-01",
      },
    },
    {
      id: "medina-2",
      mosqueName: "Masjid an-Nabawi - Green Dome",
      location: "Al-Madinah, Saudi Arabia",
      imageUrl: "/images/medina-2.jpg",
      durationSeconds: 20,
      license: {
        source: "https://pxhere.com/en/photo/1629487",
        author: "miftahi (PxHere CC0)",
        terms: "CC0 Public Domain - Free for commercial use, no attribution required",
        acquisitionDate: "2025-06-01",
      },
    },
  ],
};

export default manifest;
