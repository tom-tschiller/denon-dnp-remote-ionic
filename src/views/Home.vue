<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" v-if="client?.isIpSet">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Power Status</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <p>Device IP: {{ client.getIp() }}</p>

          <p>
            <div v-if="!client?.isAvailable">The device is unavailable</div>
            <div v-if="client?.isAvailable && !client?.isOn">The device is available but turned off</div>
            <div v-if="client?.isAvailable && client?.isOn">The device is available and turned on</div>
          </p>
        </ion-card-content>

        <ion-button fill="clear" @click="toggleOnStandby" :disabled="!client?.isAvailable">
          <ion-icon slot="start" :icon="power"></ion-icon>
          <div v-if="client?.isOn">Standby</div>
          <div v-if="!client?.isOn">Power On</div>
        </ion-button>
      </ion-card>
    </ion-content>
    <ion-progress-bar v-if="progressBarIsOpen" type="indeterminate"></ion-progress-bar>
  </ion-page>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, Ref } from "vue";
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonPage, IonProgressBar, IonTitle, IonToolbar } from '@ionic/vue';

import { power } from 'ionicons/icons';

import { Command } from "@/api/denon/Command";
import { DenonDeviceController } from "@/api/denon/DenonDeviceController";

const progressBarIsOpen = ref<boolean>(false);

const client: Ref<DenonDeviceController> | undefined = inject('client')

onMounted(async () => {
})

async function toggleOnStandby() {
  if(client?.value){
    progressBarIsOpen.value = true

    if(client.value.isOn)
      await client.value.executeCommand(Command.PowerStandby)
    else(
      await client.value.executeCommand(Command.PowerOn)
    )
    await client.value.checkAvailability()

    progressBarIsOpen.value = false
  }
  else{
    console.log("client is undefined")
  }
}
</script>

<style scoped></style>
