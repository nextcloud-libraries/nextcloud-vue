<template>
  <div class="preview-code">
    <div class="preview block">
      <slot name="preview"></slot>
    </div>
    <button @click="expand" style="width: 100%" type="tertiary-no-background">{{expanded ? 'Hide code' : 'Show code'}}</button>
    <div :class="`language-${lang} editor block ${expanded ? 'expanded' : 'not-expanded'}`">
      <slot name="editor"></slot>
    </div>
  </div>
</template>

<script setup>
import "prismjs/themes/prism-tomorrow.css";
import "vue-live/style.css";

import { ref } from 'vue'

defineProps({
  lang: String
})

const expanded = ref(false)

function expand() {
  expanded.value = !expanded.value
}
</script>

<style>
#content-vue {
  position: relative;
  height: 300px;
}

.preview-code {
  display: flex;
  flex-flow: column wrap;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e2e2;
}

.vp-doc .preview-code .block {
  flex-grow: 1;
  border-radius: 0;
  margin:0;
  min-height: 150px;
}

.preview-code .editor pre {
  margin: 0;
  box-sizing: border-box;
  border-radius: 0;
  overflow-y: scroll;
  white-space: pre-wrap;
}

.preview-code .editor.not-expanded{
  height: 0px;
  min-height: 0px;
}

.preview-code .editor.expanded pre {
  height: 100%;
  visibility: visible;
}
.preview-code .editor.not-expanded pre {
  visibility: hidden;
}

.preview-code .preview {
  background-color: rgb(249, 245, 245);
  text-align: center;
  box-sizing: border-box;
  padding: 12px;
}
@media (prefers-color-scheme: dark) {
  .preview-code .preview {
    background-color: rgb(31, 31, 31);
  }
}

.preview-code .prism-editor-wrapper {
  color: white;
  padding: 0;
}

.preview-code .prism-editor-wrapper .prism-editor__textarea,
.preview-code .prism-editor-wrapper .prism-editor__editor {
  padding: 20px;
}

@media only screen and (max-width: 568px) {
  .preview-code {
    display: block;
  }
  .preview-code .block {
    width: auto;
  }
}
@media only screen and (max-width: 419px) {
  .preview-code {
    margin: 0.85rem -1.5rem;
    border-radius: 0;
  }
}
</style>
