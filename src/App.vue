<template>
  <ion-app>
    <ion-loading :isOpen="loadingIsOpen" message="Loading..."> </ion-loading>

    <ion-tabs>
      <ion-router-outlet id="main-content"></ion-router-outlet>

      <ion-alert
        header="No IP address configured"
        message="You first have to configure the device's IP address in the settings"
        :isOpen="alertNoIpAddressSetIsOpen"
        :buttons="alertButtons"
        @didDismiss="() => alertNoIpAddressSetIsOpen = false"
        ></ion-alert>

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="home" />
          Home
        </ion-tab-button>
        <ion-tab-button tab="musicServer" href="/folder/1" :disabled="!client?.isOn" >
          <ion-icon :icon="musicalNotes" />
          Music Server
        </ion-tab-button>
        <!-- <ion-tab-button tab="radio">
          <ion-icon :icon="radio" />
          Radio
        </ion-tab-button>
        <ion-tab-button tab="library">
          <ion-icon :icon="library" />
          Library
        </ion-tab-button> -->
        <ion-tab-button tab="search" href="/settings">
          <ion-icon :icon="settings" />
          Settings
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-app>
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonApp,
  IonIcon,
  IonLoading,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/vue';
import { ref, onMounted, provide } from 'vue';
import router from "@/router";

import { home, musicalNotes, settings } from 'ionicons/icons';
import { Device, DeviceInfo } from '@capacitor/device';
import { SettingsManager } from './settings/SettingsManager';
import { DenonDeviceController } from './api/denon/DenonDeviceController';

const loadingIsOpen = ref<boolean>(false);
const tabBarData = ref()
const alertNoIpAddressSetIsOpen = ref<boolean>(false)

const client = ref<DenonDeviceController>();
provide('client', client)

onMounted(async () => {
  await initDenonApiClient()
})

async function initDenonApiClient() {
  const settingsManager: SettingsManager = new SettingsManager()
  const ip = await settingsManager.loadIpAddress() ?? '';

  if(!ip){
    alertNoIpAddressSetIsOpen.value = true
    return
  }

  const deviceInfo: DeviceInfo = await Device.getInfo();

  const demoMode = deviceInfo.platform === 'web'
  client.value = new DenonDeviceController(demoMode)

  loadingIsOpen.value = true;

  await client.value.setIp(ip)
  await client.value.checkAvailability()

  loadingIsOpen.value = false;
}

const alertButtons = [
  {
    text: 'Go to settings',
    handler: () => {
      router.push('/settings')
    },
  },
];

</script>

<style scoped>

</style>
