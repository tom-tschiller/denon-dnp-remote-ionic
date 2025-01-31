import { Command } from "./Command";
import { IDenonApiClient } from "./IDenonApiClient";
import { MainZoneXmlStatusLite, MainZoneXmlStatus, NetAudioStatus, Power, InputFuncSelect } from "./types";

export class DenonApiClientDemo implements IDenonApiClient {

  private mainZoneXmlStatusLiteData = <MainZoneXmlStatusLite>{};

  // private mainZoneXmlStatusData = <MainZoneXmlStatus>{};

  private netAudioStatusData = <NetAudioStatus>{};

  public isIpSet: boolean = false
  public isAvailable: boolean = false;
  public isOn: boolean = false;

  constructor(
  ) {
    console.log("init DenonApiClientDemo")

    this.mainZoneXmlStatusLiteData.InputFuncSelect = InputFuncSelect.Unknown
    this.mainZoneXmlStatusLiteData.MasterVolume = -80.0
    this.mainZoneXmlStatusLiteData.Power = Power.Standby

    // this.mainZoneXmlStatusData.Power = Power.Standby
    // this.mainZoneXmlStatusData.MasterVolume = -80.0
    // this.mainZoneXmlStatusData.Model = "720 E2"

    this.netAudioStatusData.SzLine = ["Line01", "Line02", "Line03", "Line04", "Line05", "Line06", "Line07", "Line08", "Line09", "Line10"];
    this.netAudioStatusData.ChFlag = [8, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  public async setIp(ip: string | undefined) {
    console.log("set ip to: " + ip)
    if (ip) {
      this.isIpSet = true
    }
    else {
      this.isIpSet = false
    }
  }

  public async checkAvailability() {
    console.log("check availability")

    await new Promise(resolve => setTimeout(resolve, 200));

    this.isAvailable = true
    this.isOn = this.mainZoneXmlStatusLiteData.Power == Power.On
  }

  public async executeCommand(command: Command) {
    console.log("execute command: " + command)

    await new Promise(resolve => setTimeout(resolve, 200));

    if (command == Command.PowerOn) {
      this.mainZoneXmlStatusLiteData.Power = Power.On
    }
    if (command == Command.PowerStandby) {
      this.mainZoneXmlStatusLiteData.Power = Power.Standby
    }

    if (command == Command.CursorUp) {
      this.netAudioStatusData.ChFlag.push(this.netAudioStatusData.ChFlag.shift() ?? 0)
    }
    if (command == Command.CursorDown) {
      this.netAudioStatusData.ChFlag.unshift(this.netAudioStatusData.ChFlag.pop() ?? 0)
    }

    if (command == Command.SourceInternetRadio) {
      this.mainZoneXmlStatusLiteData.InputFuncSelect = InputFuncSelect.InternetRadio
    }
    if (command == Command.SourceServer) {
      this.mainZoneXmlStatusLiteData.InputFuncSelect = InputFuncSelect.MusicServer
    }
  }

  public async mainStatusLite(): Promise<MainZoneXmlStatusLite | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return this.mainZoneXmlStatusLiteData
  }

  public async netAudioStatus(): Promise<NetAudioStatus | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.netAudioStatusData
  }
}