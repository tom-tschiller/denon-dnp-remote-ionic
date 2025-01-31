<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <ion-input label="IP address" placeholder="Enter the device's IP address" error-text="Invalid IP address"
            :clear-input="true" @ionInput="validateIP" v-model="ipAddress"></ion-input>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, Ref } from "vue";
import { IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { SettingsManager } from "@/settings/SettingsManager";
import { DenonDeviceController } from "@/api/denon/DenonDeviceController";

const ipAddress = ref<string>()

const client: Ref<DenonDeviceController> | undefined = inject('client')

const settingsManager: SettingsManager = new SettingsManager()

onMounted(async () => {
  await loadIpAddress()
})

async function loadIpAddress() {
  ipAddress.value = await settingsManager.loadIpAddress() ?? '';
}

async function validateIP() {
  // https://stackoverflow.com/questions/4460586/javascript-regular-expression-to-check-for-ip-addresses
  if (ipAddress.value == undefined || ipAddress.value == '' || /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAddress.value)) {  
    await settingsManager.saveIpAddress(ipAddress.value)
    await client?.value.setIp(ipAddress.value)
  }  
}

</script>

<style scoped></style>