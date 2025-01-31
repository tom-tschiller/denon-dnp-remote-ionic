import { Command } from "./Command"
import { MainZoneXmlStatusLite, NetAudioStatus } from "./types"

export interface IDenonApiClient {
  setIp:(ip: string | undefined) => Promise<void>
  executeCommand: (command: Command) => Promise<void>
  mainStatusLite: () => Promise<MainZoneXmlStatusLite | null>
  netAudioStatus: () => Promise<NetAudioStatus | null>
}