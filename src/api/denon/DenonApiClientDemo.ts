import { Command } from "./Command";
import { IDenonApiClient } from "./IDenonApiClient";
import { MainZoneXmlStatus, NetAudioStatus, Power } from "./types";

export class DenonApiClientDemo implements IDenonApiClient {

    private mainZoneXmlStatusData = <MainZoneXmlStatus>{};

    private netAudioStatusData = <NetAudioStatus>{};

    constructor(
    ) {
        this.mainZoneXmlStatusData.Power = Power.Standby
        this.mainZoneXmlStatusData.MasterVolume = -80.0
        this.mainZoneXmlStatusData.Model = "720 E2"

        this.netAudioStatusData.SzLine = ["Line01", "Line02", "Line03", "Line04", "Line05", "Line06", "Line07", "Line08", "Line09", "Line10"];
        this.netAudioStatusData.ChFlag = [8, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    public async executeCommand(command: Command){
        console.log("execute command: " + command)

        if(command == Command.CursorUp){
            this.netAudioStatusData.ChFlag.push(this.netAudioStatusData.ChFlag.shift() ?? 0)
        }
        if(command == Command.CursorDown){
            this.netAudioStatusData.ChFlag.unshift(this.netAudioStatusData.ChFlag.pop() ?? 0)
        }
    }

    public async netAudioStatus(): Promise<NetAudioStatus | null> {
        return this.netAudioStatusData
    }
}