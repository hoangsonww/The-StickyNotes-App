<template>
  <div id="app">
    <header-component></header-component>
    <div class="main-content">
      <sidebar-component></sidebar-component>
      <div class="content-area">
        <notes-component></notes-component>
        <calculator-component v-if="showCalculator"></calculator-component>
        <mood-tracker-component v-if="showMoodTracker"></mood-tracker-component>
      </div>
    </div>
    <footer-component></footer-component>
  </div>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';
import SidebarComponent from './components/SidebarComponent.vue';
import NotesComponent from './components/NotesComponent.vue';
import CalculatorComponent from './components/CalculatorComponent.vue';
import MoodTrackerComponent from './components/MoodTrackerComponent.vue';
import FooterComponent from './components/FooterComponent.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    SidebarComponent,
    NotesComponent,
    CalculatorComponent,
    MoodTrackerComponent,
    FooterComponent
  },
  data() {
    return {
      showCalculator: false,
      showMoodTracker: false,
    };
  },
  methods: {
    toggleCalculator() {
      this.showCalculator = !this.showCalculator;
    },
    toggleMoodTracker() {
      this.showMoodTracker = !this.showMoodTracker;
    },
  },
};
</script>

<style>
  #app {
    text-align: center;
  }
</style>
