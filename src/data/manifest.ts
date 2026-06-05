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
      id: "mosque-dome-249389",
      mosqueName: "Masjid al-Haram (Mecca)",
      location: "Makkah, Saudi Arabia",
      url: "https://cdn.pixabay.com/video/2024/12/28/249389_large.mp4",
      durationSeconds: 30,
      license: {
        source: "https://pixabay.com/videos/dome-mosque-architecture-building-249389/",
        author: "Fajaryogaprawiranta (Pixabay)",
        terms: "Pixabay License - Free for commercial use, no attribution required",
        acquisitionDate: "2025-06-01",
      },
    },
    {
      id: "islamic-mosque-281015",
      mosqueName: "Masjid an-Nabawi (Medina)",
      location: "Al-Madinah, Saudi Arabia",
      url: "https://cdn.pixabay.com/video/2025/05/23/281015_large.mp4",
      durationSeconds: 30,
      license: {
        source: "https://pixabay.com/videos/islam-mosque-muslim-quran-culture-281015/",
        author: "Mosque_Ai (Pixabay)",
        terms: "Pixabay License - Free for commercial use, no attribution required",
        acquisitionDate: "2025-06-01",
      },
    },
    {
      id: "mosque-dome-131292",
      mosqueName: "Al-Aqsa Mosque (Jerusalem)",
      location: "Jerusalem, Palestine",
      url: "https://cdn.pixabay.com/video/2022/09/14/131292-749647627_large.mp4",
      durationSeconds: 60,
      license: {
        source: "https://pixabay.com/videos/dome-mosque-architecture-building-131292/",
        author: "samirsmier (Pixabay)",
        terms: "Pixabay License - Free for commercial use, no attribution required",
        acquisitionDate: "2025-06-01",
      },
    },
    {
      id: "mosque-exterior-40704",
      mosqueName: "Umayyad Mosque (Damascus)",
      location: "Damascus, Syria",
      url: "https://cdn.pixabay.com/video/2020/05/31/40704-426189550_large.mp4",
      durationSeconds: 50,
      license: {
        source: "https://pixabay.com/videos/mosque-architecture-building-40704/",
        author: "Coverr-Free-Footage (Pixabay)",
        terms: "Pixabay License - Free for commercial use, no attribution required",
        acquisitionDate: "2025-06-01",
      },
    },
    {
      id: "islamic-video-281205",
      mosqueName: "Sultan Ahmed Mosque (Istanbul)",
      location: "Istanbul, Turkey",
      url: "https://cdn.pixabay.com/video/2025/05/24/281205_large.mp4",
      durationSeconds: 25,
      license: {
        source: "https://pixabay.com/videos/islam-mosque-muslim-quran-culture-281205/",
        author: "Mosque_Ai (Pixabay)",
        terms: "Pixabay License - Free for commercial use, no attribution required",
        acquisitionDate: "2025-06-01",
      },
    },
    {
      id: "islamic-video-282336",
      mosqueName: "Hassan II Mosque (Casablanca)",
      location: "Casablanca, Morocco",
      url: "https://cdn.pixabay.com/video/2025/05/29/282336_large.mp4",
      durationSeconds: 30,
      license: {
        source: "https://pixabay.com/videos/islam-mosque-muslim-quran-culture-282336/",
        author: "Mosque_Ai (Pixabay)",
        terms: "Pixabay License - Free for commercial use, no attribution required",
        acquisitionDate: "2025-06-01",
      },
    },
  ],
};

export default manifest;
