import { Command } from "./Command"
import { DenonApiClient } from "./DenonApiClient"
import { DenonApiClientDemo } from "./DenonApiClientDemo"
import { IDenonApiClient } from "./IDenonApiClient"
import { MainZoneXmlStatusLite, NetAudioStatus, Power } from "./types"

export class DenonDeviceController {
  public isIpSet: boolean = false
  public isAvailable: boolean = false
  public isOn: boolean = false

  private ip: string | undefined = undefined
  private client: IDenonApiClient

  constructor(demoMode: boolean) {
    if (demoMode) {
      this.client = new DenonApiClientDemo()
    }
    else {
      this.client = new DenonApiClient()
    }
  }

  public getIp(): string {
    return this.ip ?? "not set"
  }

  private interval: NodeJS.Timeout | undefined

  public async setIp(ip: string | undefined) {
    this.ip = ip
    this.client.setIp(ip)

    this.isIpSet = ip != undefined

    if (this.interval) {
      clearInterval(this.interval)
    }
    if (this.isIpSet) {
      this.interval = setInterval(this.checkAvailability, 5 * 1000)
    }
  }

  public async checkAvailability() {
    console.log("check availability")

    if (this.isIpSet) {
      const mainStatusLite = await this.client.mainStatusLite()
      this.isAvailable = mainStatusLite != null
      this.isOn = mainStatusLite?.Power == Power.On
    }
    else{
      this.isAvailable = false
      this.isOn = false
    }
  }

  public async executeCommand(command: Command) {
    return await this.client.executeCommand(command)
  }

  public async mainStatusLite(): Promise<MainZoneXmlStatusLite | null> {
    return await this.client.mainStatusLite()
  }

  public async netAudioStatus(): Promise<NetAudioStatus | null> {
    return await this.client.netAudioStatus()
  }
}