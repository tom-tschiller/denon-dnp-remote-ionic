export type MainZoneXmlStatus = {
    MasterVolume: number
    Model: string
    Power: Power
}

export enum Power {
    Standby = "STANDBY",
    On = "ON",
}

export type NetAudioStatus = {
    SzLine: string[]
    ChFlag: number[]
}