<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Music Server</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">  
        <ion-toolbar>
          <ion-title size="large">{{ $route.params.id }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <!-- <strong class="capitalize">{{ $route.params.id }}</strong>

        <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p> -->

        <ion-list>
          <ion-item v-for="(displayLine, index) in displayLines" @click="clickItem(index)">
            <ion-icon :icon="chevronForward" :class="{ invisible: !displayLine.IsSelected }"></ion-icon>
            <ion-label>{{ displayLine.Text }}</ion-label>
          </ion-item>
        </ion-list>

        <ion-button @click="updateList">
          <ion-icon :icon="refresh"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.PowerOn)">
          <ion-icon :icon="power"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.CursorLeft)">
          <ion-icon :icon="chevronBack"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.CursorRight)">
          <ion-icon :icon="chevronForward"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.CursorUp)">
          <ion-icon :icon="chevronUp"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.CursorDown)">
          <ion-icon :icon="chevronDown"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.PagePrevious)">
          <ion-icon :icon="caretDown"></ion-icon>
        </ion-button>
        <ion-button @click="executeCommandAndUpdate(Command.PageNext)">
          <ion-icon :icon="caretUp"></ion-icon>
        </ion-button>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar, onIonViewWillEnter, onIonViewWillLeave } from '@ionic/vue';
import { caretUp, caretDown, chevronBack, chevronForward, chevronDown, chevronUp, power, refresh } from 'ionicons/icons';
import { Device, DeviceInfo } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { DenonApiClient } from '@/api/denon/DenonApiClient'
import { DenonApiClientDemo } from "@/api/denon/DenonApiClientDemo";
import { IDenonApiClient } from "@/api/denon/IDenonApiClient";
import { Command } from "@/api/denon/Command";

let deviceInfo: DeviceInfo
let client: IDenonApiClient

// Vue lifecycle methods: https://ionicframework.com/docs/vue/lifecycle
onIonViewWillEnter(async () => {
  console.log("onIonViewWillEnter")

  await initDenonApiClient()

  // TODO: register polling
})

onIonViewWillLeave(async () => {
  console.log("onIonViewWillLeave")

  // TODO: unregister polling
})

onMounted(async () => {
  await logDeviceInfo()
})

async function initDenonApiClient() {
  const { value } = await Preferences.get({ key: 'IPAddress' });

  console.log(`IP: ${value}!`);

  const deviceInfo: DeviceInfo = await Device.getInfo();

  if (deviceInfo.platform === 'web') {
    client = new DenonApiClientDemo()
  }
  else {
    client = new DenonApiClient('192.168.1.165') // TODO: use IP from Preferences
  }
}

const logDeviceInfo = async () => {
  deviceInfo = await Device.getInfo();
  console.log(deviceInfo)
};

async function executeCommandAndUpdate(command: Command) {
  await client.executeCommand(command)
  await new Promise(resolve => setTimeout(resolve, 500));
  await updateList()
}

async function clickItem(index: number) {
  const selectedItemIndex = displayLines.value?.findIndex(item => item.IsSelected)

  console.log("index: " + index + " selected: " + selectedItemIndex)

  if (selectedItemIndex != undefined) {
    if (selectedItemIndex > index) {
      for (let i = 0; i < selectedItemIndex - index; i++) {
        console.log("i:" + i)
        await client.executeCommand(Command.CursorUp)
      }
    }
    if (selectedItemIndex < index) {
      for (let i = 0; i < index - selectedItemIndex; i++) {
        console.log("i:" + i)
        await client.executeCommand(Command.CursorDown)
      }
    }
    await executeCommandAndUpdate(Command.CursorRight)
  }
}

export type DisplayLine = {
  Text: string
  IsSelected: bool
  IsFile: bool
}

const displayLines = ref<Array<DisplayLine>>()

async function updateList() {
  let netAudioStatus = await client.netAudioStatus()

  displayLines.value = new Array()

  netAudioStatus.SzLine.forEach(element => {
    let displayLine = <DisplayLine>{}
    displayLine.Text = element
    displayLine.IsSelected = false
    displayLine.IsFile = false

    displayLines.value.push(displayLine)
  });

  var index = netAudioStatus.ChFlag.findIndex(item => item & 8) // TODO: check for other flags

  displayLines.value[index].IsSelected = true
}

</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container .invisible {
  visibility: hidden;
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
