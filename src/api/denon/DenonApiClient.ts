import { XMLParser, X2jOptions } from "fast-xml-parser"
import { MainZoneXmlStatus, MainZoneXmlStatusLite, NetAudioStatus, Power } from "./types";
import { IDenonApiClient } from "./IDenonApiClient";
import { Command } from "./Command";

export class DenonApiClient implements IDenonApiClient {
  private baseUrlCommand: string = ''
  private baseUrlMainZoneXmlStatus: string = ''
  private baseUrlMainZoneXmlStatusLite: string = ''
  private baseUrlNetAudioStatus: string = ''

  private xmlParserOptions: X2jOptions = {
    ignoreDeclaration: true,
  }

  constructor() {
  }

  public async setIp(ip: string | undefined) {
    console.log("set ip to: " + ip)
    if (ip) {
      this.baseUrlCommand = `http://${ip}/goform/formiPhoneAppDirect.xml`
      this.baseUrlMainZoneXmlStatus = `http://${ip}/goform/formMainZone_MainZoneXmlStatus.xml`
      this.baseUrlMainZoneXmlStatusLite = `http://${ip}/goform/formMainZone_MainZoneXmlStatusLite.xml`
      this.baseUrlNetAudioStatus = `http://${ip}/goform/formNetAudio_StatusXml.xml`
    }
    else {
    }
  }

  private async sendCommand(command: string) {
    await fetch(`${this.baseUrlCommand}?${command}`)
      .then(async response => {
        if (response.ok) {
        }
      })
  }

  public async executeCommand(command: Command) {
    console.log("execute command: " + command)
    await this.sendCommand(command)
  }

  public async mainStatus() {
    await fetch(this.baseUrlMainZoneXmlStatus)
      .then(async response => {
        if (response.ok) {
          const data = await response.text()

          // const alwaysArray = [
          //     "item.InputFuncList",
          //     "item.RenameSource.value"
          // ];
          const options = {
            ignoreDeclaration: true,
            // isArray: (name, jpath, isLeafNode, isAttribute) => {
            //   if (alwaysArray.indexOf(jpath) !== -1) return true;
            // }
          }

          const parser = new XMLParser(options)
          const xmlData = parser.parse(data).item


          const mainZoneXmlStatus = <MainZoneXmlStatus>{};
          mainZoneXmlStatus.MasterVolume = xmlData.MasterVolume.value
          switch (xmlData.Power.value) {
            case "STANDBY":
              mainZoneXmlStatus.Power = Power.Standby
              break
            case "ON":
              mainZoneXmlStatus.Power = Power.On
              break
          }

          return mainZoneXmlStatus
        }
      })
  }

  public async mainStatusLite(): Promise<MainZoneXmlStatusLite | null> {
    const mainZoneXmlStatusLite = <MainZoneXmlStatusLite>{};

    await fetch(this.baseUrlMainZoneXmlStatusLite)
      .then(async response => {
        if (response.ok) {
          const data = await response.text()

          const parser = new XMLParser(this.xmlParserOptions)
          const xmlData = parser.parse(data).item

          mainZoneXmlStatusLite.Power = xmlData.Power.value
          mainZoneXmlStatusLite.InputFuncSelect = xmlData.InputFuncSelect.value
          mainZoneXmlStatusLite.MasterVolume = xmlData.MasterVolume.value
        }
      })
      .catch(async error => {
        return null
      })

    return mainZoneXmlStatusLite
  }

  public async netAudioStatus(): Promise<NetAudioStatus | null> {
    const netAudioStatus = <NetAudioStatus>{};

    await fetch(this.baseUrlNetAudioStatus)
      .then(async response => {
        if (response.ok) {
          const data = await response.text()

          const parser = new XMLParser(this.xmlParserOptions)
          const xmlData = parser.parse(data).item

          netAudioStatus.SzLine = xmlData.szLine.value
          netAudioStatus.ChFlag = xmlData.chFlag.value
        }
      })
      .catch(async error => {
        return null
      })

    return netAudioStatus
  }
}
