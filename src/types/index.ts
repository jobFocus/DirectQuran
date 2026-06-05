export interface AudioTrack {
  id: string;
  surahName: string;
  surahNameArabic?: string;
  surahNumber: number;
  reciter: string;
  url: string;
  durationSeconds: number;
  license: LicenseInfo;
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
  audioTracks: AudioTrack[];
  videos: VideoClip[];
  videoRotationIntervalSeconds: number;
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
