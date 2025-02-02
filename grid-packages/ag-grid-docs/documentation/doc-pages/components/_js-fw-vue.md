[[only-vue]]
|## Mixing JavaScript and Vue
|When providing Custom Components you have a choice of the following:
|
|1. Provide an AG Grid component in JavaScript.
|1. Provide an AG Grid component as an Vue Component.
|
|For example if you want to build a cell renderer you have the choice to build the cell renderer using either Vue or using plain JavaScript.
|
|The following code snippet shows how both JavaScript and Vue Components can be used at the same time:
|
|```js
|<template>
|   <ag-grid-vue :comps="comps" 
|                ...other properties>
|   </ag-grid-vue>
|</template>
|
|<script>
|//...other imports
|import {AgGridVue} from "@ag-grid-community/vue";
|import JavascriptComponent from './JavascriptComponent.js';
|import VueComponent from './VueComponent.vue';
|
|export default {
|   components: {
|       AgGridVue,
|       // Vue components are registered here
|       'vueComponent': VueComponent
|   }
|   data() {
|       return {
|           // JavaScript components are registered here
|           comps: [
|               // declare the javascript component
|               'javascriptComponent': JavascriptComponent
|           ],          
|           columnDefs: [
|                {
|                   headerName: "JS Cell",
|                   field: "value",
|                   cellRendererComp: 'javascriptComponent',    // reference/use the javascript component by name
|               },
|                {
|                   headerName: "JS Cell",
|                   field: "value",
|                   cellRendererComp: JavascriptComponent,    // reference/use the javascript component directly
|               },
|               {
|                   headerName: "Vue Cell",
|                   field: "value",
|                   cellRendererComp: 'vueComponent',  // reference/use the Vue component
|               }
|           ]
|       }
|   }
|   //...other properties & methods
|}
|</script>
|```
|