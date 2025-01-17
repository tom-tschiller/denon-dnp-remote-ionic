import { XMLParser, X2jOptions } from "fast-xml-parser"
import { MainZoneXmlStatus, NetAudioStatus, Power } from "./types";
import { IDenonApiClient } from "./IDenonApiClient";
import { Command } from "./Command";



export class DenonApiClient implements IDenonApiClient {
    private deviceIp: string = '192.168.1.165' // TODO: doesn't work

    private baseUrlCommand: string = `http://${this.deviceIp}/goform/formiPhoneAppDirect.xml`
    private baseUrlMainZoneXmlStatus: string = `http://${this.deviceIp}/goform/formMainZone_MainZoneXmlStatus.xml`
    private baseUrlNetAudioStatus: string = `http://${this.deviceIp}/goform/formNetAudio_StatusXml.xml`

    private xmlParserOptions: X2jOptions = {
        ignoreDeclaration: true,
    }

    constructor(
        private readonly ip: string,
    ) {
        this.deviceIp = ip
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

