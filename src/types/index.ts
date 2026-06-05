export interface Reciter {
  id: string;
  name: string;
  nameArabic: string;
  type: "direct" | "soundcloud";
  urlTemplate?: string;
  clientId?: string;
  license: LicenseInfo;
}

export interface AudioTrack {
  id: string;
  reciterId: string;
  surahNumber: number;
  surahName?: string;
  surahNameArabic?: string;
  displayTitle?: string;
  soundcloudTrackId?: string;
  durationSeconds: number;
  license?: LicenseInfo;
}

export interface VideoClip {
  id: string;
  mosqueName: string;
  location: string;
  url: string;
  durationSeconds: number;
  license: LicenseInfo;
}

export interface LicenseInfo {
  source: string;
  author: string;
  terms: string;
  acquisitionDate: string;
}

export interface PlaylistManifest {
  title: string;
  videoRotationIntervalSeconds: number;
  reciters: Reciter[];
  audioTracks: AudioTrack[];
  videos: VideoClip[];
}

export type PlayerStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "error";

export interface PlayerState {
  status: PlayerStatus;
  currentTrackIndex: number;
  currentVideoIndex: number;
  progressSeconds: number;
  durationSeconds: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  error: string | null;
}
