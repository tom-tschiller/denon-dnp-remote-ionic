export type MainZoneXmlStatusLite = {
  MasterVolume: number
  InputFuncSelect: InputFuncSelect
  Power: Power
}

export type MainZoneXmlStatus = {
  MasterVolume: number
  Model: string
  Power: Power
}

export enum InputFuncSelect {
  Unknown = '',
  Tuner = "TUNER",
  Rhapsody = "RHAPSODY",
  Napster = "NAPSTER",
  Pandora = "PANDORA",
  LastFm = "LASTFM",
  InternetRadio = "IRADIO",
  MusicServer = "SERVER",
  Usb = "USB",
}

export enum Power {
  Standby = "STANDBY",
  On = "ON",
}

export type NetAudioStatus = {
  SzLine: string[]
  ChFlag: number[]
}