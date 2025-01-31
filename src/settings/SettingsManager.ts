import { Preferences } from '@capacitor/preferences';

export class SettingsManager {
  private storageKey = 'IPAddress'

  public async saveIpAddress(ipAddress: string | undefined) {
    if (ipAddress != undefined && ipAddress != '') {
      console.log(`save ip address: ${ipAddress}`)
      await Preferences.set({
        key: this.storageKey,
        value: ipAddress,
      });
    }
    else {
      console.log(`remove ip address`)
      await Preferences.remove({ key: this.storageKey });
    }
  }

  public async loadIpAddress(): Promise<string | null> {
    const { value } = await Preferences.get({
      key:
        this.storageKey
    });

    console.log(`load ip address: ${value}`)

    return value;
  }
}