import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { DenonApiClient } from '@/api/denon/client'
import { MainZoneXmlStatus, NetAudioStatus } from "@/api/denon/types";

describe('DenonDnp', () => {
  test.skip('main status', async () => {
    var client = new DenonApiClient('192.168.1.165')
    await client.mainStatus()
  })
  test('net audio status', async () => {
    var client = new DenonApiClient('192.168.1.165')
    let netAudioStatus : NetAudioStatus = await client.netAudioStatus()

    expect(netAudioStatus.ChFlag).toHaveLength(10)
    expect(netAudioStatus.SzLine).toHaveLength(10)
  })
  test.skip('power on', async () => {
    var client = new DenonApiClient('192.168.1.165')
    await client.powerOn()
  })
  test.skip('power standby', async () => {
    var client = new DenonApiClient('192.168.1.165')
    await client.powerStandby()
  })
})

