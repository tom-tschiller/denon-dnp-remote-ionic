import { Command } from "./Command"
import { NetAudioStatus } from "./types"

export interface IDenonApiClient {
    executeCommand: (command: Command) => Promise<void>
    netAudioStatus: () => Promise<NetAudioStatus | null>
}