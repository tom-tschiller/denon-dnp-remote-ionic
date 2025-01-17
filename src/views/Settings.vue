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
import { onMounted, ref } from "vue";
import { IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';

const ipAddress = ref<string>()

onMounted(async () => {
  await loadIpAddress()
})

async function loadIpAddress() {
  const { value } = await Preferences.get({ key: 'IPAddress' });

  console.log(`IP: ${value}!`);

  ipAddress.value = value;
}

async function saveIpAddress() {
  await Preferences.set({
    key: 'IPAddress',
    value: event.target.value,
  });
}

async function validateIP(event) {
  console.log(event.target.value)

  if (event.target.value == '') {
    await Preferences.remove({ key: 'IPAddress' });
  }

  if (true) { // TODO: validate IP address before saving
    await saveIpAddress()
  }
}

</script>

<style scoped></style>